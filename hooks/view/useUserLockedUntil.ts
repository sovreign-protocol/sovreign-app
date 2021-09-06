import type { GovRewards, ReignFacet } from "@/contracts/types";
import { btof } from "@/utils/bn";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useSWR from "swr";
import { useGovRewards, useReignFacetProxy } from "../useContract";
import useWeb3Store from "../useWeb3Store";

dayjs.extend(utc);

function getUserLockedUntil(reignFacet: ReignFacet, govRewards: GovRewards) {
  return async (_: string, address: string) => {
    const lockedUntilTimestamp = await reignFacet.userLockedUntil(address);

    const currentEpoch = await govRewards.getCurrentEpoch();

    const boost = await govRewards.getBoost(address, currentEpoch);

    const timestamp = lockedUntilTimestamp.toNumber();

    const isLocked = dayjs.unix(timestamp).isAfter(dayjs());

    const formatted = dayjs.unix(timestamp).format("MMM D, YYYY");

    const multiplier = btof(boost).toFixed(2);

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
  const reignFacet = useReignFacetProxy();
  const govRewards = useGovRewards();

  const shouldFetch =
    !!reignFacet && !!govRewards && typeof account === "string";

  return useSWR(
    shouldFetch ? ["UserLockedUntil", account] : null,
    getUserLockedUntil(reignFacet, govRewards)
  );
}
