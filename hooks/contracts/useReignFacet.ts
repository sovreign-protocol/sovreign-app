import { CONTRACT_ADDRESSES } from "@/constants";
import ReignFacet from "@/contracts/ReignFacet.json";
import useContract from "../useContract";
import useWeb3Store, { State } from "../useWeb3Store";

const selector = (state: State) => state.chainId;

export default function useReignFacet() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.ReignFacet[chainId], ReignFacet);
}
