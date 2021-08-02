import { CONTRACT_ADDRESSES } from "@/constants";
import GovRewards from "@/contracts/GovRewards.json";
import useContract from "../useContract";
import useWeb3Store, { State } from "../useWeb3Store";

const selector = (state: State) => state.chainId;

export default function useGovRewards() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.GovRewards[chainId], GovRewards);
}
