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
import MainLayout from "@/layouts/main";
import { ChakraProvider } from "@chakra-ui/react";




const Punk = () => {

  const { status, address } = useAccount();
  const { abi, addressContract } = AbiAddress_NFTpunks;

  
  const [_status, set_status] = useState(status || "not connected");
  const [_IDataNFT, set_IDataNFT] = useState({});
  
  const [_owner, set_owner] = useState("")
  const [_ADN, set_ADN] = useState("")
  const [_atributos, set_atributos] = useState([])
  
  const router =useRouter()
  const provider = useProvider();


  

  async function main(tokenId: number) {
    
    const contractNFT = new ethers.Contract(addressContract.sepolia1,abi,provider);
    
    const totalSupply = Number(await contractNFT.totalSupply());
    console.log("totalSupply =>", totalSupply);

    if (totalSupply >= tokenId) {

                    const owner = await contractNFT.ownerOf(tokenId)
                    set_owner(owner)

                    const ADN = await contractNFT.tokenID_to_ADN(tokenId)                  
                    set_ADN(BigInt(ADN).toString(10))

                    const base64URL = await contractNFT.tokenURI(tokenId);

                    const base64 = base64URL.split(",")[1];
                    const dataNFT = atob(base64);
                    const dataNFTjs = JSON.parse(dataNFT);
                    set_IDataNFT(dataNFTjs);

                    const URLimagen = dataNFTjs.imagen
                    
                    const efe="sdfsf"
                    efe.substring(0,2)
                    const stringAtributos = URLimagen.slice(22).split("&")
                    console.log("atributor  ==>", stringAtributos );
                    // set_atributos

                    const arrayDeAtributos: { [key: string]: string }[] = stringAtributos.map((elemento: string) => {
                      const [clave, valor] = elemento.split("=")
                      return { [clave]: valor }
                    })
                    set_atributos(arrayDeAtributos)

                    console.log("arrayDeObjetos  ", arrayDeAtributos);
                    
                    

        }
        console.log("_IDataNFT =====>",_IDataNFT);
        console.log("_IDataNFT =====>",_IDataNFT.imagen);
        
  }



    
    useEffect(()=>{
        const id = router.query.id
        const tokenId = Number(id)
      
        main(tokenId);
       
        set_status(status || "not connected");
    },[, status])






//   const { loading, punk } = usePlatziPunkData(tokenId);

 

//   if (loading) return <Loading />;

  return (
    <ChakraProvider>
        <MainLayout>
            hola
            {status !== "connected" ? <RequestAccess /> : ""}


    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <PunkCard
          mx={{
            base: "auto",
            md: 0,
          }}
          name={_IDataNFT.name}
          imagen={_IDataNFT.imagen}
        />
        <Button disabled={address !== _owner} colorScheme="green">
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

