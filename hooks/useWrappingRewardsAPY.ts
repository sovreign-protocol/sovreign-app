import { EPOCH_REWARDS } from "@/constants/numbers";
import { TOKEN_ADDRESSES } from "@/constants/tokens";
import type { ERC20 } from "@/contracts/types";
import { scaleBy } from "@/utils/bn";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import { useTokenContract } from "./useContract";
import useReignPrice from "./useReignPrice";
import useSovPrice from "./useSovPrice";
import useWeb3Store from "./useWeb3Store";

function getWrappingRewardsAPY(sovToken: ERC20) {
  return async (_: string, sovPrice: number, reignPrice: number) => {
    const totalSupply = await sovToken.totalSupply();

    const totalSupplyWithoutSeededSupply = totalSupply.sub(scaleBy(3000, 18));

    const totalUSDValueSov =
      parseFloat(formatUnits(totalSupplyWithoutSeededSupply)) * sovPrice;

    const totalRewards = EPOCH_REWARDS * 52;

    const totalUSDRewards = totalRewards * reignPrice;

    const apy = (totalUSDRewards / totalUSDValueSov) * 100;

    return apy;
  };
}

export default function useWrappingRewardsAPY() {
  const chainId = useWeb3Store((state) => state.chainId);

  const sovToken = useTokenContract(TOKEN_ADDRESSES.SOV[chainId]);

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
