import { ethers } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';

// The matamask class initializes a default provider.
// It is either metamask, or infura, or something else.
// If it can't initialize anything, 

export class Blockchain {
    // the provider (metamask by default, otherwise infura)
    provider;
    // the signer 
    signer;
    // the network we want to use (default homestead)
    network;
    // the chainId we want to use (default 1)
    chainId;

    constructor() {
        this.provider = null;
        this.signer = null;
        this.network = "homestead";
        this.chainId = 1;
    }

    async init() {
        // check if there's metamask
        const provider_info = await detectEthereumProvider({
            mustBeMetaMask: true // for now we only support metamask (because we need to wrap it with etherjs)
        });

        // if there's metamask, try to get it via etherjs
        if (provider_info) {
            try {
                this.provider = new ethers.providers.Web3Provider(window.ethereum);

                // debug
                window.provider = this.provider;
            } catch (error) {
                console.error(error);
                return;
            }
        } else {
            // otherwise, fallback
            this.provider = ethers.getDefaultProvider();
        }

        // check network
        if (!await this.check_network()) {
            return;
        }
    }

    async check_network() {
        if (!this.provider) {
            return false;
        }

        let network = await this.provider.getNetwork();
        console.log("network:", network);
        if (network.chainId != this.chainId || network.name != this.network) {
            console.log("you are on the wrong network. CityMayor is on the ethereum main network.");
            return false;
        }
        return true;
    }

    get_signer(contract) {
        if (!this.provider) {
            return null;
        }
        const signer = this.provider.getSigner();
        const contract_signer = contract.connect(signer);
        return { signer, contract_signer };
    }

    // gets the address of the user
    async user_address(signer) {
        if (!this.signer) {
            return null;
        }
        return await this.signer.getAddress();
    }

    async ens_name(address) {
        if (!this.provider) {
            return null;
        }
        let name = await this.provider.lookupAddress(address);
        if (name == null) {
            return address.substr(0, 10) + "...";
        } else {
            return name;
        }
    }
}

//
// Sunset all of that once we've moved to the class above
//

// get metamask provider
window.ethers = ethers;

// connects to metamask, or at least try
export async function get_provider() {
    const provider_info = await detectEthereumProvider({
        mustBeMetaMask: true // for now we only support metamask (because we need to wrap it with etherjs)
    });


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
