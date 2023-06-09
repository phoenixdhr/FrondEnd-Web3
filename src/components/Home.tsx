import {  Stack,  Flex,  Heading,  Text,  Button,  Image,  Badge,} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import AbiAddress_NFTpunks from "@/hooks/useNFTpunks/artifacts/AbiAddress_NFTpunks";
import { ethers } from "ethers";
import { useToast } from '@chakra-ui/react'
import { useRouter } from "next/router";
import { ExternalProvider } from "@ethersproject/providers";


const Home = () => {

  const {abi, addressContract } = AbiAddress_NFTpunks
  const {status, address, isConnected } = useAccount();
  const router = useRouter()

  const [_status, setstatus] = useState("");
  const [_address, setaddress] = useState<string | undefined>(undefined);
  const [imageSrc, setImageSrc] =useState("")

  const [_totalSupply, setTotalSupply] = useState(0)
  const [_contractNFT, setContractNFT] = useState({})

  const toast = useToast()

  

  async function main () {

        if(_address!=undefined){

          const provider = new ethers.providers.Web3Provider(window.ethereum as unknown as ExternalProvider)

          const signers = await provider.getSigner()
          const contractNFT =await new ethers.Contract(addressContract.sepolia1,abi,signers)
          const totalSupplyBigN =  await contractNFT.totalSupply();
          const totalSupply= await Number(totalSupplyBigN);
          const ADNr = await contractNFT.deterministicPsudoRandomADN(totalSupply, _address);
          const imagenURL = await contractNFT.getImagenURI(ADNr)

          setImageSrc(imagenURL)

          setTotalSupply(Number(totalSupply))
          setContractNFT(contractNFT)      
      
        }

  }

  async function mint(){
   if (typeof window.ethereum !== 'undefined' ){

    const provider = new ethers.providers.Web3Provider(window.ethereum as unknown as ExternalProvider)
    const signers = await provider.getSigner()

    const contractNFT = new ethers.Contract(addressContract.sepolia1,abi,signers)

    try {
        
        const txMint = await contractNFT.safeMint({value: ethers.utils.parseEther('0.001')})
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
                    description: `${error.code} revisa tu balance de ETH en la red de Sepolia`,
                    status: 'error', 
                    duration: 2000,
                    isClosable: true,
                })
                
    }
   }

    
  }

  function toPunks() {
    router.push("/punks")
  }


  useEffect(() => {
    setstatus(status);
    setaddress(address)
    
    if(address!==undefined || _address!==undefined){
      main()
    }
   }, [status, address, _address])







  const [refreshData, set_refreshData] = useState(false); // 1. Nuevo estado


  useEffect(() => {
    if (router.isReady) {
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
            NFT Punk
          </Text>
          <br />
          <Text as={"span"} color={"green.400"}>
            
            nunca muere
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          NFT Punks es una colección de Avatares randomizados cuya metadata
          es almacenada on-chain. Poseen características únicas y sólo hay 10000
          en existencia. NFT Punks work with  <strong>Ethereum Sepolia Network.</strong>
        </Text>
        <Text color={"green.500"}>
          Cada NFT Punk se genera de forma secuencial basado en tu address,
          usa el previsualizador para averiguar cuál sería tu NFT Punk si
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


          <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6} onClick={toPunks}>
            Galería
          </Button>


        </Stack>
        <Text color={"green.8000"}>
          <b>COSTO DE MINT: 0.001 ETH</b> 
         </Text>
      </Stack>

      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={imageSrc=="" ? "https://avataaars.io/" : imageSrc} alt="NFT basico" />

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
