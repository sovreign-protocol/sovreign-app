import EpochProgress from "@/components/harvest/epochProgress";
import GovRewardsHarvest from "@/components/harvest/govRewardsHarvest";
import LPRewardsHarvest from "@/components/harvest/lpRewardsHarvest";
import WrappingRewardsHarvest from "@/components/harvest/wrappingRewardsHarvest";
import { CONTRACT_ADDRESSES } from "@/constants";
import useWeb3Store from "@/hooks/useWeb3Store";

function HarvestPage() {
  const chainId = useWeb3Store((state) => state.chainId);

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
            contractAddress={CONTRACT_ADDRESSES.LPRewardsREIGNWETH[chainId]}
            title="REIGN/WETH Pool Rewards"
          />

          <LPRewardsHarvest
            contractAddress={CONTRACT_ADDRESSES.LPRewardsSOVUSDC[chainId]}
            title="SOV/USDC Pool Rewards"
          />
        </div>
      </div>
    </section>
  );
}

export default HarvestPage;
