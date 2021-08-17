import type { BasketBalancer, ReignFacet } from "@/contracts/types";
import useSWR from "swr";
import { useBasketBalancer, useReignFacet } from "../useContract";
import useWeb3Store from "../useWeb3Store";

const getVotingPower =
  (reignFacet: ReignFacet, basketBalancer: BasketBalancer) =>
  async (_: string, userAddress: string) => {
    const lastEpochEnd = await basketBalancer.lastEpochEnd();

    const votingPowerAtTs = await reignFacet.votingPowerAtTs(
      userAddress,
      lastEpochEnd
    );

    const votingPower = await reignFacet.votingPower(userAddress);

    const reignStaked = await reignFacet.reignStaked();

    const reignStakedAtTs = await reignFacet.reignStakedAtTs(lastEpochEnd);

    return {
      votingPowerAtTs,
      votingPower,
      reignStaked,
      reignStakedAtTs,
    };
  };

export default function useVotingPower() {
  const account = useWeb3Store((state) => state.account);

  const reignFacet = useReignFacet();

  const basketBalancer = useBasketBalancer();

  const shouldFetch =
    !!reignFacet && !!basketBalancer && typeof account === "string";

  return useSWR(
    shouldFetch ? ["VotingPower", account] : null,
    getVotingPower(reignFacet, basketBalancer)
  );
}
