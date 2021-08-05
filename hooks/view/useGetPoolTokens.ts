import { TOKEN_NAMES_BY_ADDRESS } from "@/constants";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import usePoolRouter from "../contracts/usePoolRouter";

const getPoolTokens = (contract: Contract) => async () => {
  const values: string[] = await contract.getPoolTokens();

  const formatted = values
    .map((addr) => addr.toLowerCase())
    .map((address) => ({
      address: address,
      symbol: TOKEN_NAMES_BY_ADDRESS[address.toLowerCase()],
    }));

  return formatted;
};

export default function useGetPoolTokens() {
  const contract = usePoolRouter();

  const shouldFetch = !!contract;

  return useSWR(
    shouldFetch ? ["GetPoolTokens"] : null,
    getPoolTokens(contract)
  );
}
