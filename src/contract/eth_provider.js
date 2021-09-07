import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';

// get metamask provider
window.ethers = ethers;

// connects to metamask, or at least try
export async function get_provider() {
    const provider = await detectEthereumProvider();

    if (provider) {
        // From now on, this should always be true:
        // provider === window.ethereum
        //        return provider; // initialize your app
        window.provider = provider;
    } else {
        console.log('Please install MetaMask!');
        return null;
    }


    try {
        return new ethers.providers.Web3Provider(window.ethereum);
    } catch (error) {
        window.alert("you must have metamask to browse this page");
        console.error(error);
        return null;
    }
}

// make sure metamask is connected to the right network
export async function check_network(provider) {
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
export function get_signer(provider) {
    if (provider !== null) {
        const signer = provider.getSigner();
        window.signer = signer;
        return signer;
    } else {
        return null;
    }
}


// gets the address of the user
export async function user_address(signer) {
    return await signer.getAddress();
}
