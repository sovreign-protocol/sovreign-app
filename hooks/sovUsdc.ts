import {
  CONTRACT_ADDRESSES,
  LP_EPOCH_REWARDS,
  SupportedChainId,
} from "@/constants";
import ERC20 from "@/contracts/ERC20.json";
import LPRewards from "@/contracts/LPRewards.json";
import UniswapV2Pair from "@/contracts/UniswapV2Pair.json";
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

export function useSOVUSDCRewards() {
  const chainId = useWeb3Store(selector);

  return useContract(CONTRACT_ADDRESSES.LPRewardsSOVUSDC[chainId], LPRewards);
}

function getSOVUSDCLPPrice(lpRewards: Contract, library: Web3Provider) {
  return async (_: string, chainId: number) => {
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

    const usdcReserve = parseFloat(
      formatUnits(reserve1, chainId === SupportedChainId.MAINNET ? 6 : 18)
    );

    const supply = parseFloat(formatUnits(totalSupply, 18));

    return (usdcReserve / supply) * 2;
  };
}

export function useSOVUSDCLPPrice() {
  const library = useWeb3Store((state) => state.library);
  const chainId = useWeb3Store((state) => state.chainId);

  const lpRewards = useSOVUSDCRewards();

  const shouldFetch = !!library && !!lpRewards && typeof chainId === "number";

  return useSWR(
    shouldFetch ? ["SOVUSDCLPPrice", chainId] : null,
    getSOVUSDCLPPrice(lpRewards, library)
  );
}

function getSOVUSDCLPRewardsAPY(lpRewards: Contract, library: Web3Provider) {
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
    getSOVUSDCLPRewardsAPY(lpRewards, library)
  );
}

function getSOVUSDCLPRewardsExpectedRewards(
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

export default function useSOVUSDCLPRewardsExpectedRewards(
  userAddress: string
) {
  const library = useWeb3Store((state) => state.library);

  const staking = useStaking();

  const lpRewards = useSOVUSDCRewards();

  const shouldFetch =
    !!library && !!staking && !!lpRewards && typeof userAddress === "string";

  return useSWR(
    shouldFetch ? ["SOVUSDCLPRewardsExpectedRewards", userAddress] : null,
    getSOVUSDCLPRewardsExpectedRewards(staking, lpRewards, library),
    {
      shouldRetryOnError: false,
    }
  );
}
