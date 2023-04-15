import React from "react";
import Balance from "@/components/Balance"
import MaxSupply from "@/components/MaxSupply";
import Home from "@/components/Home";
import { ChakraProvider } from "@chakra-ui/react";

import MainLayout from "../layouts/main"
import { useCounter } from "@/hooks/useCounter";


function Principal() {
  const {_count, increment, decrement}= useCounter(10)

  return(
  
    <ChakraProvider>
      <MainLayout>
      <Balance/>   
      <MaxSupply/>
      <Home/>
      </MainLayout>
      <button onClick={increment}>increment </button>
        <button onClick={decrement}> decrement</button>
        <h1>{_count}</h1>


    </ChakraProvider>
     
  
  )
}


export default Principal

