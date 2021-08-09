import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useReignFacet from "../contracts/useReignFacet";
import useWeb3Store from "../useWeb3Store";

const getVotingPower =
  (contract: Contract) => async (_: string, userAddress: string) => {
    const value: BigNumber = await contract.votingPower(userAddress);

    return value;
  };

export default function useVotingPower() {
  const account = useWeb3Store((state) => state.account);

  const contract = useReignFacet();

  const shouldFetch = !!contract && typeof account === "string";

  return useSWR(
    shouldFetch ? ["VotingPower", account] : null,
    getVotingPower(contract)
  );
}
