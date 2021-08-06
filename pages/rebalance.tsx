import AllocationAdjustment from "@/components/rebalance/allocationAdjustment";
import Lock from "@/components/rebalance/lock";
import Stake from "@/components/rebalance/stake";
import TokenAllocation from "@/components/rebalance/tokenAllocation";
// import VotingPower from "@/components/rebalance/votingPower";

function RebalancePage() {
  return (
    <section className="pt-8 md:pt-16">
      <div className="px-5 max-w-4xl mx-auto mb-4">
        <div className="flex-1">
          <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10 p-4">
            <div className="space-y-4">
              <TokenAllocation />

              <div className="h-px w-full bg-primary-300" />

              {/* <VotingPower /> */}

              <AllocationAdjustment />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 max-w-4xl mx-auto">
        <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
          <div className="flex-1">
            <Stake />
          </div>

          <div className="flex-1">
            <Lock />
          </div>
        </div>
      </div>
    </section>
  );
}

export default RebalancePage;
