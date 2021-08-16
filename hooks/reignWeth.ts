import { CONTRACT_ADDRESSES, LP_EPOCH_REWARDS } from "@/constants";
import ERC20 from "@/contracts/ERC20.json";
import LPRewards from "@/contracts/LPRewards.json";
import UniswapV2Pair from "@/contracts/UniswapV2Pair.json";
import { getETHPrice } from "@/lib/coingecko";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import type { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import useStaking from "./contracts/useStaking";
import useContract from "./useContract";
import useReignPrice from "./useReignPrice";
import useWeb3Store, { State } from "./useWeb3Store";

const selector = (state: State) => state.chainId;

export function useREIGNWETHRewards() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.LPRewardsREIGNWETH[chainId], LPRewards);
}

function getREIGNWETHLPPrice(lpRewards: Contract, library: Web3Provider) {
  return async () => {
    const poolAddress: string = await lpRewards.depositLP();

    const uniswapV2Pair = new Contract(
      poolAddress,
      UniswapV2Pair,
      library.getSigner()
    );

    const totalSupply: BigNumber = await uniswapV2Pair.totalSupply();

    const reserves: [BigNumber, BigNumber, number] =
      await uniswapV2Pair.getReserves();

    const [, reserve1] = reserves;

    const ethPrice = await getETHPrice();

    const wethReserve = parseFloat(formatUnits(reserve1, 18));

    const wethReserveValue = wethReserve * ethPrice;

    const supply = parseFloat(formatUnits(totalSupply, 18));

    return (wethReserveValue / supply) * 2;
  };
}

export function useREIGNWETHLPPrice() {
  const library = useWeb3Store((state) => state.library);
  const chainId = useWeb3Store((state) => state.chainId);

  const lpRewards = useREIGNWETHRewards();

  const shouldFetch = !!library && !!lpRewards && typeof chainId === "number";

  return useSWR(
    shouldFetch ? ["REIGNWETHLPPrice", chainId] : null,
    getREIGNWETHLPPrice(lpRewards, library)
  );
}

function getREIGNWETHLPRewardsAPY(lpRewards: Contract, library: Web3Provider) {
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
    getREIGNWETHLPRewardsAPY(lpRewards, library)
  );
}

function getREIGNWETHLPRewardsExpectedRewards(
  staking: Contract,
  lpRewards: Contract,
  library: Web3Provider
) {
  return async (_: string, userAddress: string) => {
    const poolAddress: string = await lpRewards.depositLP();

    const poolTokenContract = new Contract(
      poolAddress,
      ERC20,
      library.getSigner()
    );

    const balanceLocked: BigNumber = await staking.balanceLocked(
      userAddress,
      poolAddress
    );

    const balanceOf: BigNumber = await poolTokenContract.balanceOf(
      staking.address
    );

    return (
      (parseFloat(formatUnits(balanceLocked, 18)) /
        parseFloat(formatUnits(balanceOf, 18))) *
      LP_EPOCH_REWARDS
    );
  };
}

export default function useREIGNWETHLPRewardsExpectedRewards(
  userAddress: string
) {
  const library = useWeb3Store((state) => state.library);

  const staking = useStaking();

  const lpRewards = useREIGNWETHRewards();

  const shouldFetch =
    !!library && !!staking && !!lpRewards && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["REIGNWETHLPRewardsExpectedRewards", userAddress] : null,
    getREIGNWETHLPRewardsExpectedRewards(staking, lpRewards, library),
    {
      shouldRetryOnError: false,
    }
  );
}
