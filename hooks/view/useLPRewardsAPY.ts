import {
  CONTRACT_ADDRESSES,
  FARMING_POOL_NAMES,
  LP_EPOCH_REWARDS,
} from "@/constants";
import ERC20 from "@/contracts/ERC20.json";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import useLPRewards from "../contracts/useLPRewards";
import useLPPrice from "../useLPPrice";
import useReignPrice from "../useReignPrice";
import useWeb3Store from "../useWeb3Store";

function getLPRewardsAPY(lpRewards: Contract, library: Web3Provider) {
  return async (
    _: string,
    reignPrice: number,
    lpPrice: number,
    chainId: number
  ) => {
    try {
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

      console.log({
        totalUSDValueStaked,
        totalUSDRewards,
      });

      const apy = (totalUSDValueStaked / totalUSDRewards) * 100;

      console.log({ apy });

      return apy;
    } catch (error) {
      console.error(error);

      throw error;
    }
  };
}

export default function useLPRewardsAPY(pool: FARMING_POOL_NAMES) {
  const library = useWeb3Store((state) => state.library);
  const chainId = useWeb3Store((state) => state.chainId);

  const lpRewards = useLPRewards(CONTRACT_ADDRESSES[pool][chainId]);

  const { data: reignPrice } = useReignPrice();
  const { data: lpPrice } = useLPPrice(pool);

  const shouldFetch =
    !!lpRewards &&
    !!library &&
    typeof reignPrice === "number" &&
    typeof lpPrice === "number" &&
    typeof chainId === "number";

  return useSWR(
    shouldFetch ? ["LPRewardsAPY", reignPrice, lpPrice, chainId] : null,
    getLPRewardsAPY(lpRewards, library)
  );
}
