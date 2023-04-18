import React from "react";
import Balance from "@/components/Balance";

import Home from "@/components/Home";
import { ChakraProvider } from "@chakra-ui/react";

import MainLayout from "../layouts/main/mainLayout";

function Principal() {


  
  return (
    <ChakraProvider>
      <MainLayout>
        <Balance />

        <Home />
      </MainLayout>
    </ChakraProvider>
  );
}

export default Principal;
