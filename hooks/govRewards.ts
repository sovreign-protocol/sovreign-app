import { GovRewards, ReignFacet } from "@/contracts/types";
import { btof } from "@/utils/bn";
import useSWR from "swr";
import { useGovRewards, useReignFacetProxy } from "./useContract";

function getGovRewardsExpectedRewards(
  reignFacet: ReignFacet,
  govRewards: GovRewards
) {
  return async (_: string, userAddress: string) => {
    const balanceOf = await reignFacet.balanceOf(userAddress);

    const reignStaked = await reignFacet.reignStaked();

    const rewardsForEpoch = await govRewards.getRewardsForEpoch();

    const expectedRewards =
      (btof(balanceOf) / btof(reignStaked)) * btof(rewardsForEpoch);

    return expectedRewards;
  };
}

export default function useGovRewardsExpectedRewards(userAddress: string) {
  const reignFacet = useReignFacetProxy();

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
