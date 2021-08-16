import UniswapV2Pair from "@/contracts/UniswapV2Pair.json";
import useContract from "../useContract";

export default function useUniswapV2Pair(address: string) {
  return useContract(address, UniswapV2Pair);
}
