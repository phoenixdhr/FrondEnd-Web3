// MyComponent.jsx
import React from 'react'
import { useEffect, useState } from 'react'
import { useAccount } from "wagmi";
import { ethers } from "ethers";

// Make sure that this component is wrapped with ConnectKitProvider
const Mycomponent = () => {

  const { address, status } =  useAccount();
  const [_address, setAddress] = useState()
  const [_status,  setStatus] = useState()
  const [_balance, setBalance] =useState()


  useEffect(() => {      
    
    setAddress(address)
    setStatus(status)

    async function balance () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
        const bal = await provider.getBalance(address)
        const balanceFormat = ethers.utils.formatEther(bal).slice(0,5)
        setBalance(balanceFormat)
    }

    balance()
    }, [status, address]) 


  if (_status!="connected") 
  {return (<div> {_status}</div>);}

  console.log("_ballance => ",_balance);
  console.log("address => ", _address, typeof(_address));

  return (<div>
    <div> Connected Wallet:  {address.slice(0,6) + "..." +address.slice(38,42) } </div>
    <div> Balance:  {_balance} </div>
  </div>);
};

export default Mycomponent