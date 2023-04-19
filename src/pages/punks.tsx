import React from "react";
import { useState, useEffect } from "react";
import Balance from "@/components/Balance";
import { ChakraProvider } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";
import {
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormHelperText,
  FormControl,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import MainLayout from "../layouts/main/mainLayout";
import { useAccount } from "wagmi";
import RequestAccess from "@/components2/request-access/request-access";
import Loading from "@/components2/loading/loading";
import { ethers } from "ethers";
import AbiAddress_NFTpunks from "@/hooks/useNFTpunks/artifacts/AbiAddress_NFTpunks";
import { useProvider } from "wagmi";
import PunkCard from "@/components2/punk-card/punk-card";
import { useRouter } from "next/router";

import Link from "next/link";




function Punks() {

  type tElementoApi ={
    "name":string,
    "tokenID":string,
    "descipcion":string,
    "image":string
  }
  const { abi, addressContract } = AbiAddress_NFTpunks;
  const { status, address } = useAccount();
  const provider = useProvider();
  const [_status, set_status] = useState(status || "not connected");
  const [_dataApi, set_dataApi] = useState<tElementoApi[]>([]);

  const [_addressToId, set_addressToId] = useState("");
  const [_submitted, set_submitted] = useState(false);
  const [_validAddress, set_validAddress] = useState(false);

  const router = useRouter();

  async function main() {

    const contractNFT = new ethers.Contract(
      addressContract.sepolia1,
      abi,
      provider
    );

    const totalSupply = Number(await contractNFT.totalSupply());

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
  }


  useEffect(() => {
    main();
  }, [_dataApi.length]);

  function handleAddressChange(event:React.ChangeEvent<HTMLInputElement>) {
    const addresstoFind = event?.target.value;
    set_addressToId(addresstoFind);
    set_submitted(false);
    set_validAddress(false);
  }

  function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = ethers.utils.isAddress(_addressToId);

    set_submitted(true);

    if (res) {
      set_validAddress(true);

      router.push(`/address/${_addressToId}`);
    } else {
      set_validAddress(false);
    }
  }


  return (
    <ChakraProvider>
      <MainLayout>
        <Balance />

        <form onSubmit={submit}>
          <FormControl>
            <InputGroup mb={3}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>

              <Input
                isInvalid={false}
                value={_addressToId ?? ""}
                onChange={handleAddressChange}
                placeholder="Buscar por address"
              ></Input>

              <InputRightElement width="5.5rem">
                <Button type="submit" h="1.75rem" size="sm">
                  Buscar
                </Button>
              </InputRightElement>
            </InputGroup>

            {_submitted && !_addressToId && (
              <FormHelperText>Ingresa una direccion</FormHelperText>
            )}
            {_addressToId && _submitted && !_validAddress && (
              <FormHelperText>Direccion invalida</FormHelperText>
            )}
          </FormControl>
        </form>

        {status !== "connected" && _status=="connecting" ? <RequestAccess /> : ""}


        <Grid templateColumns="repeat(auto-fill, minmax(250px,1fr))" gap={6}>
          {status == "connected"
            ? _dataApi.map((Element:tElementoApi) => (
                <Link key={Element.tokenID} href={`/punks/${Element.tokenID}`} type="string">
                  <PunkCard
                    image={Element.image}
                    name={Element.name}
                    
                  ></PunkCard>
                </Link>
              ))
            : ""}
        </Grid>
      </MainLayout>
    </ChakraProvider>
  );
}

export default Punks;
