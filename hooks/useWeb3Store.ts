import type MetaMaskConnector from "@/lib/connectors/metamask";
import type { Web3Provider } from "@ethersproject/providers";
import omit from "lodash.omit";
import create from "zustand";

type State = {
  account?: string;
  chainId?: number;
  connector?: MetaMaskConnector;
  library?: Web3Provider;
  reset: () => void;
};

const useWeb3Store = create<State>((set) => ({
  reset: () =>
    set(
      (state) => omit(state, ["account", "chainId", "connector", "library"]),
      true
    ),
}));

export default useWeb3Store;
