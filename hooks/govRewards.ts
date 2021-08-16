import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useGovRewards from "./contracts/useGovRewards";
import useReignFacet from "./contracts/useReignFacet";

function getGovRewardsExpectedRewards(
  reignFacet: Contract,
  govRewards: Contract
) {
  return async (_: string, userAddress: string) => {
    const balanceOf: BigNumber = await reignFacet.balanceOf(userAddress);

    const reignStaked: BigNumber = await reignFacet.reignStaked();

    const rewardsForEpoch = await govRewards.getRewardsForEpoch();

    return balanceOf.div(reignStaked).mul(rewardsForEpoch);
  };
}

export default function useGovRewardsExpectedRewards(userAddress: string) {
  const reignFacet = useReignFacet();

  const govRewards = useGovRewards();

  const shouldFetch =
    !!govRewards && !!reignFacet && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["GovRewardsExpectedRewards", userAddress] : null,
    getGovRewardsExpectedRewards(reignFacet, govRewards),
    {
      shouldRetryOnError: false,
    }
  );
}
