import { ethers } from "ethers";

// get metamask provider
export const provider = new ethers.providers.Web3Provider(window.ethereum);

// get a signer
export const signer = provider.getSigner()

export async function user_address(signer) {
    return await signer.getAddress();
}
