import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useBasketBalancer from "../contracts/useBasketBalancer";
import useReignFacet from "../contracts/useReignFacet";
import useWeb3Store from "../useWeb3Store";

const getVotingPower =
  (reignFacet: Contract, basketBalancer: Contract) =>
  async (_: string, userAddress: string) => {
    const lastEpochEnd = await basketBalancer.lastEpochEnd();

    const votingPowerAtTs: BigNumber = await reignFacet.votingPowerAtTs(
      userAddress,
      lastEpochEnd
    );

    const votingPower: BigNumber = await reignFacet.votingPower(userAddress);

    const reignStaked: BigNumber = await reignFacet.reignStaked();

    const reignStakedAtTs: BigNumber = await reignFacet.reignStakedAtTs(
      lastEpochEnd
    );

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
