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

    const isLocked = dayjs.unix(timestamp).isAfter(dayjs());

    const formatted = dayjs.unix(timestamp).format("MMM D, YYYY");

    const multiplier = Number(
      (dayjs.unix(timestamp).diff(dayjs(), "days") / (365 * 2)) * 0.5 + 1
    ).toFixed(2);

    return {
      timestamp,
      formatted,
      multiplier,
      isLocked,
    };
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
