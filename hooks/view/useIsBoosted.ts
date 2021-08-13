import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useWrappingRewards from "../contracts/useWrappingRewards";

function getIsBoosted(contract: Contract) {
  return async (_: string, user: string) => {
    const currentEpoch: BigNumber = await contract.getCurrentEpoch();

    const isBoosted: boolean = await contract.isBoosted(user, currentEpoch);

    return isBoosted;
  };
}

export default function useIsBoosted(userAddress: string) {
  const contract = useWrappingRewards();

  const shouldFetch = !!contract && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["IsBoosted", userAddress] : null,
    getIsBoosted(contract)
  );
}
