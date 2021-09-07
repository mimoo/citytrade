import { defineStore } from 'pinia';
import { init_contract, get_cities, get_offers, get_city } from '@/contract/citymayor.js';
import { get_provider } from '@/contract/eth_provider';

export const useStore = defineStore('main', {
    state: () => {
        return {
            // list of cities
            cities: {},
            // list of offers that are still valid
            offers: {
                pending: [],
                sold: [],
            },
            // address -> CITYs
            balances: {}
        }
    },
    getters: {
        pending: (state) => {
            return state.offers.pending.map(offer => {
                // TODO: cities might not be set at this point
                let name = state.cities[offer.city_id].name;
                return { name, ...offer };
            }
            );
        },
        pending_desc() {
            let pending = this.pending;
            pending.sort((offer1, offer2) =>
                (offer1.price.gt(offer2.price)) ? -1 : 1
            );
            return pending;
        },
        sold: (state) => {
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
            console.log("debug", sold);
            sold.reverse();
            return sold;
        }
    },
    actions: {
        async init() {
            // init contract
            let provider = await get_provider();
            if (provider === null) {
                console.log("couldn't init store with provider");
                return;
            }
            let contract = await init_contract(provider);
            if (contract == null) {
                console.log("couldn't init store with contract");
                return;
            }

            // get cities quickly
            this.cities = await get_cities(contract);

            // get offers
            let { pending, city_sold, offers, void_offers, offers_cancelled } = await get_offers(provider, contract);
            this.offers.pending = pending;
            this.offers.sold = city_sold;

            // now get more information on each city
            for (const [city_id, city] of Object.entries(this.cities)) {
                let { owner, owner_ens, buyable } = await get_city(provider, contract, city.raw_city_id);
                this.cities[city_id].owner = owner;
                this.cities[city_id].owner_ens = owner_ens;
                this.cities[city_id].buyable = buyable;
            }
        }
    }
})