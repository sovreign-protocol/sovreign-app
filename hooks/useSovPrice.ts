import { SupportedChainId } from "@/constants/chains";
import { LPRewards, UniswapV2Pair } from "@/contracts/types";
import UniswapV2Pair_ABI from "@/contracts/UniswapV2Pair.json";
import { Contract } from "@ethersproject/contracts";
import type { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import { useSOVUSDCRewards } from "./useContract";
import useWeb3Store from "./useWeb3Store";

function getSovPrice(lpRewards: LPRewards, library: Web3Provider) {
  return async (_: string, chainId: number) => {
    const poolAddress = await lpRewards.depositLP();

    const uniswapV2Pair = new Contract(
      poolAddress,
      UniswapV2Pair_ABI,
      library.getSigner()
    ) as UniswapV2Pair;

    const reserves = await uniswapV2Pair.getReserves();

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

  const lpRewards = useSOVUSDCRewards();

  const shouldFetch = !!library && !!lpRewards && typeof chainId === "number";

  return useSWR(
    shouldFetch ? ["SovPrice", chainId] : null,
    getSovPrice(lpRewards, library)
  );
}
