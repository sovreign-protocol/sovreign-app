import DepositStake from "@/components/stake/depositStake";
import LockStake from "@/components/stake/lockStake";
import WithdrawStake from "@/components/stake/withdrawStake";
import { Tab } from "@headlessui/react";
import classNames from "classnames";

const TAB_KEYS = {
  DEPOSIT: "Deposit",
  WITHDRAW: "Withdraw",
  LOCK: "Lock",
};

const tabPanelClassNames = classNames(
  "bg-primary-400 rounded-xl p-4 focus:outline-none ring-1 ring-inset ring-white ring-opacity-10 focus:ring-opacity-20"
);

const tabClassNames = ({ selected }: { selected: boolean }) =>
  classNames(
    "w-full py-2.5 text-sm leading-5 font-medium rounded-lg",
    "focus:outline-none focus:ring-4",
    selected
      ? "bg-white shadow text-primary"
      : "text-gray-300 hover:bg-primary-300 hover:text-white"
  );

function StakeView() {
  return (
    <section className="pt-8 md:pt-16 pb-8">
      <div className="px-5 max-w-lg mx-auto">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10">
            <Tab key={TAB_KEYS.DEPOSIT} className={tabClassNames}>
              {TAB_KEYS.DEPOSIT}
            </Tab>

            <Tab key={TAB_KEYS.WITHDRAW} className={tabClassNames}>
              {TAB_KEYS.WITHDRAW}
            </Tab>

            <Tab key={TAB_KEYS.LOCK} className={tabClassNames}>
              {TAB_KEYS.LOCK}
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            <Tab.Panel key={TAB_KEYS.DEPOSIT} className={tabPanelClassNames}>
              <DepositStake />
            </Tab.Panel>

            <Tab.Panel key={TAB_KEYS.WITHDRAW} className={tabPanelClassNames}>
              <WithdrawStake />
            </Tab.Panel>

            <Tab.Panel key={TAB_KEYS.LOCK} className={tabPanelClassNames}>
              <LockStake />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
}

export default StakeView;
