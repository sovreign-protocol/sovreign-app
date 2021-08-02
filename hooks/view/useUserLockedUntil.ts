import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useSWR from "swr";
import useReignFacet from "../contracts/useReignFacet";
import useWeb3Store from "../useWeb3Store";

dayjs.extend(utc);

const getUserLockedUntil =
  (contract: Contract) => async (_: string, address: string) => {
    const lockedUntilTimestamp: BigNumber = await contract.userLockedUntil(
      address
    );

    const timestamp = lockedUntilTimestamp.toNumber();

    const isLocked = dayjs.utc(timestamp).isAfter(dayjs());

    return { timestamp, isLocked };
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
