import { TOKEN_NAMES_BY_ADDRESS } from "@/constants";
import type { PoolRouter } from "@/contracts/types";
import useSWR from "swr";
import { usePoolRouter } from "../useContract";

function getPoolTokens(contract: PoolRouter) {
  return async () => {
    const values = await contract.getPoolTokens();

    const formatted = values
      .map((addr) => addr.toLowerCase())
      .map((address) => ({
        address: address,
        symbol: TOKEN_NAMES_BY_ADDRESS[address.toLowerCase()],
      }));

    return formatted;
  };
}

export default function useGetPoolTokens() {
  const contract = usePoolRouter();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["GetPoolTokens"] : null,
    getPoolTokens(contract)
  );
}
