import { CONTRACT_ADDRESSES } from "@/constants";
import BasketBalancer from "@/contracts/BasketBalancer.json";
import useContract from "../useContract";
import useWeb3Store, { State } from "../useWeb3Store";

const selector = (state: State) => state.chainId;

export default function useBasketBalancer() {
  const chainId = useWeb3Store(selector);

  return useContract(
    CONTRACT_ADDRESSES.BasketBalancer[chainId],
    BasketBalancer
  );
}
