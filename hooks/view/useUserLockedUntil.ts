import type { ReignFacet } from "@/contracts/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useSWR from "swr";
import { useReignFacet } from "../useContract";
import useWeb3Store from "../useWeb3Store";

dayjs.extend(utc);

function getUserLockedUntil(contract: ReignFacet) {
  return async (_: string, address: string) => {
    const lockedUntilTimestamp = await contract.userLockedUntil(address);

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
}

export default function useUserLockedUntil() {
  const account = useWeb3Store((state) => state.account);
  const contract = useReignFacet();

  const shouldFetch = !!contract && typeof account === "string";

  return useSWR(
    shouldFetch ? ["UserLockedUntil", account] : null,
    getUserLockedUntil(contract)
  );
}
