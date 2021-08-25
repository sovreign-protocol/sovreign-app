import { EpochProgressShort } from "@/components/harvest/epochProgress";
import AllocationAdjustment from "@/components/rebalance/allocationAdjustment";
import ContinuousTokenAllocation from "@/components/rebalance/continuousTokenAllocation";
import TokenAllocation from "@/components/rebalance/tokenAllocation";
import VotingPower from "@/components/rebalance/votingPower";

function RebalanceView() {
  return (
    <section className="sm:pt-8 md:pt-16 pb-8">
      <div className="px-5 max-w-4xl mx-auto mb-4">
        <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
          <VotingPower />

          <EpochProgressShort />
        </div>
      </div>

      <div className="px-5 max-w-4xl mx-auto mb-4">
        <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
          <div className="space-y-4">
            <TokenAllocation />

            <div className="h-px w-full bg-primary-300" />

            <ContinuousTokenAllocation />

            <div className="h-px w-full bg-primary-300" />

            <AllocationAdjustment />
          </div>
        </div>
      </div>
    </section>
  );
}

export default RebalanceView;
