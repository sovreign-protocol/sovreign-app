import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useBasketBalancer from "../contracts/useBasketBalancer";

const getTokens = (contract: Contract) => async () => {
  const values: string[] = await contract.getTokens();

  return values;
};

export default function useGetTokens() {
  const contract = useBasketBalancer();

  const shouldFetch = !!contract;

  return useSWR(shouldFetch ? ["BasketTokens"] : null, getTokens(contract));
}
