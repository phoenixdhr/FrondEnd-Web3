import React from "react";
import { useState, useEffect } from "react";
import Balance from "@/components/Balance";
import { ChakraProvider } from "@chakra-ui/react";
import MainLayout from "../layouts/main";
import { useAccount } from "wagmi";
import RequestAccess from "@/components2/request-access/request-access";
import Loading from "@/components2/loading/loading";
import { ethers } from "ethers";
import AbiAddress_NFTpunks from "@/hooks/useNFTpunks/artifacts/AbiAddress_NFTpunks";
import { useProvider } from "wagmi";
import PunkCard from "@/components2/punk-card/punk-card";
import { Grid } from '@chakra-ui/react'

function Punks() {
  const { abi, addressContract } = AbiAddress_NFTpunks;
  const { status, address } = useAccount();
  const provider = useProvider();
  const [_status, set_status] = useState(status || "not connected");
  const [_dataApi, set_dataApi] = useState([]);

  async function main() {
    //const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contractNFT = new ethers.Contract(
      addressContract.sepolia1,
      abi,
      provider
    );

    const totalSupply = Number(await contractNFT.totalSupply());
    console.log("totalSupply =>", totalSupply);

    const dataApi = [];
    if (totalSupply > 0) {
      for (let index = 0; index < totalSupply; index++) {
        const base64URL = await contractNFT.tokenURI(index);

        const base64 = base64URL.split(",")[1];
        const dataNFT = atob(base64);
        const dataNFTjs = JSON.parse(dataNFT);

        dataApi.push(dataNFTjs);
      }
      set_dataApi(dataApi);
    }

    // console.log("_dataApi[0]==>  ",_dataApi[0]);
    // console.log("_dataApi[0].imagen==>  ",_dataApi[0].imagen);
  }

  useEffect(() => {
    set_status(status || "not connected");
  }, [status]);

  useEffect(() => {
    main();
  }, [_dataApi.length]);

  return (
    <ChakraProvider>
      <MainLayout>
        <Balance/>

        {status !== "connected" ? <RequestAccess /> : ""}

        <> status: {status} </>
        <>_status: {_status}</>
        <Grid templateColumns='repeat(auto-fill, minmax(250px,1fr))' gap={6}>
        {status=="connected"? _dataApi.map((Element)=>(<PunkCard key={Element.tokenID} imagen={Element.imagen} name={Element.name}></PunkCard>)):""}
          </Grid>
      </MainLayout>
    </ChakraProvider>
  );
}

export default Punks;
