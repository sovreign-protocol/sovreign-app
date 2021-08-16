import { CONTRACT_ADDRESSES } from "@/constants";
import LPRewards from "@/contracts/LPRewards.json";
import useContract from "../useContract";
import useWeb3Store, { State } from "../useWeb3Store";

const selector = (state: State) => state.chainId;

export function useSOVUSDCRewards() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.LPRewardsSOVUSDC[chainId], LPRewards);
}

export function useREIGNWETHRewards() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.LPRewardsREIGNWETH[chainId], LPRewards);
}
