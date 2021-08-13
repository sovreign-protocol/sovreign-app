import Button from "@/components/button";
import NumericalInput from "@/components/numericalInput";
import { TokenPair } from "@/components/tokenSelect";
import { MaxUint256, SupportedChainId } from "@/constants";
import useERC20 from "@/hooks/contracts/useERC20";
import useStaking from "@/hooks/contracts/useStaking";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useStakingBalanceLocked from "@/hooks/view/useStakingBalanceLocked";
import useTokenAllowance from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import handleError from "@/utils/handleError";
import type { TransactionResponse } from "@ethersproject/providers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { Listbox, Tab } from "@headlessui/react";
import classNames from "classnames";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { ChevronDown } from "react-feather";
import toast from "react-hot-toast";

const TAB_KEYS = {
  DEPOSIT: "Deposit",
  WITHDRAW: "Withdraw",
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

type Pool = {
  address: Record<SupportedChainId, string>;
  name: Record<SupportedChainId, string>;
  pairs: string[];
};

const POOLS: Pool[] = [
  {
    address: {
      [SupportedChainId.MAINNET]: "TODO",
      [SupportedChainId.RINKEBY]: "0x1ef52788392d940a39d09ac26cfe3c3a6f6fae47",
    },
    name: {
      [SupportedChainId.MAINNET]: "SushiSwap REIGN/ETH LP",
      [SupportedChainId.RINKEBY]: "Uniswap REIGN/ETH LP",
    },
    pairs: ["REIGN", "ETH"],
  },
  {
    address: {
      [SupportedChainId.MAINNET]: "TODO",
      [SupportedChainId.RINKEBY]: "0xd2805867258db181b608dbc757a1ce363b71c45f",
    },
    name: {
      [SupportedChainId.MAINNET]: "SushiSwap SOV/USDC LP",
      [SupportedChainId.RINKEBY]: "Uniswap SOV/USDC LP",
    },
    pairs: ["SOV", "USDC"],
  },
];

const LP_SYMBOL = {
  [SupportedChainId.MAINNET]: "SLP",
  [SupportedChainId.RINKEBY]: "UNI-V2",
};

function FarmingPage() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const depositInput = useInput();
  const withdrawInput = useInput();

  const [pool, poolSet] = useState<Pool>();

  const staking = useStaking();

  const poolTokenContract = useERC20(pool?.address?.[chainId]);

  const { data: poolTokenBalance, mutate: poolTokenBalanceMutate } =
    useTokenBalance(account, pool?.address?.[chainId]);

  const { data: poolTokenAllowance, mutate: poolTokenAllowanceMutate } =
    useTokenAllowance(pool?.address?.[chainId], account, staking?.address);

  const { data: poolTokenBalanceLocked, mutate: poolTokenBalanceLockedMutate } =
    useStakingBalanceLocked(account, pool?.address?.[chainId]);

  const poolTokenNeedsApproval = useMemo(() => {
    if (!!poolTokenAllowance && depositInput.hasValue) {
      return poolTokenAllowance.lt(parseUnits(depositInput.value));
    }

    return;
  }, [poolTokenAllowance, depositInput.hasValue, depositInput.value]);

  const fmPoolTokenBalance = useFormattedBigNumber(poolTokenBalance);

  const fmPoolTokenBalanceLocked = useFormattedBigNumber(
    poolTokenBalanceLocked
  );

  async function approvePoolToken() {
    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction: TransactionResponse = await poolTokenContract.approve(
        staking?.address,
        MaxUint256
      );

      toast.loading(`Approve ${LP_SYMBOL?.[chainId]}`, { id: _id });

      await transaction.wait();

      toast.success(`Approve ${LP_SYMBOL?.[chainId]}`, { id: _id });

      poolTokenAllowanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  async function depositPoolToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      const depositAmount = parseUnits(depositInput.value);

      const transaction: TransactionResponse = await staking.deposit(
        pool?.address?.[chainId],
        depositAmount
      );

      toast.loading(`Deposit ${depositInput.value} ${LP_SYMBOL?.[chainId]}`, {
        id: _id,
      });

      await transaction.wait();

      toast.success(`Deposit ${depositInput.value} ${LP_SYMBOL?.[chainId]}`, {
        id: _id,
      });

      poolTokenBalanceMutate();
      poolTokenBalanceLockedMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  async function withdrawPoolToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      const withdrawAmount = parseUnits(withdrawInput.value);

      const transaction: TransactionResponse = await staking.withdraw(
        pool?.address?.[chainId],
        withdrawAmount
      );

      toast.loading(`Withdraw ${withdrawInput.value} ${LP_SYMBOL?.[chainId]}`, {
        id: _id,
      });

      await transaction.wait();

      toast.success(`Withdraw ${withdrawInput.value} ${LP_SYMBOL?.[chainId]}`, {
        id: _id,
      });

      poolTokenBalanceMutate();
      poolTokenBalanceLockedMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  const depositInputIsMax =
    poolTokenBalance && depositInput.value === formatUnits(poolTokenBalance);
  const setDepositMax = () => {
    depositInput.setValue(formatUnits(poolTokenBalance));
  };

  const withdrawInputIsMax =
    poolTokenBalanceLocked &&
    withdrawInput.value === formatUnits(poolTokenBalanceLocked);
  const setWithdrawMax = () => {
    withdrawInput.setValue(formatUnits(poolTokenBalanceLocked));
  };

  return (
    <section className="pt-8 md:pt-16 pb-8">
      <div className="px-5 max-w-lg mx-auto mb-4">
        <div className="bg-primary-400 rounded-xl ring-1 ring-inset ring-white ring-opacity-10">
          <div className="p-2">
            <Listbox value={pool} onChange={poolSet}>
              <div className="relative">
                <Listbox.Button
                  className={classNames(
                    "relative py-2 pr-10 text-left rounded-lg cursor-default focus:outline-none focus-visible:ring-4 text-lg leading-6 flex w-full items-center space-x-2",
                    pool ? "bg-primary pl-2" : "bg-white text-primary pl-4"
                  )}
                >
                  <span className="block truncate font-medium">
                    {pool ? pool.name?.[chainId] : "Select a pool"}
                  </span>

                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={20} aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Listbox.Options className="absolute w-full max-h-60 mt-2 overflow-auto bg-primary-300 ring-1 ring-inset ring-white ring-opacity-20 rounded-lg focus:outline-none p-1">
                  {POOLS.map((_pool, _poolIndex) => (
                    <Listbox.Option
                      key={_poolIndex}
                      className={({ active }) =>
                        classNames(
                          "cursor-default select-none relative p-2 rounded-md text-white",
                          active ? "bg-white/[0.10]" : ""
                        )
                      }
                      value={_pool}
                      disabled={_pool === pool}
                    >
                      {({ selected }) => (
                        <div
                          className={classNames(
                            "flex justify-between",
                            selected ? "opacity-50" : ""
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={classNames(
                                selected ? "font-medium" : "font-normal",
                                "block truncate leading-5"
                              )}
                            >
                              {_pool.name?.[chainId]}
                            </span>
                          </div>
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          <div className="h-px w-full bg-primary-300" />

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
                <form onSubmit={depositPoolToken} method="POST">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h2 className="font-medium leading-5">
                        Deposit {pool?.name?.[chainId]}
                      </h2>
                    </div>

                    <div>
                      <div className="flex space-x-4 mb-2">
                        <TokenPair
                          pairs={pool?.pairs}
                          symbol={LP_SYMBOL?.[chainId]}
                        />

                        <div className="flex-1">
                          <label className="sr-only" htmlFor="deposit">
                            {`Enter amount of ${LP_SYMBOL?.[chainId]} to deposit`}
                          </label>

                          <NumericalInput
                            id="deposit"
                            name="deposit"
                            required
                            {...depositInput.valueBind}
                          />
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 h-5">
                        {poolTokenBalance && fmPoolTokenBalance ? (
                          <>
                            <span>{`Balance: ${fmPoolTokenBalance} ${LP_SYMBOL?.[chainId]}`}</span>{" "}
                            {!depositInputIsMax && (
                              <button
                                type="button"
                                className="text-indigo-500"
                                onClick={setDepositMax}
                              >
                                {`(Max)`}
                              </button>
                            )}
                          </>
                        ) : null}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {poolTokenNeedsApproval && (
                        <Button onClick={approvePoolToken}>
                          {`Approve Sovreign To Spend Your ${LP_SYMBOL?.[chainId]}`}
                        </Button>
                      )}

                      <Button
                        disabled={
                          !(depositInput.hasValue && !!pool) ||
                          poolTokenNeedsApproval
                        }
                        type="submit"
                      >
                        {depositInput.hasValue && !!pool
                          ? "Deposit"
                          : "Enter an amount"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Tab.Panel>

              <Tab.Panel key={TAB_KEYS.WITHDRAW} className={tabPanelClassNames}>
                <form onSubmit={withdrawPoolToken} method="POST">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h2 className="font-medium leading-5">
                        Withdraw {pool?.name?.[chainId]}
                      </h2>
                    </div>

                    <div>
                      <div className="flex space-x-4 mb-2">
                        <TokenPair
                          pairs={pool?.pairs}
                          symbol={LP_SYMBOL?.[chainId]}
                        />

                        <div className="flex-1">
                          <label className="sr-only" htmlFor="withdraw">
                            {`Enter amount of ${LP_SYMBOL?.[chainId]} to withdraw`}
                          </label>

                          <NumericalInput
                            id="withdraw"
                            name="withdraw"
                            required
                            {...withdrawInput.valueBind}
                          />
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 h-5">
                        {poolTokenBalanceLocked && fmPoolTokenBalanceLocked ? (
                          <>
                            <span>{`Available: ${fmPoolTokenBalanceLocked} ${LP_SYMBOL?.[chainId]}`}</span>{" "}
                            {!withdrawInputIsMax && (
                              <button
                                type="button"
                                className="text-indigo-500"
                                onClick={setWithdrawMax}
                              >
                                {`(Max)`}
                              </button>
                            )}
                          </>
                        ) : null}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Button
                        disabled={
                          !(withdrawInput.hasValue && !!pool) ||
                          poolTokenNeedsApproval
                        }
                        type="submit"
                      >
                        {withdrawInput.hasValue && !!pool
                          ? "Withdraw"
                          : "Enter an amount"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </section>
  );
}

export default FarmingPage;
