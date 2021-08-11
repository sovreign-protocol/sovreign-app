import LPRewards from "@/contracts/LPRewards.json";
import useContract from "../useContract";

export default function useLPRewards(address: string) {
  return useContract(address, LPRewards);
}
