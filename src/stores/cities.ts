import { defineStore } from 'pinia';
import { get_events, sort_events, get_country } from '@/contract/citymayor.js';
import { ens_name } from '@/contract/eth_provider.js';
import { ethers } from 'ethers';

// TODO: dump known ENS names in a json or something
const GET_USERNAME = false;

const CACHED_COUNTRIES =
    [["0", { "name": "France", "cities": [{ "type": "BigNumber", "hex": "0x00" }, { "type": "BigNumber", "hex": "0x12" }, { "type": "BigNumber", "hex": "0x2e" }, { "type": "BigNumber", "hex": "0x4b" }, { "type": "BigNumber", "hex": "0x4c" }, { "type": "BigNumber", "hex": "0x58" }, { "type": "BigNumber", "hex": "0x59" }, { "type": "BigNumber", "hex": "0x5d" }, { "type": "BigNumber", "hex": "0x5e" }, { "type": "BigNumber", "hex": "0x72" }, { "type": "BigNumber", "hex": "0x75" }] }], ["1", { "name": "Russia", "cities": [{ "type": "BigNumber", "hex": "0x01" }, { "type": "BigNumber", "hex": "0x5f" }, { "type": "BigNumber", "hex": "0x60" }, { "type": "BigNumber", "hex": "0x61" }, { "type": "BigNumber", "hex": "0x62" }, { "type": "BigNumber", "hex": "0x64" }, { "type": "BigNumber", "hex": "0x68" }, { "type": "BigNumber", "hex": "0x69" }, { "type": "BigNumber", "hex": "0x6a" }, { "type": "BigNumber", "hex": "0x6b" }, { "type": "BigNumber", "hex": "0x6c" }, { "type": "BigNumber", "hex": "0x6d" }, { "type": "BigNumber", "hex": "0x6e" }, { "type": "BigNumber", "hex": "0x6f" }, { "type": "BigNumber", "hex": "0x70" }, { "type": "BigNumber", "hex": "0x90" }] }], ["2", { "name": "China", "cities": [{ "type": "BigNumber", "hex": "0x02" }, { "type": "BigNumber", "hex": "0x13" }, { "type": "BigNumber", "hex": "0x15" }, { "type": "BigNumber", "hex": "0x17" }] }], ["3", { "name": "England", "cities": [{ "type": "BigNumber", "hex": "0x03" }, { "type": "BigNumber", "hex": "0x30" }, { "type": "BigNumber", "hex": "0x40" }, { "type": "BigNumber", "hex": "0x4a" }, { "type": "BigNumber", "hex": "0x57" }, { "type": "BigNumber", "hex": "0x74" }] }], ["5", { "name": "United States", "cities": [{ "type": "BigNumber", "hex": "0x04" }, { "type": "BigNumber", "hex": "0x11" }, { "type": "BigNumber", "hex": "0x14" }, { "type": "BigNumber", "hex": "0x28" }, { "type": "BigNumber", "hex": "0x2f" }, { "type": "BigNumber", "hex": "0x33" }, { "type": "BigNumber", "hex": "0x63" }, { "type": "BigNumber", "hex": "0x80" }, { "type": "BigNumber", "hex": "0x82" }, { "type": "BigNumber", "hex": "0x86" }, { "type": "BigNumber", "hex": "0x87" }, { "type": "BigNumber", "hex": "0x8b" }] }], ["6", { "name": "Canada", "cities": [{ "type": "BigNumber", "hex": "0x05" }, { "type": "BigNumber", "hex": "0x20" }, { "type": "BigNumber", "hex": "0x27" }, { "type": "BigNumber", "hex": "0x32" }, { "type": "BigNumber", "hex": "0x34" }, { "type": "BigNumber", "hex": "0x77" }, { "type": "BigNumber", "hex": "0x78" }, { "type": "BigNumber", "hex": "0x79" }] }], ["7", { "name": "South Korea", "cities": [{ "type": "BigNumber", "hex": "0x06" }, { "type": "BigNumber", "hex": "0x97" }, { "type": "BigNumber", "hex": "0xa0" }, { "type": "BigNumber", "hex": "0xa1" }, { "type": "BigNumber", "hex": "0xa2" }, { "type": "BigNumber", "hex": "0xa3" }, { "type": "BigNumber", "hex": "0xa4" }, { "type": "BigNumber", "hex": "0xa5" }] }], ["8", { "name": "Japan", "cities": [{ "type": "BigNumber", "hex": "0x07" }, { "type": "BigNumber", "hex": "0x38" }] }], ["9", { "name": "Romania", "cities": [{ "type": "BigNumber", "hex": "0x08" }, { "type": "BigNumber", "hex": "0x09" }, { "type": "BigNumber", "hex": "0xa7" }] }], ["10", { "name": "Netherlands", "cities": [{ "type": "BigNumber", "hex": "0x0a" }, { "type": "BigNumber", "hex": "0x98" }] }], ["11", { "name": "Spain", "cities": [{ "type": "BigNumber", "hex": "0x0b" }, { "type": "BigNumber", "hex": "0x2b" }, { "type": "BigNumber", "hex": "0x67" }, { "type": "BigNumber", "hex": "0x99" }, { "type": "BigNumber", "hex": "0x9e" }] }], ["12", { "name": "Germany", "cities": [{ "type": "BigNumber", "hex": "0x0c" }, { "type": "BigNumber", "hex": "0x31" }, { "type": "BigNumber", "hex": "0x91" }, { "type": "BigNumber", "hex": "0x9a" }] }], ["13", { "name": "North Korea", "cities": [{ "type": "BigNumber", "hex": "0x0d" }] }], ["14", { "name": "Singapore", "cities": [{ "type": "BigNumber", "hex": "0x0e" }] }], ["15", { "name": "United Arab Emirates", "cities": [{ "type": "BigNumber", "hex": "0x0f" }, { "type": "BigNumber", "hex": "0x21" }] }], ["16", { "name": "Sweden", "cities": [{ "type": "BigNumber", "hex": "0x10" }, { "type": "BigNumber", "hex": "0xa8" }] }], ["17", { "name": "Taiwan", "cities": [{ "type": "BigNumber", "hex": "0x16" }, { "type": "BigNumber", "hex": "0x8d" }, { "type": "BigNumber", "hex": "0x9b" }] }], ["18", { "name": "India", "cities": [{ "type": "BigNumber", "hex": "0x18" }, { "type": "BigNumber", "hex": "0x53" }, { "type": "BigNumber", "hex": "0x54" }, { "type": "BigNumber", "hex": "0x55" }] }], ["19", { "name": "Morocco", "cities": [{ "type": "BigNumber", "hex": "0x19" }, { "type": "BigNumber", "hex": "0x56" }] }], ["20", { "name": "Brazil", "cities": [{ "type": "BigNumber", "hex": "0x1a" }, { "type": "BigNumber", "hex": "0x4f" }, { "type": "BigNumber", "hex": "0x93" }] }], ["21", { "name": "Argentina", "cities": [{ "type": "BigNumber", "hex": "0x1b" }, { "type": "BigNumber", "hex": "0x88" }] }], ["22", { "name": "Congo", "cities": [{ "type": "BigNumber", "hex": "0x1c" }, { "type": "BigNumber", "hex": "0x9c" }, { "type": "BigNumber", "hex": "0x9d" }] }], ["23", { "name": "Australia", "cities": [{ "type": "BigNumber", "hex": "0x1d" }, { "type": "BigNumber", "hex": "0x29" }] }], ["24", { "name": "Kazakhstan", "cities": [{ "type": "BigNumber", "hex": "0x1e" }] }], ["25", { "name": "Turkey", "cities": [{ "type": "BigNumber", "hex": "0x1f" }] }], ["26", { "name": "Ukraine", "cities": [{ "type": "BigNumber", "hex": "0x22" }, { "type": "BigNumber", "hex": "0x7c" }, { "type": "BigNumber", "hex": "0x7d" }, { "type": "BigNumber", "hex": "0x7e" }, { "type": "BigNumber", "hex": "0x7f" }] }], ["27", { "name": "South Africa", "cities": [{ "type": "BigNumber", "hex": "0x23" }] }], ["28", { "name": "Thailand", "cities": [{ "type": "BigNumber", "hex": "0x24" }, { "type": "BigNumber", "hex": "0x2a" }] }], ["29", { "name": "Nigeria", "cities": [{ "type": "BigNumber", "hex": "0x25" }] }], ["30", { "name": "Iceland", "cities": [{ "type": "BigNumber", "hex": "0x26" }] }], ["31", { "name": "Tunisia", "cities": [{ "type": "BigNumber", "hex": "0x2c" }] }], ["33", { "name": "Hungary", "cities": [{ "type": "BigNumber", "hex": "0x2d" }] }], ["4", { "name": "Italy", "cities": [{ "type": "BigNumber", "hex": "0x35" }, { "type": "BigNumber", "hex": "0x39" }, { "type": "BigNumber", "hex": "0x5a" }, { "type": "BigNumber", "hex": "0x5b" }, { "type": "BigNumber", "hex": "0x96" }, { "type": "BigNumber", "hex": "0x9f" }] }], ["34", { "name": "Switzerland", "cities": [{ "type": "BigNumber", "hex": "0x36" }] }], ["37", { "name": "Botswana", "cities": [{ "type": "BigNumber", "hex": "0x37" }] }], ["35", { "name": "Finland", "cities": [{ "type": "BigNumber", "hex": "0x3a" }] }], ["36", { "name": "Norway", "cities": [{ "type": "BigNumber", "hex": "0x3b" }] }], ["38", { "name": "Namibia", "cities": [{ "type": "BigNumber", "hex": "0x3c" }] }], ["39", { "name": "Dominican Republic", "cities": [{ "type": "BigNumber", "hex": "0x3d" }] }], ["40", { "name": "Haiti", "cities": [{ "type": "BigNumber", "hex": "0x3e" }, { "type": "BigNumber", "hex": "0x3f" }] }], ["41", { "name": "Yemen", "cities": [{ "type": "BigNumber", "hex": "0x41" }] }], ["42", { "name": "Iran", "cities": [{ "type": "BigNumber", "hex": "0x42" }] }], ["43", { "name": "Afghanistan", "cities": [{ "type": "BigNumber", "hex": "0x43" }] }], ["44", { "name": "Mongolia", "cities": [{ "type": "BigNumber", "hex": "0x44" }] }], ["45", { "name": "New Zealand", "cities": [{ "type": "BigNumber", "hex": "0x45" }] }], ["46", { "name": "Peru", "cities": [{ "type": "BigNumber", "hex": "0x46" }, { "type": "BigNumber", "hex": "0x47" }, { "type": "BigNumber", "hex": "0x48" }] }], ["47", { "name": "Belgium", "cities": [{ "type": "BigNumber", "hex": "0x49" }, { "type": "BigNumber", "hex": "0x4d" }, { "type": "BigNumber", "hex": "0x5c" }, { "type": "BigNumber", "hex": "0x71" }, { "type": "BigNumber", "hex": "0x94" }] }], ["48", { "name": "Philippines", "cities": [{ "type": "BigNumber", "hex": "0x4e" }, { "type": "BigNumber", "hex": "0x51" }, { "type": "BigNumber", "hex": "0x52" }, { "type": "BigNumber", "hex": "0x8e" }] }], ["49", { "name": "Bolivia", "cities": [{ "type": "BigNumber", "hex": "0x50" }] }], ["50", { "name": "Colombia", "cities": [{ "type": "BigNumber", "hex": "0x65" }, { "type": "BigNumber", "hex": "0x66" }] }], ["51", { "name": "Zimbabwe", "cities": [{ "type": "BigNumber", "hex": "0x73" }] }], ["52", { "name": "Greenland", "cities": [{ "type": "BigNumber", "hex": "0x76" }] }], ["53", { "name": "Poland", "cities": [{ "type": "BigNumber", "hex": "0x7a" }, { "type": "BigNumber", "hex": "0x7b" }] }], ["54", { "name": "Nicaragua", "cities": [{ "type": "BigNumber", "hex": "0x81" }] }], ["56", { "name": "Mauritania", "cities": [{ "type": "BigNumber", "hex": "0x83" }] }], ["57", { "name": "Cameroon", "cities": [{ "type": "BigNumber", "hex": "0x84" }] }], ["58", { "name": "Malaysia", "cities": [{ "type": "BigNumber", "hex": "0x85" }] }], ["59", { "name": "Angola", "cities": [{ "type": "BigNumber", "hex": "0x89" }] }], ["60", { "name": "Madagascar", "cities": [{ "type": "BigNumber", "hex": "0x8a" }] }], ["62", { "name": "Egypt", "cities": [{ "type": "BigNumber", "hex": "0x8c" }] }], ["61", { "name": "Jordan", "cities": [{ "type": "BigNumber", "hex": "0x8f" }, { "type": "BigNumber", "hex": "0xa9" }] }], ["69", { "name": "Croatia", "cities": [{ "type": "BigNumber", "hex": "0x92" }] }], ["66", { "name": "Wales", "cities": [{ "type": "BigNumber", "hex": "0x95" }] }], ["70", { "name": "Czech Republic", "cities": [{ "type": "BigNumber", "hex": "0xa6" }] }]];


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
        get_offers: (state) => {
            let offers = Array.from(state.offers).map(([offer_id, offer]) => {
                const city_id = offer.cityId.toString();
                const { name, countryId, _ } = state.cities.get(city_id);
                const country = state.countries.get(countryId.toString()).name;
                const raw_price = offer.price;
                const price = ethers.utils.formatEther(raw_price.toString());
                let owner = offer.owner;
                if (owner && owner.length > 10) {
                    owner = owner.substr(0, 10) + '...';
                }
                const blockNumber = offer.blockNumber;
                const transactionHash = offer.transactionHash;
                return {
                    id: offer_id,
                    city_id,
                    city: name,
                    country,
                    raw_price,
                    price,
                    from: offer.offererAddress,
                    to: owner,
                    blockNumber,
                    transactionHash,
                }
            });
            return offers;
        },
        best_offers() {
            let offers = this.get_offers;

            offers.sort((c1, c2) => {
                if (c1.raw_price.gt(c2.raw_price)) {
                    return 1;
                } else {
                    return -1;
                }
            });

            return offers.reverse();
        },
        get_cities: (state) => {
            let cities = Array.from(state.cities).map(([city_id, city]) => {
                const buy_for = (!city.buy_for) ? 0 : ethers.utils.formatEther(city.buy_for.toString());
                const last_purchase_price = (!city.last_purchase_price) ? 0 : ethers.utils.formatEther(city.last_purchase_price.toString());
                const init_price = (!city.init_price) ? 0 : ethers.utils.formatEther(city.init_price.toString());
                const offers = city.offers.map((id) => id.toString());
                const country = state.countries.get(city.countryId.toString()).name;
                let owner = city.owner;
                if (owner && owner.length > 10) {
                    owner = owner.substr(0, 10) + '...';
                }
                return {
                    id: city_id,
                    country_id: city.countryId.toString(),
                    country,
                    name: city.name,
                    owner,
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
        num_cities() {
            return this.get_cities.length;
        },
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
            console.log("got all events. Processing now...");

            // add countries manually for now
            CACHED_COUNTRIES.forEach((c) => {
                this.$patch((state) => {
                    state.countries.set(c[0], {
                        name: c[1]["name"],
                        cities: [],
                    });
                });
            })

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
                        await this.process_offer_for_city(provider, e.blockNumber, e.transactionHash, e.args);
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
            console.log("finished processing all events");
            //            console.log(JSON.stringify(Array.from(this.countries)));

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
        async process_offer_for_city(provider, blockNumber, transactionHash, { offerId, cityId, price, offererAddress, owner, _ }) {
            // any new user?
            if (GET_USERNAME) {
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
            }
            // update cities and offers
            this.$patch((state) => {
                state.cities.get(cityId.toString()).offers.push(offerId);
                state.offers.set(offerId.toString(), {
                    cityId,
                    price,
                    offererAddress,
                    owner,
                    blockNumber,
                    transactionHash,
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
            // any new users?
            if (GET_USERNAME) {
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
