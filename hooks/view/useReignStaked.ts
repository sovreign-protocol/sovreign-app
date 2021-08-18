import type { ReignFacet } from "@/contracts/types";
import useSWR from "swr";
import { useReignFacetProxy } from "../useContract";
import useWeb3Store from "../useWeb3Store";

function getReignStaked(contract: ReignFacet) {
  return async (_: string, user: string) => {
    const value = await contract.balanceOf(user);

    return value;
  };
}

export default function useReignStaked() {
  const account = useWeb3Store((state) => state.account);

  const contract = useReignFacetProxy();

  const shouldFetch = !!contract && typeof account === "string";

  return useSWR(
    shouldFetch ? ["ReignStaked", account] : null,
    getReignStaked(contract)
  );
}
