import { useMemo } from "react";
import { ethers } from "ethers";
import AbiAddress_NFTpunks from "./useNFTpunks/artifacts/AbiAddress_NFTpunks";
import { useAccount } from "wagmi";
import { useProvider } from "wagmi";
import { useSigner } from "wagmi";



async function useContract() {
    const { abi, addressContract } = AbiAddress_NFTpunks;
    const {status} = useAccount()
    const provider = useProvider()
    const {data, isError, isLoading} = useSigner({ chainId: 1})
    

 
    const signer = data
    console.log("status",status);


    //const contract = new ethers.Contract(addressContract.sepolia1, abi, data);
    //return contract;
    console.log(signer);
    
  }
  
  export default useContract;