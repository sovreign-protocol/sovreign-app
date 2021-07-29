import { CONTRACT_ADDRESSES } from "@/constants";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useERC20 from "../contracts/useERC20";
import useWeb3Store from "../useWeb3Store";

const getTokenAllowance =
  (contract: Contract) =>
  async (_: string, __: string, owner: string, spender: string) => {
    const value: BigNumber = await contract.allowance(owner, spender);

    return value;
  };

export default function useTokenAllowance(
  tokenAddress: string,
  owner: string,
  spender: string
) {
  const contract = useERC20(tokenAddress);

  const shouldFetch =
    !!contract &&
    typeof owner === "string" &&
    typeof tokenAddress === "string" &&
    typeof spender === "string";

  return useSWR(
    shouldFetch ? ["TokenBalance", tokenAddress, owner, spender] : null,
    getTokenAllowance(contract)
  );
}

export function useTokenAllowanceForPoolRouter(
  tokenAddress: string,
  owner: string
) {
  const chainId = useWeb3Store((state) => state.chainId);

  return useTokenAllowance(
    tokenAddress,
    owner,
    CONTRACT_ADDRESSES.PoolRouter[chainId]
  );
}

export function useTokenAllowanceForReignFacet(
  tokenAddress: string,
  owner: string
) {
  const chainId = useWeb3Store((state) => state.chainId);

  return useTokenAllowance(
    tokenAddress,
    owner,
    CONTRACT_ADDRESSES.ReignFacet[chainId]
  );
}
