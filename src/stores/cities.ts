import { defineStore } from 'pinia';
import { get_events, sort_events, get_country } from '@/contract/citymayor.js';
import { ens_name } from '@/contract/eth_provider.js';
import { ethers } from 'ethers';

export const useStore = defineStore('main', {
    state: () => ({
        initialized: false,
        countries: new Map(),
        cities: new Map(),
        events: {
            all: [],
            new_city: [],
            city_for_sale: [],
            city_not_for_sale: [],
            offer_for_city: [],
            cancel_offer_for_city: [],
            city_sold: [],
        },
        offers: new Map(),
        users: {},
    }),
    getters: {
        get_cities: (state) => {
            // convert cities types
            let cities = Array.from(state.cities).map(([city_id, city]) => {
                const buy_for = (!city.buy_for) ? 0 : ethers.utils.formatEther(city.buy_for.toString());
                const last_purchase_price = (!city.last_purchase_price) ? 0 : ethers.utils.formatEther(city.last_purchase_price.toString());
                const init_price = (!city.init_price) ? 0 : ethers.utils.formatEther(city.init_price.toString());
                const offers = city.offers.map((id) => id.toString());
                const country = state.countries.get(city.countryId.toString()).name;
                return {
                    id: city_id,
                    country_id: city.countryId.toString(),
                    country,
                    name: city.name,
                    owner: city.owner,
                    previous_owner: city.previous_owner,
                    buy_for,
                    last_purchase_price,
                    init_price,
                    offers,
                };
            });

            return cities;
        },
        // cities with the most amount of offers
        get_hotest_cities(state) {
            let cities = this.get_cities;

            cities.sort((c1, c2) => {
                if (c1.offers.length >= c2.offers.length) {
                    return 1;
                } else {
                    return -1;
                }
            });

            return cities;
        },
        // cities with the most expensive offers
        get_priciest_cities(state) {
            let cities = this.get_cities;

            cities.sort((c1, c2) => {
                // return early
                if (c2.offers.length == 0) {
                    return 1; // c2 has no offers
                } else if (c1.offers.length == 0) {
                    return -1; // c2 has offers and c1 has no offers
                }

                // calculate who has the highest offer
                let highest_offer = null;
                for (const offerId of c1.offers) {
                    const offer = state.offers.get(offerId.toString());
                    if (!offer) continue;
                    const price = offer.price;
                    if (!highest_offer) {
                        highest_offer = price;
                    } else if (price.gt(highest_offer)) {
                        highest_offer = price;
                    }
                }
                if (!highest_offer) {
                    return -1;
                }
                for (const offerId of c2.offers) {
                    const offer = state.offers.get(offerId.toString());
                    if (!offer) continue;
                    const price = offer.price;
                    if (price.gt(highest_offer)) {
                        return -1;
                    }
                }
                return 1;
            })

            return cities;
        },
        pending: (state) => {
            let offers = Array.from(state.offers).map(([offer_id, offer]) => {
                const price = ethers.utils.formatEther(offer.price.toString());
                return {
                    id: offer_id,
                    offererAddress: offer.offererAddress,
                };
            });
            offers.sort();
            return offers;
        },
        pending_desc() {
            /*
            let pending = this.pending;
            pending.sort((offer1, offer2) =>
                (offer1.price.gt(offer2.price)) ? -1 : 1
            );
            return pending;
            */
        },
        sold: (state) => {
            /*
            console.log("debuf_f", state.offers.sold);
            let sold = state.offers.sold.map(offer => {
                let city_id = offer.args.cityId.toString();
                let city = state.cities[city_id];
                if (!city) {
                    console.log("city not found")
                    return offer;
                }
                let name = city.name;
                let price_str = ethers.utils.formatEther(offer.args.price.toString());
                let previous_owner = offer.args.previousOwner;
                let new_owner = offer.args.newOwner;
                let offer_id = offer.args.offerId.toString();
                return { name, price_str, city_id, offer_id, previous_owner, new_owner, ...offer };
            });
            sold.reverse();
            return sold;
            */
        }
        //
    },
    actions: {
        async init(provider, contract) {
            // get all events and sort them
            const {
                new_city,
                city_for_sale,
                city_not_for_sale,
                offer_for_city,
                cancel_offer_for_city,
                city_sold,
            } = await get_events(contract);
            this.events.new_city = new_city;
            this.events.city_for_sale = city_for_sale;
            this.events.city_not_for_sale = city_not_for_sale;
            this.events.offer_for_city = offer_for_city;
            this.events.cancel_offer_for_city = cancel_offer_for_city;
            this.events.city_sold = city_sold;
            this.events.all = sort_events({
                new_city,
                city_for_sale,
                city_not_for_sale,
                offer_for_city,
                cancel_offer_for_city,
                city_sold,
            });

            // process events
            for (const e of this.events.all) {
                switch (e.event) {
                    // event NewCity(uint256 cityId, string name, uint256 price, uint16 countryId);
                    case 'NewCity':
                        await this.process_new_city(contract, e.args);
                        break;
                    // event CityForSale(uint16 cityId, uint256 price);
                    case 'CityForSale':
                        this.process_city_for_sale(e.args);
                        break;
                    // event CityNotForSale(uint16 cityId);
                    case 'CityNotForSale':
                        this.process_city_not_for_sale(e.args);
                        break;
                    // event OfferForCity(uint256 offerId, uint16 cityId, uint256 price, address offererAddress, address owner);                        
                    case 'OfferForCity':
                        await this.process_offer_for_city(provider, e.args);
                        break;
                    // event CancelOfferForCity(uint256 offerId);
                    case 'CancelOfferForCity':
                        this.process_cancel_offer_for_city(e.args);
                        break;
                    // event CitySold(uint16 cityId, uint256 price, address previousOwner, address newOwner, uint256 offerId);
                    case 'CitySold':
                        await this.process_city_sold(provider, e.args);
                        break;
                    default:
                        console.log("incorrect event received");
                        break;
                }
            }

            // done processing events
            this.initialized = true;
        },
        async process_new_city(contract, { cityId, name, price, countryId, _ }) {
            if (!this.countries.has(countryId.toString())) {
                const name = await get_country(contract, countryId);
                this.$patch((state) => {
                    state.countries.set(countryId.toString(), {
                        name,
                        cities: [cityId],
                    });
                });
            } else {
                this.$patch((state) => {
                    state.countries.get(countryId.toString()).cities.push(cityId);
                });
            }
            this.$patch((state) => {
                state.cities.set(cityId.toString(), {
                    cityId,
                    countryId,
                    name: name,
                    owner: null,
                    buy_for: price,

                    init_price: price,
                    last_purchase_price: null,
                    previous_owner: null,

                    offers: [],
                });
            });
        },
        process_city_for_sale({ cityId, price, _ }) {
            this.$patch((state) => {
                state.cities.get(cityId.toString()).buy_for = price;
            });
        },
        process_city_not_for_sale({ cityId, _ }) {
            this.$patch((state) => {
                state.cities.get(cityId.toString()).buy_for = null;
            });
        },
        async process_offer_for_city(provider, { offerId, cityId, price, offererAddress, owner, _ }) {
            for (const _owner of [offererAddress, owner]) {
                if (!(_owner in this.users)) {
                    let name = await ens_name(provider, _owner);
                    this.$patch((state) => {
                        state.users[_owner] = {
                            name,
                            balance: 0,
                        }
                    });
                }
            }
            this.$patch((state) => {
                state.cities.get(cityId.toString()).offers.push(offerId);
                state.offers.set(offerId.toString(), {
                    cityId,
                    price,
                    offererAddress,
                    owner,
                });
            });
        },
        process_cancel_offer_for_city({ offerId, _ }) {
            const city_id = this.offers.get(offerId.toString()).cityId.toString();
            const offers = this.cities.get(city_id).offers.filter(id => id != offerId);
            this.$patch((state) => {
                Object.assign(state.cities.get(city_id), { offers }); // TODO: this doesn't seem to work
                state.offers.delete(offerId.toString());
            });
        },
        async process_city_sold(provider, { cityId, price, previousOwner, newOwner, offerId, _ }) {
            // users we haven't seen before?
            for (const owner of [previousOwner, newOwner]) {
                if (!(owner in this.users)) {
                    let name = await ens_name(provider, owner);
                    this.$patch((state) => {
                        state.users[owner] = {
                            name,
                            balance: 0,
                        }
                    });
                }
            }
            // update city
            this.$patch((state) => {
                Object.assign(state.cities.get(cityId.toString()), {
                    last_purchase_price: price,
                    owner: newOwner,
                    previous_owner: previousOwner,
                });
            });
            // update offers if this was an offer accepted
            if (offerId != "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff") {
                const offers = this.cities.get(cityId.toString()).offers.filter(id => id != offerId);
                this.$patch((state) => {
                    Object.assign(state.cities.get(cityId.toString()), { offers }); // TODO: this doesn't seem to work
                    state.offers.delete(offerId.toString());
                });
            }

        }
    }
})
