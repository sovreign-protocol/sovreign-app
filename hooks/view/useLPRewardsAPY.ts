import { CONTRACT_ADDRESSES, LP_EPOCH_REWARDS } from "@/constants";
import ERC20 from "@/contracts/ERC20.json";
import type { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import type { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import {
  useREIGNWETHRewards,
  useSOVUSDCRewards,
} from "../contracts/useLPRewards";
import { useREIGNWETHLPPrice, useSOVUSDCLPPrice } from "../useLPPrice";
import useReignPrice from "../useReignPrice";
import useWeb3Store from "../useWeb3Store";

function getLPRewardsAPY(lpRewards: Contract, library: Web3Provider) {
  return async (
    _: string,
    reignPrice: number,
    lpPrice: number,
    chainId: number
  ) => {
    const poolAddress: string = await lpRewards.depositLP();

    const poolTokenContract = new Contract(
      poolAddress,
      ERC20,
      library.getSigner()
    );

    const totalStaked: BigNumber = await poolTokenContract.balanceOf(
      CONTRACT_ADDRESSES.Staking[chainId]
    );

    const totalUSDValueStaked =
      parseFloat(formatUnits(totalStaked, 18)) * lpPrice;

    const totalRewards = LP_EPOCH_REWARDS * 52;

    const totalUSDRewards = totalRewards * reignPrice;

    const apy = (totalUSDRewards / totalUSDValueStaked) * 100;

    return apy;
  };
}

export function useSOVUSDCLPRewardsAPY() {
  const library = useWeb3Store((state) => state.library);
  const chainId = useWeb3Store((state) => state.chainId);

  const lpRewards = useSOVUSDCRewards();

  const { data: reignPrice } = useReignPrice();
  const { data: lpPrice } = useSOVUSDCLPPrice();

  const shouldFetch =
    !!lpRewards &&
    !!library &&
    typeof reignPrice === "number" &&
    typeof lpPrice === "number" &&
    typeof chainId === "number";

  return useSWR(
    shouldFetch ? ["SOVUSDCLPRewardsAPY", reignPrice, lpPrice, chainId] : null,
    getLPRewardsAPY(lpRewards, library)
  );
}

export function useREIGNWETHLPRewardsAPY() {
  const library = useWeb3Store((state) => state.library);
  const chainId = useWeb3Store((state) => state.chainId);

  const lpRewards = useREIGNWETHRewards();

  const { data: reignPrice } = useReignPrice();
  const { data: lpPrice } = useREIGNWETHLPPrice();

  const shouldFetch =
    !!lpRewards &&
    !!library &&
    typeof reignPrice === "number" &&
    typeof lpPrice === "number" &&
    typeof chainId === "number";

  return useSWR(
    shouldFetch
      ? ["REIGNWETHLPRewardsAPY", reignPrice, lpPrice, chainId]
      : null,
    getLPRewardsAPY(lpRewards, library)
  );
}
