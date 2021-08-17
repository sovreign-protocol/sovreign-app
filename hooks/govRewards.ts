import { GovRewards, ReignFacet } from "@/contracts/types";
import useSWR from "swr";
import { useGovRewards, useReignFacet } from "./useContract";

function getGovRewardsExpectedRewards(
  reignFacet: ReignFacet,
  govRewards: GovRewards
) {
  return async (_: string, userAddress: string) => {
    const balanceOf = await reignFacet.balanceOf(userAddress);

    const reignStaked = await reignFacet.reignStaked();

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
