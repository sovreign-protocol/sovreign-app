import { EPOCH_DURATION } from "@/constants";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useGovRewards from "../contracts/useGovRewards";
import useWrappingRewards from "../contracts/useWrappingRewards";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function getEpochDates(contract: Contract) {
  return async (_: string) => {
    const epochStart: BigNumber = await contract.epochStart();

    const currentEpoch: BigNumber = await contract.getCurrentEpoch();

    const startDate =
      epochStart.toNumber() + (currentEpoch.toNumber() - 1) * EPOCH_DURATION;

    const endDate =
      epochStart.toNumber() + currentEpoch.toNumber() * EPOCH_DURATION;

    const progress =
      ((Date.now() - startDate * 1_000) / (EPOCH_DURATION * 1_000)) * 100;

    return {
      startDate,
      endDate,
      progress,
      relative: dayjs.unix(endDate).fromNow(true),
    };
  };
}

export function useEpochDatesGovRewards() {
  const contract = useGovRewards();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["EpochDGovRewards"] : null,
    getEpochDates(contract)
  );
}

export function useEpochDatesWrappingRewards() {
  const contract = useWrappingRewards();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["EpochDWrappingRewards"] : null,
    getEpochDates(contract)
  );
}
