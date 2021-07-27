import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import usePoolRouter from "../contracts/usePoolRouter";

const getPoolTokens = (contract: Contract) => async () => {
  const values: string[] = await contract.getPoolTokens();

  return values;
};

export default function useGetPoolTokens() {
  const contract = usePoolRouter();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["GetPoolTokens"] : null,
    getPoolTokens(contract)
  );
}
