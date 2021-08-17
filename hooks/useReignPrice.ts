import type { LPRewards, UniswapV2Pair } from "@/contracts/types";
import UniswapV2Pair_ABI from "@/contracts/UniswapV2Pair.json";
import { getETHPrice } from "@/lib/coingecko";
import { Contract } from "@ethersproject/contracts";
import type { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import { useREIGNWETHRewards } from "./reignWeth";
import useWeb3Store from "./useWeb3Store";

function getReignPrice(lpRewards: LPRewards, library: Web3Provider) {
  return async () => {
    const poolAddress = await lpRewards.depositLP();

    const uniswapV2Pair = new Contract(
      poolAddress,
      UniswapV2Pair_ABI,
      library.getSigner()
    ) as UniswapV2Pair;

    const reserves = await uniswapV2Pair.getReserves();

    const [reserve0, reserve1] = reserves;

    const reignReserve = parseFloat(formatUnits(reserve0, 18));
    const wethReserve = parseFloat(formatUnits(reserve1, 18));

    const reignWethPrice = wethReserve / reignReserve;

    const ethPrice = await getETHPrice();

    const reignPrice = reignWethPrice * ethPrice;

    return reignPrice;
  };
}

export default function useReignPrice() {
  const library = useWeb3Store((state) => state.library);
  const chainId = useWeb3Store((state) => state.chainId);

  const lpRewards = useREIGNWETHRewards();

  const shouldFetch = !!library && !!lpRewards && typeof chainId === "number";

  return useSWR(
    shouldFetch ? ["ReignPrice", chainId] : null,
    getReignPrice(lpRewards, library)
  );
}
