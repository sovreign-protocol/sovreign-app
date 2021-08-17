import type { Staking } from "@/contracts/types";
import useSWR from "swr";
import { useStaking } from "../useContract";

function getStakingBalanceLocked(contract: Staking) {
  return async (_: string, user: string, token: string) => {
    const balanceLocked = await contract.balanceLocked(user, token);

    return balanceLocked;
  };
}

export default function useStakingBalanceLocked(user: string, token: string) {
  const contract = useStaking();

  const shouldFetch =
    !!contract && typeof user === "string" && typeof token === "string";

  return useSWR(
    shouldFetch ? ["StakingBalanceLocked", user, token] : null,
    getStakingBalanceLocked(contract)
  );
}
