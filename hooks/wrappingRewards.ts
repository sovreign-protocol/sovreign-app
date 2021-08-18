import { TOKEN_ADDRESSES } from "@/constants/tokens";
import { EPOCH_REWARDS } from "@/constants/numbers";
import type { ERC20, SovWrapper } from "@/contracts/types";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import { useSovWrapper, useTokenContract } from "./useContract";
import useWeb3Store from "./useWeb3Store";

function getWrappingRewardsExpectedRewards(
  sovWrapper: SovWrapper,
  sovToken: ERC20
) {
  return async (_: string, userAddress: string) => {
    const balanceLocked = await sovWrapper.balanceLocked(userAddress);

    const totalSupply = await sovToken.totalSupply();

    return (
      (parseFloat(formatUnits(balanceLocked, 18)) /
        parseFloat(formatUnits(totalSupply, 18))) *
      EPOCH_REWARDS
    );
  };
}

export default function useWrappingRewardsExpectedRewards(userAddress: string) {
  const chainId = useWeb3Store((state) => state.chainId);

  const sovToken = useTokenContract(TOKEN_ADDRESSES.SOV[chainId]);

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
