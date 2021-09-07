import { ethers } from "ethers";

// get metamask provider
window.ethers = ethers;
export const provider = new ethers.providers.Web3Provider(window.ethereum);
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
export const signer = provider.getSigner()
window.signer = signer;

// gets the address of the user
export async function user_address(signer) {
    return await signer.getAddress();
}
