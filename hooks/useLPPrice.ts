import { CONTRACT_ADDRESSES, SupportedChainId } from "@/constants";
import UniswapV2Pair from "@/contracts/UniswapV2Pair.json";
import { getETHPrice } from "@/lib/coingecko";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import type { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import useLPRewards from "./contracts/useLPRewards";
import useWeb3Store from "./useWeb3Store";

function getLPPrice(lpRewards: Contract, library: Web3Provider) {
  return async (
    _: string,
    chainId: number,
    pool: "LPRewardsREIGNWETH" | "LPRewardsSOVUSDC"
  ) => {
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

    if (pool === "LPRewardsREIGNWETH") {
      const ethPrice = await getETHPrice();

      const wethReserve = parseFloat(formatUnits(reserve1, 18));

      const wethReserveValue = wethReserve * ethPrice;

      const supply = parseFloat(formatUnits(totalSupply, 18));

      return (wethReserveValue / supply) * 2;
    }

    const usdcReserve = parseFloat(
      formatUnits(reserve1, chainId === SupportedChainId.MAINNET ? 6 : 18)
    );

    const supply = parseFloat(formatUnits(totalSupply, 18));

    return (usdcReserve / supply) * 2;
  };
}

export default function useLPPrice(
  pool: "LPRewardsREIGNWETH" | "LPRewardsSOVUSDC"
) {
  const library = useWeb3Store((state) => state.library);
  const chainId = useWeb3Store((state) => state.chainId);

  const lpRewards = useLPRewards(CONTRACT_ADDRESSES[pool][chainId]);

  const shouldFetch = !!library && !!lpRewards && typeof chainId === "number";

  return useSWR(
    shouldFetch ? ["LPPrice", chainId, pool] : null,
    getLPPrice(lpRewards, library)
  );
}
