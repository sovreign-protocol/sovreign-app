import { Tab } from "@headlessui/react";
import classNames from "classnames";
import DepositStake from "./depositStake";
import WithdrawStake from "./withdrawStake";

const TAB_KEYS = {
  DEPOSIT: "Deposit Stake",
  WITHDRAW: "Withdraw Stake",
};

const tabPanelClassNames = classNames("p-2 focus:outline-none");

const tabClassNames = ({ selected }: { selected: boolean }) =>
  classNames(
    "w-full py-2.5 text-sm leading-5 font-medium rounded-lg",
    "focus:outline-none focus:ring-4",
    selected
      ? "bg-white shadow text-primary"
      : "text-gray-300 hover:bg-primary-300 hover:text-white"
  );

export default function Stake() {
  return (
    <div className="bg-primary-400 rounded-xl focus:outline-none ring-1 ring-inset ring-white ring-opacity-10 focus:ring-opacity-20">
      <Tab.Group>
        <Tab.List className="flex space-x-1 p-2">
          <Tab key={TAB_KEYS.DEPOSIT} className={tabClassNames}>
            {TAB_KEYS.DEPOSIT}
          </Tab>

          <Tab key={TAB_KEYS.WITHDRAW} className={tabClassNames}>
            {TAB_KEYS.WITHDRAW}
          </Tab>
        </Tab.List>

        <div className="h-px w-full bg-primary-300" />

        <Tab.Panels className="p-2">
          <Tab.Panel key={TAB_KEYS.DEPOSIT} className={tabPanelClassNames}>
            <DepositStake />
          </Tab.Panel>

          <Tab.Panel key={TAB_KEYS.WITHDRAW} className={tabPanelClassNames}>
            <WithdrawStake />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
