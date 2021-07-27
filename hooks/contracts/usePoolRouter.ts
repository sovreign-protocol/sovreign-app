import { CONTRACT_ADDRESSES } from "@/constants";
import PoolRouter from "@/contracts/PoolRouter.json";
import useContract from "../useContract";
import useWeb3Store, { State } from "../useWeb3Store";

const selector = (state: State) => state.chainId;

export default function usePoolRouter() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.PoolRouter[chainId], PoolRouter);
}
