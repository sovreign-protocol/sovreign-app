import EpochProgress from "@/components/harvest/epochProgress";
import GovRewardsHarvest from "@/components/harvest/govRewardsHarvest";
import LPRewardsHarvest from "@/components/harvest/lpRewardsHarvest";
import WrappingRewardsHarvest from "@/components/harvest/wrappingRewardsHarvest";
import { FARMING_POOL_NAMES } from "@/constants";

function HarvestPage() {
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
            pool={FARMING_POOL_NAMES.REIGNWETH}
            title="REIGN/WETH Pool Rewards"
          />

          <LPRewardsHarvest
            pool={FARMING_POOL_NAMES.SOVUSDC}
            title="SOV/USDC Pool Rewards"
          />
        </div>
      </div>
    </section>
  );
}

export default HarvestPage;
