import { TOKEN_NAMES_BY_ADDRESS } from "@/constants";
import useBasketBalancer from "@/hooks/contracts/useBasketBalancer";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";

function getContinuousTokenAllocation(contract: Contract) {
  return async () => {
    const tokens: string[] = await contract.getTokens();

    const tokenAllocations = await Promise.all(
      tokens.map(async (poolAddress) => {
        const allocationInWei: BigNumber = await contract.continuousVote(
          poolAddress
        );

        const allocation = parseFloat(formatUnits(allocationInWei));

        return {
          address: poolAddress,
          symbol: TOKEN_NAMES_BY_ADDRESS[poolAddress.toLowerCase()],
          allocationInWei,
          allocation,
        };
      })
    );

    return tokenAllocations;
  };
}

export default function useContinuousTokenAllocation() {
  const contract = useBasketBalancer();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["ContinuousTokenAllocation"] : null,
    getContinuousTokenAllocation(contract)
  );
}
