import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useBasketBalancer from "../contracts/useBasketBalancer";
import useWeb3Store from "../useWeb3Store";

function getHasVotedInEpoch(contract: Contract) {
  return async (_: string, account: string) => {
    const epoch: number = await contract.getCurrentEpoch();

    const hasVotedInEpoch: boolean = await contract.hasVotedInEpoch(
      account,
      epoch
    );

    return hasVotedInEpoch;
  };
}

export default function useHasVotedInEpoch() {
  const account = useWeb3Store((state) => state.account);

  const contract = useBasketBalancer();

  const shouldFetch = !!contract && typeof account === "string";

  return useSWR(
    shouldFetch ? ["HasVotedInEpoch", account] : null,
    getHasVotedInEpoch(contract)
  );
}
