import {  Stack,  Flex,  Heading,  Text,  Button,  Image,  Badge,} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import AbiAddress_NFTpunks from "@/hooks/useNFTpunks/artifacts/AbiAddress_NFTpunks";
import { ethers } from "ethers";
import { useToast } from '@chakra-ui/react'

const Home = () => {

  const { status, address } = useAccount();
  const [_status, setstatus] = useState("");
  const [_address, setaddress] = useState(address);
  const [imageSrc, setImageSrc] =useState("")



  useEffect(() => {
    setstatus(status);
    setaddress(address);
  }, [status, address]);

  const {abi, addressContract } = AbiAddress_NFTpunks
  const [_totalSupply, setTotalSupply] = useState(0)
  const [_contractNFT, setContractNFT] = useState({})

  const toast = useToast()


  async function main () {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signers = await provider.getSigner()
                const Wallet = await signers.getAddress()

                const contractNFT = new ethers.Contract(addressContract.sepolia1,abi,signers)
                console.log("Wallet =>  ", Wallet);
                
                const totalSupplyBigN =  await contractNFT.totalSupply();
                const totalSupply= Number(totalSupplyBigN);
                const ADNr = await contractNFT.deterministicPsudoRandomADN(totalSupply, Wallet);
                const imagenURL = await contractNFT.getImagenURI(ADNr)

                setImageSrc(imagenURL)
                setTotalSupply(Number(totalSupply))
                setContractNFT(contractNFT)      
      
  }


  async function mint(){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signers = await provider.getSigner()
    const Wallet =signers.getAddress()

    const contractNFT = new ethers.Contract(addressContract.sepolia1,abi,signers)


    try {
        
        const txMint = await contractNFT.safeMint(Wallet)
                toast({
                    title: '',
                    description: `txHash ${txMint.hash}`,
                    status: 'info', 
                    duration: 2000,
                    isClosable: true,
                })

    
        await txMint.wait()
                toast({
                    title: 'La transaccion resulto con exito',
                    description: `el ID de ti NFT es: ${_totalSupply}`,
                    status: 'success', 
                    duration: 3000,
                    isClosable: true,
          

                })

    } catch (error:any) {
                        
        toast({
                    title: 'Error',
                    description: `${error.code}`,
                    status: 'error', 
                    duration: 2000,
                    isClosable: true,
                })
                
    }
    




  }



  useEffect(() => {
    
    if(_status!=="disconnected"){
        main()
    }    
  }, [status])
  


  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "green.400",
              zIndex: -1,
            }}
          >
            Un Platzi Punk
          </Text>
          <br />
          <Text as={"span"} color={"green.400"}>
            nunca para de aprender
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Platzi Punks es una colección de Avatares randomizados cuya metadata
          es almacenada on-chain. Poseen características únicas y sólo hay 10000
          en existencia.
        </Text>
        <Text color={"green.500"}>
          Cada Platzi Punk se genera de forma secuencial basado en tu address,
          usa el previsualizador para averiguar cuál sería tu Platzi Punk si
          minteas en este momento
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >

          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
            disabled={!_contractNFT}
            onClick={mint}
          >
            Obtén tu punk
          </Button>


          <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
            Galería
          </Button>


        </Stack>
      </Stack>

      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={_status=="connected" ? imageSrc : "https://avataaars.io/"} />

        {status ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                {_totalSupply}
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="green">
                {_address}
                </Badge>
              </Badge>
            </Flex>


            <Button
              onClick={main}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Actualizar
            </Button>



          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}



        
      </Flex>
    </Stack>
  );
};

export default Home;