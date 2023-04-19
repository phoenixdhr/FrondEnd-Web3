import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import Loading from "@/components2/loading/loading";
import PunkCard from "@/components2/punk-card/punk-card";
import RequestAccess from "@/components2/request-access/request-access";
import { useProvider } from "wagmi";
import { useState, useEffect } from "react";
import AbiAddress_NFTpunks from "@/hooks/useNFTpunks/artifacts/AbiAddress_NFTpunks";
import { ethers } from "ethers";
import MainLayout from "@/layouts/main/mainLayout";
import { ChakraProvider } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { ExternalProvider } from "@ethersproject/providers";

type tAtributos ={
  "accessoriesType":string,
  "avatarStyle":string,
  "clotheType":string,
  "eyeType":string,
  "eyebrowType":string,
  "facialHairType":string,
  "hairColor":string,
  "mouthType":string,
  "skinColor":string,
  "topType":string
}


type ttElementoApi ={
  "name":string,
  "tokenID":string,
  "description":string,
  "image":string
}

const Punk = () => {
  const { status, address } = useAccount();
  const { abi, addressContract } = AbiAddress_NFTpunks;

  const [_status, set_status] = useState(status || "not connected");
  const [_IDataNFT, set_IDataNFT] = useState<ttElementoApi>({"name":"",
                                                             "tokenID":"",
                                                             "description":"",
                                                             "image":""});

  const [_owner, set_owner] = useState("");
  const [_ADN, set_ADN] = useState("");
  const [_atributos, set_atributos] = useState<tAtributos[]>([]);

  const [refreshData, set_refreshData] = useState(false);

  const router = useRouter();
  const toast = useToast();


  

  async function main(tokenId: number) {
    if(typeof window.ethereum !== 'undefined' ){
      const provider = new ethers.providers.Web3Provider(window.ethereum as unknown as ExternalProvider
        );
      const contractNFT = new ethers.Contract(
        addressContract.sepolia1,
        abi,
        provider
      );
  
      const totalSupply = Number(await contractNFT.totalSupply());
  
      if (totalSupply >= tokenId) {
        const owner = await contractNFT.ownerOf(tokenId);
        set_owner(owner);
  
        const ADN = await contractNFT.tokenID_to_ADN(tokenId);
        set_ADN(BigInt(ADN).toString(10));
  
        const base64URL = await contractNFT.tokenURI(tokenId);
  
        const base64 = base64URL.split(",")[1];
        const dataNFT = atob(base64);
        const dataNFTjs = JSON.parse(dataNFT);
        set_IDataNFT(dataNFTjs);
  
        const URLimage = dataNFTjs.image;
  
        const efe = "sdfsf";
        efe.substring(0, 2);
        const stringAtributos = URLimage.slice(22).split("&");
        // set_atributos
  
        const arrayDeAtributos = stringAtributos.map(
          (elemento: string) => {
            const [clave, valor] = elemento.split("=");
            return { [clave]: valor };
          }
        );
        set_atributos(arrayDeAtributos);
  
      }
    }


  }

  useEffect(() => {
    const id = router.query.id;
    const tokenId = Number(id);

    main(tokenId);

    set_status(status || "not connected");
  }, [, status]);

  async function transfer() {
    if(typeof window.ethereum !== 'undefined'){
      try {
        const id = router.query.id;
        const tokenId = Number(id);
        const to = prompt("ingresa un address de destino");
  
        const provider = new ethers.providers.Web3Provider(window.ethereum as unknown as ExternalProvider);
        const signer = provider.getSigner();
  
        const contractNFT = new ethers.Contract(
          addressContract.sepolia1,
          abi,
          signer
        );
  
        const tx = await contractNFT["safeTransferFrom(address,address,uint256)"](
          address,
          to,
          tokenId
        );
  
        toast({
          title: `Enviando  NFT `,
          description: `txHash ${tx.hash}`,
          status: "info",
          duration: 2000,
          isClosable: true,
        });
  
        await tx.wait();
  
        toast({
          title: `El NFT se envió con éxito`,
          description: `el NFT con Tokenid ${id} se envió a ${to}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error:any) {
        toast({
          title: "Error",
          description: `${error.code}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }

  useEffect(() => {
    if (router.isReady) {
      // 2. Efecto para actualizar el estado de _dataApi
      set_refreshData(true);
    }
  }, [router]);

  useEffect(() => {
    if (refreshData) {
      set_refreshData(false);
      const id = router.query.id;
      const tokenId = Number(id);

      main(tokenId);
    }
  }, [refreshData]);

  return (
    <ChakraProvider>
      <MainLayout>
        {status !== "connected" ? <RequestAccess /> : ""}
        <Stack
          spacing={{ base: 8, md: 10 }}
          py={{ base: 5 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack>
            <Box mx={{base: "auto", md: 0, }}>
            <PunkCard
              name={_IDataNFT.name}
              image={_IDataNFT.image}
            />
            </Box>
            
            <Button
              disabled={address !== _owner}
              colorScheme="green"
              onClick={transfer}
            >
              {address !== _owner ? "No eres el dueño" : "Transferir"}
            </Button>
          </Stack>
          <Stack width="100%" spacing={5}>
            <Heading>{_IDataNFT.name}</Heading>
            <Text fontSize="xl">{_IDataNFT.description}</Text>
            <Text fontWeight={600}>
              DNA:
              <Tag ml={2} colorScheme="green">
                {_ADN}
              </Tag>
            </Text>
            <Text fontWeight={600}>
              Owner:
              <Tag ml={2} colorScheme="green">
                {_owner}
              </Tag>
            </Text>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Atributo</Th>
                  <Th>Valor</Th>
                </Tr>
              </Thead>
              <Tbody>
                {_atributos.map((elemento) => (
                  <Tr key={Object.keys(elemento)[0]}>
                    <Td>{Object.keys(elemento)[0]}</Td>
                    <Td>
                      <Tag>{Object.values(elemento)[0]}</Tag>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Stack>
        </Stack>
      </MainLayout>
    </ChakraProvider>
  );
};

export default Punk;
