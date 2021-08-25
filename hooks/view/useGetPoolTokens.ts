import { Token } from "@/components/tokenSelect";
import { TOKEN_NAMES_BY_ADDRESS } from "@/constants/tokens";
import type { PoolRouter } from "@/contracts/types";
import useSWR from "swr";
import useBestBuy from "../useBestBuy";
import { usePoolRouter } from "../useContract";

function getPoolTokens(contract: PoolRouter) {
  return async (_: string, bestBuy?: Record<string, bigint>) => {
    const values = await contract.getPoolTokens();

    let formatted: Token[] = values
      .map((addr) => addr.toLowerCase())
      .map((address) => {
        return {
          address: address,
          symbol: TOKEN_NAMES_BY_ADDRESS[address],
        };
      });

    if (bestBuy) {
      formatted = formatted
        .map((poolToken) => {
          return {
            ...poolToken,
            out: bestBuy[poolToken.address],
          };
        })
        .sort((a, b) => (a.out < b.out ? -1 : a.out > b.out ? 1 : 0));
    }

    return formatted;
  };
}

export default function useGetPoolTokens() {
  const { data: bestBuy } = useBestBuy();

  const contract = usePoolRouter();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["GetPoolTokens", bestBuy] : null,
    getPoolTokens(contract)
  );
}
