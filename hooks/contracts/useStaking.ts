import { CONTRACT_ADDRESSES } from "@/constants";
import Staking from "@/contracts/Staking.json";
import useContract from "../useContract";
import useWeb3Store, { State } from "../useWeb3Store";

const selector = (state: State) => state.chainId;

export default function useStaking() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.Staking[chainId], Staking);
}
