import { CONTRACT_ADDRESSES } from "@/constants";
import WrappingRewards from "@/contracts/WrappingRewards.json";
import useContract from "../useContract";
import useWeb3Store, { State } from "../useWeb3Store";

const selector = (state: State) => state.chainId;

export default function useWrappingRewards() {
  const chainId = useWeb3Store(selector);

  return useContract(
    CONTRACT_ADDRESSES.WrappingRewards[chainId],
    WrappingRewards
  );
}
