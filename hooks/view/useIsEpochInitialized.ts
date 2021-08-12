import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useBasketBalancer from "../contracts/useBasketBalancer";

function getIsEpochInitialized(contract: Contract) {
  return async () => {
    const currentEpoch: BigNumber = await contract.getCurrentEpoch();

    const lastEpochUpdate: BigNumber = await contract.lastEpochUpdate();

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
