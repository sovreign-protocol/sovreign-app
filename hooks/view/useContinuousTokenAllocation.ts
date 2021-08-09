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
        const targetAllocationInWei: BigNumber =
          await contract.getTargetAllocation(poolAddress);

        const continuousVoteInWei: BigNumber = await contract.continuousVote(
          poolAddress
        );

        const continuousVote = parseFloat(formatUnits(continuousVoteInWei));

        const targetAllocation = parseFloat(formatUnits(targetAllocationInWei));

        const percentChange =
          ((continuousVote - targetAllocation) / targetAllocation) * 100;

        return {
          address: poolAddress,
          symbol: TOKEN_NAMES_BY_ADDRESS[poolAddress.toLowerCase()],
          allocation: continuousVote,
          percentChange,
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
