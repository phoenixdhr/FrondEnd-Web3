import { configureChains } from "wagmi";
import { createClient } from "wagmi";
import { getDefaultClient } from "connectkit";
import { mainnet, goerli, polygon, optimism, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const useClientWagmi = () => {
  if (typeof window !== "undefined" && "navigator" in window) {
    const { chains, provider } = configureChains(
      [sepolia, goerli, polygon, mainnet, optimism],
      [publicProvider()]
    );

    const client = createClient(
      getDefaultClient({
        autoConnect: true,
        appName: "Your App Name",
        chains,
        provider,
      })
    );

    return client;
  } else {
    return undefined; // Devuelve undefined si se está ejecutando en el servidor.
  }
};

export default useClientWagmi;