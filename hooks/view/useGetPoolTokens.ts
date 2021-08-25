import { Token } from "@/components/tokenSelect";
import { TOKEN_NAMES_BY_ADDRESS } from "@/constants/tokens";
import type { PoolRouter } from "@/contracts/types";
import useSWR from "swr";
import useBestBuy from "../useBestBuy";
import { usePoolRouter } from "../useContract";

const TOKEN_LIST = {
  "0x6a22e5e94388464181578aa7a6b869e00fe27846": BigInt(1129294452757910212),
  "0x261efcdd24cea98652b9700800a13dfbca4103ff": BigInt(1080339331927678050),
  "0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6": BigInt(1073020868940829814),
  "0x0f83287ff768d1c1e17a42f44d644d7f22e8ee1d": BigInt(1064334363574703218),
  "0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb": BigInt(801873407649892730),
  "0x57ab1ec28d129707052df4df418d58a2d46d5f51": BigInt(789846902266101800),
};

function getPoolTokens(contract: PoolRouter) {
  return async (_: string) => {
    const values = await contract.getPoolTokens();

    const formatted: Token[] = values
      .map((addr) => addr.toLowerCase())
      .map((address) => {
        return {
          address: address,
          symbol: TOKEN_NAMES_BY_ADDRESS[address],
          out: TOKEN_LIST[address],
        };
      })
      .sort((a, b) => (a.out < b.out ? -1 : a.out > b.out ? 1 : 0));

    return formatted;
  };
}

export default function useGetPoolTokens() {
  const { data: bestBuy, error } = useBestBuy();

  console.log(bestBuy, error);

  const contract = usePoolRouter();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["GetPoolTokens"] : null,
    getPoolTokens(contract)
  );
}
