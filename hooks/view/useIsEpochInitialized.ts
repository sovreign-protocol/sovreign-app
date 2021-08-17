import type { BasketBalancer } from "@/contracts/types";
import useSWR from "swr";
import { useBasketBalancer } from "../useContract";

function getIsEpochInitialized(contract: BasketBalancer) {
  return async () => {
    const currentEpoch = await contract.getCurrentEpoch();

    const lastEpochUpdate = await contract.lastEpochUpdate();

    return currentEpoch.toNumber() === lastEpochUpdate.toNumber();
  };
}

export default function useIsEpochInitialized() {
  const contract = useBasketBalancer();

  return useSWR(
    !!contract ? ["IsEpochInitialized"] : null,
    getIsEpochInitialized(contract)
  );
}
