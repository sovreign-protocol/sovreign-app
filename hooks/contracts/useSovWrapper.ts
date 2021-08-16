import { CONTRACT_ADDRESSES } from "@/constants";
import SovWrapper from "@/contracts/SovWrapper.json";
import useContract from "../useContract";
import useWeb3Store, { State } from "../useWeb3Store";

const selector = (state: State) => state.chainId;

export default function useSovWrapper() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.SovWrapper[chainId], SovWrapper);
}
