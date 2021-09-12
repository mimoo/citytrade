import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';

// The matamask class initializes a default provider.
// It is either metamask, or infura, or something else.
// If it can't initialize anything, 

const network = "homestead";

const chainId = 1;

export async function ens_name(provider, address) {
    return await provider.lookupAddress(address);
}

// get metamask provider
window.ethers = ethers;

// connects to metamask, or at least try
export async function get_provider() {
    // check if there's metamask
    const provider_info = await detectEthereumProvider({
        mustBeMetaMask: true // for now we only support metamask (because we need to wrap it with etherjs)
    });

    // if there's metamask, try to get it via etherjs
    if (provider_info) {
        try {
            console.log("provider is metamask");
            console.log(provider_info);
            return new ethers.providers.Web3Provider(provider_info);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // otherwise, fallback
    console.log("provider is default provider");
    return ethers.getDefaultProvider();
}

// make sure metamask is connected to the right network
export async function check_network(provider) {
    let network = await provider.getNetwork();
    console.log(network);
    if (network.chainId != 1 || network.name != "homestead") {
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
