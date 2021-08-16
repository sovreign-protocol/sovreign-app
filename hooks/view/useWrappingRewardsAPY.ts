import { EPOCH_REWARDS, TOKEN_ADDRESSES } from "@/constants";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import useERC20 from "../contracts/useERC20";
import useWeb3Store from "../useWeb3Store";
import useReignPrice from "../useReignPrice";
import useSovPrice from "../useSovPrice";

function getWrappingRewardsAPY(sovToken: Contract) {
  return async (_: string, sovPrice: number, reignPrice: number) => {
    const totalSupply: BigNumber = await sovToken.totalSupply();

    const totalUSDValueSov = parseFloat(formatUnits(totalSupply)) * sovPrice;

    const totalRewards = EPOCH_REWARDS * 52;

    const totalUSDRewards = totalRewards * reignPrice;

    const apy = (totalUSDRewards / totalUSDValueSov) * 100;

    return apy;
  };
}

export default function useWrappingRewardsAPY() {
  const chainId = useWeb3Store((state) => state.chainId);

  const sovToken = useERC20(TOKEN_ADDRESSES.SOV[chainId]);

  const { data: sovPrice } = useSovPrice();
  const { data: reignPrice } = useReignPrice();

  const shouldFetch =
    !!sovToken &&
    typeof chainId === "number" &&
    typeof sovPrice === "number" &&
    typeof reignPrice === "number";

  return useSWR(
    shouldFetch ? ["WrappingRewardsAPY", sovPrice, reignPrice, chainId] : null,
    getWrappingRewardsAPY(sovToken)
  );
}
