import EpochProgress from "@/components/harvest/epochProgress";
import GovRewardsHarvest from "@/components/harvest/govRewardsHarvest";
import REIGNWETHRewardsHarvest from "@/components/harvest/reignWethRewardsHarvest";
import SOVUSDCRewardsHarvest from "@/components/harvest/sovUsdcRewardsHarvest";
import WrappingRewardsHarvest from "@/components/harvest/wrappingRewardsHarvest";

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

          <SOVUSDCRewardsHarvest />

          <REIGNWETHRewardsHarvest />
        </div>
      </div>
    </section>
  );
}

export default HarvestPage;
