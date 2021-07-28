import ERC20 from "@/contracts/ERC20.json";
import useContract from "../useContract";

export default function useERC20(tokenAddress: string) {
  return useContract(tokenAddress, ERC20);
}
