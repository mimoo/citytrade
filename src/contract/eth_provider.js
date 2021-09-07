import { ethers } from "ethers";

// get metamask provider
window.ethers = ethers;

// connects to metamask, or at least try
function get_provider() {
    try {
        return new ethers.providers.Web3Provider(window.ethereum);
    } catch (error) {
        window.alert("you must have metamask to browse this page");
        console.error(error);
        return null;
    }
}

export const provider = get_provider();
window.provider = provider;

// make sure metamask is connected to the right network
export async function check_network() {
    let network = await provider.getNetwork();
    console.log(network);
    if (network.chainId != 1 || network.name != "homestead") {
        window.alert("you are on the wrong network. CityMayor is on the ethereum main network.");
        return false;
    } else {
        return true;
    }
}

// get a signer
function get_signer() {
    if (provider !== null) {
        return provider.getSigner();
    } else {
        return null;
    }
}

export const signer = get_signer();
window.signer = signer;

// gets the address of the user
export async function user_address(signer) {
    return await signer.getAddress();
}
