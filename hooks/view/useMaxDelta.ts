import useSWR from "swr";
import useBasketBalancer from "../contracts/useBasketBalancer";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";

function getMaxDelta(contract: Contract) {
  return async () => {
    const delta: BigNumber = await contract.maxDelta();

    return parseFloat(formatUnits(delta));
  };
}

export default function useMaxDelta() {
  const contract = useBasketBalancer();

  const shouldFetch = !!contract;

  return useSWR(shouldFetch ? ["MaxDelta"] : null, getMaxDelta(contract));
}
