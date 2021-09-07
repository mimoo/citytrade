import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';

// get metamask provider
window.ethers = ethers;

// connects to metamask, or at least try
export async function get_provider() {
    const provider_info = await detectEthereumProvider();
    console.log(provider_info);

    if (!provider_info) {
        console.log("you must have metamask to browse this page");
        return null;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        window.provider = provider;
        return provider;
    } catch (error) {
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
export function get_signer(provider, contract) {
    if (provider !== null) {
        const signer = provider.getSigner();
        const contract_signer = contract.connect(signer);
        return { signer, contract_signer };
    } else {
        return null;
    }
}


// gets the address of the user
export async function user_address(signer) {
    return await signer.getAddress();
}
