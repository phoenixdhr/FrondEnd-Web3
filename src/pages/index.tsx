import React from "react";
import Balance from "@/components/Balance"
import MaxSupply from "@/components/MaxSupply";
import Home from "@/components/Home";
import { ChakraProvider } from "@chakra-ui/react";

import MainLayout from "../layouts/main"

function Principal() {

  return(
  
    <ChakraProvider>
      <MainLayout>
      <Balance/>   
      <MaxSupply/>
      <Home/>
      </MainLayout>
      
    </ChakraProvider>
     
  
  )
}


export default Principal

