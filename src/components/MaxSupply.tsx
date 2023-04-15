import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import AbiAddress_NFTpunks from '@/hooks/useNFTpunks/artifacts/AbiAddress_NFTpunks'


function MaxSupply() {

    const {abi, addressContract } = AbiAddress_NFTpunks
    const [_MaxSupply, setMaxSupply] = useState(0)

    
    async function main () {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const signers = await provider.getSigner()
      
        const contractNFT = new ethers.Contract(addressContract.sepolia1,abi,signers)

        const maxSupply =  await contractNFT.maxSupply()
        const maxsupplyFormat = Number(maxSupply)

        setMaxSupply(maxsupplyFormat)
    }



    useEffect(() => {
      main()
    }, [])
    

  return (
    <div>MaxSupply: {_MaxSupply}</div>
  )
}

export default MaxSupply