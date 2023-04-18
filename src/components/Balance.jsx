import React from "react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import AbiAddress_NFTpunks from "@/hooks/useNFTpunks/artifacts/AbiAddress_NFTpunks";
import { useProvider } from "wagmi";
import { Badge } from "@chakra-ui/react";

const Balance = () => {
  const { address, status } = useAccount();
  const [_address, setAddress] = useState(address);
  const [_status, setStatus] = useState(status);
  const [_balance, setBalance] = useState(0);
  const [_maxSupply, set_maxSupply] = useState(0);
  const [_Supply, set_Supply] = useState(0);

  const { abi, addressContract } = AbiAddress_NFTpunks;

  const provider = useProvider();

  useEffect(() => {
    setAddress(address);
    setStatus(status);

    async function main() {
      const contractNFT = new ethers.Contract(
        addressContract.sepolia1,
        abi,
        provider
      );

      const bal = await provider.getBalance(address);
      const balanceFormat = ethers.utils.formatEther(bal).slice(0, 5);
      setBalance(balanceFormat);

      const maxSupply = Number(await contractNFT.maxSupply());
      set_maxSupply(maxSupply);

      const totalSupply = Number(await contractNFT.totalSupply());

      set_Supply(totalSupply);
    }

    if (address) {
      main();
    }
  }, [status, provider]);

  if (_status !== "connected") {
    return <div> <Badge>Total Supply NFT : <Badge  ml={1} colorScheme="blue">{_Supply}  </Badge> </Badge></div>;
  } else {
    return (
      <div>
        <div> <Badge>Mi Balance       : <Badge  ml={1} colorScheme="blue">{_balance} ETH </Badge></Badge> </div>
        <div> <Badge>Max Supply NFT   : <Badge  ml={1} colorScheme="blue">{_maxSupply}  </Badge> </Badge></div>
        <div> <Badge>Total Supply NFT : <Badge  ml={1} colorScheme="blue">{_Supply}  </Badge> </Badge></div>
      </div>
    );
  }
};

export default Balance;
