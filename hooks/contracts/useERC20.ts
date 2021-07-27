import { CONTRACT_ADDRESSES } from "@/constants";
import ERC20 from "@/contracts/ERC20.json";
import useContract from "../useContract";
import useWeb3Store, { State } from "../useWeb3Store";

const selector = (state: State) => state.chainId;

export default function useERC20() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.SOV_ERC20[chainId], ERC20);
}
