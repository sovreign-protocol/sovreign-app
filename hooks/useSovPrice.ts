import { SupportedChainId } from "@/constants";
import UniswapV2Pair from "@/contracts/UniswapV2Pair.json";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import type { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import { useREIGNWETHRewards } from "./contracts/useLPRewards";
import useWeb3Store from "./useWeb3Store";

function getSovPrice(lpRewards: Contract, library: Web3Provider) {
  return async (_: string, chainId: number) => {
    const poolAddress: string = await lpRewards.depositLP();

    const uniswapV2Pair = new Contract(
      poolAddress,
      UniswapV2Pair,
      library.getSigner()
    );

    const reserves: [BigNumber, BigNumber, number] =
      await uniswapV2Pair.getReserves();

    const [reserve0, reserve1] = reserves;

    const sovReserve = parseFloat(formatUnits(reserve0, 18));

    const usdcReserve = parseFloat(
      formatUnits(reserve1, chainId === SupportedChainId.MAINNET ? 6 : 18)
    );

    const sovPrice = usdcReserve / sovReserve;

    return sovPrice;
  };
}

export default function useSovPrice() {
  const library = useWeb3Store((state) => state.library);
  const chainId = useWeb3Store((state) => state.chainId);

  const lpRewards = useREIGNWETHRewards();

  const shouldFetch = !!library && !!lpRewards && typeof chainId === "number";

  return useSWR(
    shouldFetch ? ["SovPrice", chainId] : null,
    getSovPrice(lpRewards, library)
  );
}
