import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useReignFacet from "../contracts/useReignFacet";
import useWeb3Store from "../useWeb3Store";

const getUserLockedUntil =
  (contract: Contract) => async (_: string, address: string) => {
    const lockedUntilTimestamp: BigNumber = await contract.userLockedUntil(
      address
    );

    console.log("lockedUntilTimestamp", lockedUntilTimestamp.toString());

    return lockedUntilTimestamp;
  };

export default function useUserLockedUntil() {
  const account = useWeb3Store((state) => state.account);
  const contract = useReignFacet();

  const shouldFetch = !!contract && typeof account === "string";

  return useSWR(
    shouldFetch ? ["UserLockedUntil", account] : null,
    getUserLockedUntil(contract)
  );
}

export function useIsStakeLocked() {
  const { data: lockedUntilTimestamp } = useUserLockedUntil();

  return lockedUntilTimestamp?.toNumber() > Date.now();
}
