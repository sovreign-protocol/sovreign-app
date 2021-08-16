import { EPOCH_REWARDS, TOKEN_ADDRESSES } from "@/constants";
import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import useERC20 from "./contracts/useERC20";
import useSovWrapper from "./contracts/useSovWrapper";
import useWeb3Store from "./useWeb3Store";

function getWrappingRewardsExpectedRewards(
  sovWrapper: Contract,
  sovToken: Contract
) {
  return async (_: string, userAddress: string) => {
    const balanceLocked: BigNumber = await sovWrapper.balanceLocked(
      userAddress
    );

    const totalSupply: BigNumber = await sovToken.totalSupply();

    return (
      (parseFloat(formatUnits(balanceLocked, 18)) /
        parseFloat(formatUnits(totalSupply, 18))) *
      EPOCH_REWARDS
    );
  };
}

export default function useWrappingRewardsExpectedRewards(userAddress: string) {
  const chainId = useWeb3Store((state) => state.chainId);

  const sovToken = useERC20(TOKEN_ADDRESSES.SOV[chainId]);

  const sovWrapper = useSovWrapper();

  const shouldFetch =
    !!sovWrapper && !!sovToken && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["WrappingRewardsExpectedRewards", userAddress] : null,
    getWrappingRewardsExpectedRewards(sovWrapper, sovToken),
    {
      shouldRetryOnError: false,
    }
  );
}
