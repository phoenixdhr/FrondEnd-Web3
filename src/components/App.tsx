import React from "react";
import { configureChains} from 'wagmi'
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";
import { mainnet,goerli, polygon, optimism, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const {chains, provider} = configureChains([sepolia, goerli, polygon, mainnet, optimism], [publicProvider()])
  
const client = createClient( getDefaultClient({
                                      autoConnect:true,
                                      appName: "Your App Name",
                                      chains,
                                      provider,
                                    }),
                                  );

const App = () => {

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <ConnectKitButton />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;