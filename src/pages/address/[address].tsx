import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import MainLayout from "@/layouts/main/mainLayout";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import AbiAddress_NFTpunks from "@/hooks/useNFTpunks/artifacts/AbiAddress_NFTpunks";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { useProvider } from "wagmi";
import PunkCard from "@/components2/punk-card/punk-card";
import Link from "next/link";
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

function MyPunks() {
  const router = useRouter();
  const provider = useProvider();

  const address = router.query.address;

  const { status } = useAccount();
  const { abi, addressContract } = AbiAddress_NFTpunks;

  const [_status, set_status] = useState(status || "not connected");

  const [_address, set_address] = useState(address);
  const [_dataApi, set_dataApi] = useState([]);

  const [_addressToId, set_addressToId] = useState("");
  const [_submitted, set_submitted] = useState(false);
  const [_validAddress, set_validAddress] = useState(false);

  const [refreshData, set_refreshData] = useState(false); // 1. Nuevo estado

  async function main() {
    const address = router.query.address;
    set_address(address);

    const contractNFT = new ethers.Contract(
      addressContract.sepolia1,
      abi,
      provider
    );

    const balanceOf = Number(await contractNFT.balanceOf(_address));

    const myIDs = [];

    if (balanceOf > 0) {
      for (let index = 0; index < balanceOf; index++) {
        const element = Number(
          await contractNFT.tokenOfOwnerByIndex(_address, index)
        );
        myIDs.push(element);
      }
    }

    const dataApi = [];
    if (myIDs.length > 0) {
      for (let index = 0; index < myIDs.length; index++) {
        const base64URL = await contractNFT.tokenURI(myIDs[index]);

        const base64 = base64URL.split(",")[1];
        const dataNFT = atob(base64);
        const dataNFTjs = JSON.parse(dataNFT);

        dataApi.push(dataNFTjs);
      }
      set_dataApi(dataApi);
    }
  }

  function handleAddressChange(event) {
    const addresstoFind = event?.target.value;
    set_addressToId(addresstoFind);
    set_submitted(false);
    set_validAddress(false);
  }

  function submit(event) {
    event.preventDefault();
    const res = ethers.utils.isAddress(_addressToId);

    set_submitted(true);

    if (res) {
      set_validAddress(true);
      router.push(`/address/${_addressToId}`);
      set_address(_addressToId);
    } else {
      set_validAddress(false);
    }
  }

  useEffect(() => {
    set_status(status);
    main();
  }, [status, _address]);

  useEffect(() => {
    if (router.isReady) {
      // 2. Efecto para actualizar el estado de _dataApi
      set_refreshData(true);
    }
  }, [router]);

  useEffect(() => {
    if (refreshData) {
      set_refreshData(false);
      main();
    }
  }, [refreshData]);

  return (
    <ChakraProvider>
      <MainLayout>
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

        <Grid templateColumns="repeat(auto-fill, minmax(250px,1fr))" gap={6}>
          {status == "connected" && _address
            ? _dataApi.map((Element) => (
                <Link key={Element.tokenID} href={`/punks/${Element.tokenID}`}>
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

export default MyPunks;
