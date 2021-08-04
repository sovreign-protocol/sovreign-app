import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useReignFacet from "../contracts/useReignFacet";
import useWeb3Store from "../useWeb3Store";

const getReignStaked =
  (contract: Contract) => async (_: string, user: string) => {
    const value: BigNumber = await contract.balanceOf(user);

    return value;
  };

export default function useReignStaked() {
  const account = useWeb3Store((state) => state.account);

  const contract = useReignFacet();

  const shouldFetch = !!contract && typeof account === "string";

  return useSWR(
    shouldFetch ? ["ReignStaked", account] : null,
    getReignStaked(contract)
  );
}
