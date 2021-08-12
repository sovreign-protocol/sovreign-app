import EpochProgress from "@/components/harvest/epochProgress";
import GovRewardsHarvest from "@/components/harvest/govRewardsHarvest";
import LPRewardsHarvest from "@/components/harvest/lpRewardsHarvest";
import WrappingRewardsHarvest from "@/components/harvest/wrappingRewardsHarvest";
import { CONTRACT_ADDRESSES } from "@/constants";
import useWeb3Store, { State } from "@/hooks/useWeb3Store";
import { useMemo } from "react";

const selector = (state: State) => state.chainId;

function HarvestPage() {
  const chainId = useWeb3Store(selector);

  const LPRewardsREIGNWETH = useMemo<string>(
    () => CONTRACT_ADDRESSES.LPRewardsREIGNWETH[chainId],
    [chainId]
  );

  const LPRewardsSOVUSDC = useMemo<string>(
    () => CONTRACT_ADDRESSES.LPRewardsSOVUSDC[chainId],
    [chainId]
  );

  return (
    <section className="pt-8 md:pt-16 pb-8">
      <div className="px-5 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <EpochProgress />
          </div>

          <WrappingRewardsHarvest />

          <GovRewardsHarvest />

          <LPRewardsHarvest
            contractAddress={LPRewardsREIGNWETH}
            title="REIGN/WETH Pool Rewards"
          />

          <LPRewardsHarvest
            contractAddress={LPRewardsSOVUSDC}
            title="SOV/USDC Pool Rewards"
          />
        </div>
      </div>
    </section>
  );
}

export default HarvestPage;
