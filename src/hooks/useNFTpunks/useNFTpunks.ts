
import AbiAddress_NFTpunks from './artifacts/AbiAddress_NFTpunks'
import { ethers } from 'ethers'
import { useMemo } from 'react';
import { useAccount } from 'wagmi'


const {abi, addressContract } = AbiAddress_NFTpunks


async function useNFTpunks() {
    const { status, address } =  useAccount();


    const contractNFT =useMemo(async()=>{
        
     if(status =="connected"){

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signers = await provider.getSigner()
    
        return new ethers.Contract(addressContract.sepolia1,abi,provider)
                      
    }
    }, [status])

    return contractNFT

}

export default useNFTpunks