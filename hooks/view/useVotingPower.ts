import type { ReignFacet } from "@/contracts/types";
import useSWR from "swr";
import { useReignFacetProxy } from "../useContract";
import useWeb3Store from "../useWeb3Store";

function getVotingPower(reignFacet: ReignFacet) {
  return async (_: string, userAddress: string) => {
    const timestamp = Date.now();

    const votingPowerAtTs = await reignFacet.votingPowerAtTs(
      userAddress,
      timestamp
    );

    const votingPower = await reignFacet.votingPower(userAddress);

    const reignStaked = await reignFacet.reignStaked();

    const reignStakedAtTs = await reignFacet.reignStakedAtTs(timestamp);

    return {
      votingPowerAtTs,
      votingPower,
      reignStaked,
      reignStakedAtTs,
    };
  };
}

export default function useVotingPower() {
  const account = useWeb3Store((state) => state.account);

  const reignFacet = useReignFacetProxy();

  const shouldFetch = !!reignFacet && typeof account === "string";

  return useSWR(
    shouldFetch ? ["VotingPower", account] : null,
    getVotingPower(reignFacet)
  );
}
