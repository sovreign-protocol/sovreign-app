import { POOL_ADDRESS, TOKEN_ADDRESSES } from "@/constants";
import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import useSWR from "swr";
import useERC20 from "../contracts/useERC20";
import usePoolRouter from "../contracts/usePoolRouter";
import useWeb3Store from "../useWeb3Store";
import useTokenBalance from "./useTokenBalance";

function getGetTokenAmountOut(
  poolRouter: Contract,
  withdrawTokenContract: Contract
) {
  return async (
    _: string,
    withdrawToken: string,
    sovAmountIn: BigNumber,
    chainId: number
  ) => {
    const getTokenAmountOutSingle: BigNumber =
      await poolRouter.getTokenAmountOutSingle(withdrawToken, sovAmountIn, 1);

    const poolBalance: BigNumber = await withdrawTokenContract.balanceOf(
      POOL_ADDRESS[chainId]
    );

    const maxWithdraw = poolBalance.div(3);

    if (getTokenAmountOutSingle.gt(maxWithdraw)) {
      return maxWithdraw;
    }

    return getTokenAmountOutSingle;
  };
}

export default function useGetTokenAmountOut(withdrawToken: string) {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const { data: sovBalance } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.SOV[chainId]
  );

  const poolRouter = usePoolRouter();

  const withdrawTokenContract = useERC20(withdrawToken);

  const shouldFetch =
    !!poolRouter &&
    !!withdrawTokenContract &&
    !!sovBalance &&
    typeof withdrawToken === "string";

  return useSWR(
    shouldFetch
      ? ["GetTokenAmountOut", withdrawToken, sovBalance, chainId]
      : null,
    getGetTokenAmountOut(poolRouter, withdrawTokenContract)
  );
}
