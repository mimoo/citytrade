import { ethers } from "ethers";

// get metamask provider
export const provider = new ethers.providers.Web3Provider(window.ethereum);
