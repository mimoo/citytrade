import { ethers } from "ethers";
import { get_provider, ens_name, check_network } from "./eth_provider";

// citymayor contract address (obtained from citymayor.co)
const address = "0x4bdde1e9fbaef2579dd63e2abbf0be445ab93f10";

// the contract ABI (obtained from etherscan)
const abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "countries", "outputs": [{ "name": "name", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "monuments", "outputs": [{ "name": "name", "type": "string" }, { "name": "price", "type": "uint256" }, { "name": "owner", "type": "address" }, { "name": "cityId", "type": "uint16" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "BUY_CITY_FEE", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "UNITED_NATIONS_FUND", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "ECONOMY_BOOST_TRADE", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "cities", "outputs": [{ "name": "name", "type": "string" }, { "name": "price", "type": "uint256" }, { "name": "owner", "type": "address" }, { "name": "countryId", "type": "uint16" }, { "name": "buyable", "type": "bool" }, { "name": "last_purchase_price", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "unitedNations", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_amount", "type": "uint256" }], "name": "adminWithdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "MONUMENT_UN_FEE", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_monumentId", "type": "uint256" }, { "name": "_price", "type": "uint256" }], "name": "buyMonument", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_cityId", "type": "uint16" }], "name": "resolveSellCityForEther", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "offers", "outputs": [{ "name": "cityId", "type": "uint16" }, { "name": "price", "type": "uint256" }, { "name": "from", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_cityId", "type": "uint16" }, { "name": "_price", "type": "uint256" }], "name": "sellCityForEther", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_cityId", "type": "uint16" }], "name": "cancelSellCityForEther", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_cityId", "type": "uint16" }], "name": "buyCity", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }, { "name": "_price", "type": "uint256" }, { "name": "_countryId", "type": "uint16" }], "name": "adminAddCity", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "MAX_CITIES", "outputs": [{ "name": "", "type": "uint16" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "ECONOMY_BOOST", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_offerId", "type": "uint256" }], "name": "cancelOfferForCity", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }, { "name": "_price", "type": "uint256" }, { "name": "_cityId", "type": "uint16" }], "name": "adminAddMonument", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalOffer", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "MONUMENT_CITY_FEE", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }], "name": "adminAddCountry", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_offerId", "type": "uint256" }, { "name": "_cityId", "type": "uint16" }, { "name": "_price", "type": "uint256" }], "name": "acceptOfferForCity", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_cityId", "type": "uint16" }, { "name": "_owner", "type": "address" }], "name": "AdminBuyForSomeone", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_cityId", "type": "uint16" }, { "name": "_price", "type": "uint256" }, { "name": "from", "type": "address" }], "name": "makeOfferForCityForSomeone", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_cityId", "type": "uint16" }, { "name": "_price", "type": "uint256" }], "name": "makeOfferForCity", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_cityId", "type": "uint16" }, { "name": "_name", "type": "string" }, { "name": "_price", "type": "uint256" }, { "name": "_owner", "type": "address" }], "name": "adminEditCity", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "cityId", "type": "uint256" }, { "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "price", "type": "uint256" }, { "indexed": false, "name": "countryId", "type": "uint16" }], "name": "NewCity", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "monumentId", "type": "uint256" }, { "indexed": false, "name": "name", "type": "string" }, { "indexed": false, "name": "price", "type": "uint256" }, { "indexed": false, "name": "cityId", "type": "uint16" }], "name": "NewMonument", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "cityId", "type": "uint16" }, { "indexed": false, "name": "price", "type": "uint256" }], "name": "CityForSale", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "cityId", "type": "uint16" }, { "indexed": false, "name": "price", "type": "uint256" }, { "indexed": false, "name": "previousOwner", "type": "address" }, { "indexed": false, "name": "newOwner", "type": "address" }, { "indexed": false, "name": "offerId", "type": "uint256" }], "name": "CitySold", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "monumentId", "type": "uint256" }, { "indexed": false, "name": "price", "type": "uint256" }], "name": "MonumentSold", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "cityId", "type": "uint16" }], "name": "CityNotForSale", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "offerId", "type": "uint256" }, { "indexed": false, "name": "cityId", "type": "uint16" }, { "indexed": false, "name": "price", "type": "uint256" }, { "indexed": false, "name": "offererAddress", "type": "address" }, { "indexed": false, "name": "owner", "type": "address" }], "name": "OfferForCity", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "offerId", "type": "uint256" }], "name": "CancelOfferForCity", "type": "event" }];

// instantiate contract via a ETH provider
export async function init_contract(provider) {
    const contract = new ethers.Contract(address, abi, provider);
    return contract;
}

// CITY
/*
          string public name = "CityCoin";
          string public symbol = "CITY";
          uint8 public decimals = 0;

    mapping(address => uint256) balances;
    */

// metadata
/*
          address public unitedNations; // the UN organisation

          uint16 public MAX_CITIES = 5000; // maximum amount of cities in our world
          uint256 public UNITED_NATIONS_FUND = 5000000; // initial funding for the UN
          uint256 public ECONOMY_BOOST = 5000; // minted CITYs when a new city is being bought 

          uint256 public BUY_CITY_FEE = 3; // UN fee (% of ether) to buy a city from someon / 100e
          uint256 public ECONOMY_BOOST_TRADE = 100; // _immutable_ gift (in CITY) from the UN when a city is traded (shared among the cities of the relevant country)

          uint256 public MONUMENT_UN_FEE = 3; // UN fee (CITY) to buy a monument
          uint256 public MONUMENT_CITY_FEE = 3; // additional fee (CITY) to buy a monument (shared to the monument's city)
*/

// fetch more metadata about a single city (current owner, current price, etc.)
/*
export async function get_city(provider, contract, city_id) {
    // every city has more current information in the `cities` array
    let info = await contract.cities(city_id)

    let owner = info.owner;
    let owner_ens = await ens_name(provider, owner);

    let monuments = info.monuments;
    let last_purchase_price = ethers.utils.formatEther(info.last_purchase_price.toString());

    let buyable = null;
    if (info.buyable) {
        buyable = ethers.utils.formatEther(info.price.toString());
    }

    // return
    return {
        owner,
        owner_ens,
        buyable,
    };
}
*/

// fetch more metadata about a single country
export async function get_country(contract, countryId) {
    let name = await contract.countries(countryId)
    return name;
}

// expensive function to get block metadata based on block number
export async function get_block(provider, block_number) {
    let block = await provider.getBlock(block_number);
    let timestamp = block.timestamp;
    let date = new Date(timestamp * 1000).toLocaleDateString("en-US");
    return {
        date_str: date,
        ...block
    };
}

// get all events for the contract
export async function get_events(contract) {
    // event NewCity(uint256 cityId, string name, uint256 price, uint16 countryId);
    let filter = contract.filters.NewCity();
    let new_city = await contract.queryFilter(filter);

    // event CityForSale(uint16 cityId, uint256 price);
    filter = contract.filters.CityForSale();
    let city_for_sale = await contract.queryFilter(filter);

    // event CityNotForSale(uint16 cityId);
    filter = contract.filters.CityNotForSale();
    let city_not_for_sale = await contract.queryFilter(filter);

    // event OfferForCity(uint256 offerId, uint16 cityId, uint256 price, address offererAddress, address owner);
    filter = contract.filters.OfferForCity();
    let offer_for_city = await contract.queryFilter(filter);

    // event CancelOfferForCity(uint256 offerId);
    filter = contract.filters.CancelOfferForCity();
    let cancel_offer_for_city = await contract.queryFilter(filter);

    // event CitySold(uint16 cityId, uint256 price, address previousOwner, address newOwner, uint256 offerId);
    filter = contract.filters.CitySold();
    let city_sold = await contract.queryFilter(filter);

    return {
        new_city,
        city_for_sale,
        city_not_for_sale,
        offer_for_city,
        cancel_offer_for_city,
        city_sold,
    };
}

// sort all the events by block number
export function sort_events(events) {
    // aggregate events
    const {
        new_city,
        city_for_sale,
        city_not_for_sale,
        offer_for_city,
        cancel_offer_for_city,
        city_sold,
    } = events;
    const unsorted = [new_city, city_for_sale, city_not_for_sale, offer_for_city, cancel_offer_for_city, city_sold].flat();

    // sort events
    const sorted = unsorted.sort((e1, e2) => (e1.blockNumber >= e2.blockNumber) ? 1 : -1);

    return sorted;
}

// returns the balance of an address, should work with ENS address too.
export async function get_balance(contract, address) {
    let balance = await contract.balanceOf(address);
    return ethers.utils.parseEther(balance.toString());
}

/*
// fetch all the historical offers, as well as pending offers
export async function get_offers(provider, contract) {
    // get all the offers
    // event OfferForCity(uint256 offerId, uint16 cityId, uint256 price, address offererAddress, address owner);
    let filter_offers = contract.filters.OfferForCity();
    let offers = await contract.queryFilter(filter_offers);
    console.log("offers:", offers);

    // get all the cancelled offers
    // event CancelOfferForCity(uint256 offerId);
    let filter_offers_cancelled = contract.filters.CancelOfferForCity();
    let offers_cancelled = await contract.queryFilter(filter_offers_cancelled);
    console.log("offers_cancelled:", offers_cancelled);

    // get all accepted offers
    // CitySold(uint16 cityId, uint256 price, address previousOwner, address newOwner, uint256 offerId);
    // (city sold for the first time have an offer id of 0xfff...)
    let filter_city_sold = contract.filters.CitySold();
    let city_sold = await contract.queryFilter(filter_city_sold);
    console.log("city_sold:", city_sold);

    // format
    city_sold = await Promise.all(city_sold, async (offer) => {
        let block_number = offer.blockNumber;
        let block = await get_block(provider, block_number);
        return { date_str: block.date_str, ...offer };
    });

    // what are the pending offers? (not cancelled or accepted yet)
    let void_offers = new Set()
    for (let offer of city_sold) {
        void_offers.add(offer.args.offerId.toString());
    }
    for (let offer of offers_cancelled) {
        void_offers.add(offer.args.offerId.toString());
    }
    console.log("void_offers:", void_offers);
    let pending_offers = offers.filter(offer => !void_offers.has(offer.args.offerId.toString()));

    // convert
    let pending = [];
    for (let offer of pending_offers) {
        // event OfferForCity(uint256 offerId, uint16 cityId, uint256 price, address offererAddress, address owner);
        let offer_id = offer.args.offerId.toString();
        let city_id = offer.args.cityId.toString();
        let price = offer.args.price;
        let price_str = ethers.utils.formatEther(price.toString());
        let from = offer.args.offererAddress;
        let from_ens = await ens_name(provider, from);
        let owner = offer.args.owner; // ?

        pending.push({
            offer_id,
            city_id,
            price,
            price_str,
            from,
            from_ens,
        });
    }

    // sort pending offers by price DESC
    pending_offers.sort((offer1, offer2) =>
        (offer1.args.price.gt(offer2.args.price)) ? -1 : 1
    );

    // display the pending offers
    console.log("pending offers", pending_offers);
    for (offer of pending_offers) {
        // event OfferForCity(uint256 offerId, uint16 cityId, uint256 price, address offererAddress, address owner);
        let offer_id = offer.args.offerId.toString();
        let city_id = offer.args.cityId.toString();
        let city = cities[city_id].name;
        let price = ethers.utils.formatEther(offer.args.price.toString());
        let from = offer.args.offererAddress;
        let owner = offer.args.owner; // ?

        // print to HTML
        document.querySelector("#pending").innerHTML += `<li>#${offer_id}: ${from.substring(0, 10)}... offered ${price} for ${city}</li>`;
    }

    console.log(pending);


    return { pending, city_sold, offers, void_offers, offers_cancelled };
}
*/
