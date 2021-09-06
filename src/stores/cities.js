import { defineStore } from 'pinia';
import { provider } from '@/contract/eth_provider.js';
import { init_contract, get_cities, get_offers, get_city, get_balance, ens_name } from '@/contract/citymayor.js';

export const useStore = defineStore('main', {
    state: () => {
        return {
            // list of cities
            cities: {},
            // list of offers that are still valid
            offers: {
                pending: []
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
        }
    },
    actions: {
        async init() {
            let contract = init_contract();

            // get citieas quickly
            this.cities = await get_cities(contract);

            // get offers
            let { pending, city_sold, offers, void_offers, offers_cancelled } = await get_offers(contract);
            this.offers.pending = pending;


        }
    }
})