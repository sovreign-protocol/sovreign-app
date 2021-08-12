import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useStaking from "../contracts/useStaking";

function getStakingBalanceLocked(contract: Contract) {
  return async (_: string, user: string, token: string) => {
    const balanceLocked: BigNumber = await contract.balanceLocked(user, token);

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
