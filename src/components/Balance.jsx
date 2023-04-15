// MyComponent.jsx
import React from 'react'
import { useEffect, useState } from 'react'
import { useAccount } from "wagmi";
import { ethers } from "ethers";

// Make sure that this component is wrapped with ConnectKitProvider
const Balance = () => {

  const { address, status } =  useAccount();
  const [_address, setAddress] = useState(address)
  const [_status,  setStatus] = useState(status)
  const [_balance, setBalance] =useState(0)



  useEffect(() => {      
    
    setAddress(address)
    setStatus(status)

    async function balance () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
        const bal = await provider.getBalance(address)
        const balanceFormat = ethers.utils.formatEther(bal).slice(0,5)
        setBalance(balanceFormat)
    }

    if (address) {balance()}    


    }, [status, address]) 


  if (_status!="connected") 
  {return (<div> {_status}</div>);}


  return (<div>
    {/* <div> Connected Wallet:  {address? "" : address.slice(0,6) + "..." +address.slice(38,42) } </div> */}
    <div> Balance:  {_balance} </div>
  </div>);
};

export default Balance