import { TOKEN_ADDRESSES } from "@/constants/tokens";
import { CONTRACT_ADDRESSES } from "@/constants/contracts";
import { MaxUint256, MIN_INPUT_VALUE } from "@/constants/numbers";
import { useReignFacetProxy, useTokenContract } from "@/hooks/useContract";
import useFormattedBigNumber from "@/hooks/useFormattedBigNumber";
import useInput from "@/hooks/useInput";
import useWeb3Store from "@/hooks/useWeb3Store";
import useReignStaked from "@/hooks/view/useReignStaked";
import useTokenAllowance from "@/hooks/view/useTokenAllowance";
import useTokenBalance from "@/hooks/view/useTokenBalance";
import handleError from "@/utils/handleError";
import { formatUnits, parseUnits } from "@ethersproject/units";
import type { FormEvent } from "react";
import { useMemo } from "react";
import toast from "react-hot-toast";
import Button, { MaxButton } from "../button";
import { TransactionToast } from "../customToast";
import NumericalInput from "../numericalInput";
import { TokenSingle } from "../tokenSelect";

export default function DepositStake() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const reignFacet = useReignFacetProxy();

  const { data: reignBalance, mutate: reignBalanceMutate } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.REIGN[chainId]
  );

  const { mutate: reignStakedMutate } = useReignStaked();

  const formattedReignBalance = useFormattedBigNumber(reignBalance);

  const depositInput = useInput();

  const reignContract = useTokenContract(TOKEN_ADDRESSES.REIGN[chainId]);

  const { data: reignAllowance, mutate: reignAllowanceMutate } =
    useTokenAllowance(
      TOKEN_ADDRESSES.REIGN[chainId],
      account,
      CONTRACT_ADDRESSES.ReignFacetProxy[chainId]
    );

  const reignNeedsApproval = useMemo(() => {
    if (!!reignAllowance && depositInput.hasValue) {
      return reignAllowance.isZero();
    }

    return;
  }, [reignAllowance, depositInput.hasValue]);

  async function depositReign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading("Waiting for confirmation");

    try {
      if (Number(depositInput.value) <= MIN_INPUT_VALUE) {
        throw new Error(`Minium Deposit: ${MIN_INPUT_VALUE} REIGN`);
      }

      const depositAmount = parseUnits(depositInput.value);

      if (depositAmount.gt(reignBalance)) {
        throw new Error(`Maximum Deposit: ${formattedReignBalance} REIGN`);
      }

      const transaction = await reignFacet.deposit(depositAmount);

      toast.loading(
        <TransactionToast
          hash={transaction.hash}
          chainId={chainId}
          message={`Deposit ${depositInput.value} REIGN`}
        />,
        { id: _id }
      );

      await transaction.wait();

      toast.success(
        <TransactionToast
          hash={transaction.hash}
          chainId={chainId}
          message={`Deposit ${depositInput.value} REIGN`}
        />,
        { id: _id }
      );

      reignStakedMutate();
      reignBalanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  async function approveReign() {
    const _id = toast.loading("Waiting for confirmation");

    try {
      const transaction = await reignContract.approve(
        CONTRACT_ADDRESSES.ReignFacetProxy[chainId],
        MaxUint256
      );

      toast.loading(`Approve REIGN`, { id: _id });

      await transaction.wait();

      toast.success(`Approve REIGN`, { id: _id });

      reignAllowanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  const inputIsMax =
    !!reignBalance && depositInput.value === formatUnits(reignBalance);

  const setMax = () => {
    depositInput.setValue(formatUnits(reignBalance));
  };

  return (
    <form onSubmit={depositReign} method="POST" className="space-y-4">
      <div className="flex justify-between">
        <h2 className="font-medium leading-5">Deposit Stake</h2>
      </div>

      <div>
        <div className="flex space-x-4 mb-2">
          <TokenSingle symbol="REIGN" />

          <div className="flex-1">
            <label className="sr-only" htmlFor="stakeDeposit">
              Enter amount of REIGN to deposit
            </label>

            <NumericalInput
              id="stakeDeposit"
              name="stakeDeposit"
              required
              {...depositInput.valueBind}
            />
          </div>
        </div>

        <p className="text-sm text-gray-300 h-5">
          {reignBalance && formattedReignBalance ? (
            <>
              <span>{`Balance: ${formattedReignBalance} REIGN`}</span>{" "}
              {!inputIsMax && <MaxButton onClick={setMax} />}
            </>
          ) : null}
        </p>
      </div>

      <div className="space-y-4">
        {reignNeedsApproval && (
          <Button onClick={approveReign}>
            {`Approve Sovreign To Spend Your REIGN`}
          </Button>
        )}

        <Button
          disabled={!depositInput.hasValue || reignNeedsApproval}
          type="submit"
        >
          {depositInput.hasValue ? "Deposit" : "Enter an amount"}
        </Button>
      </div>
    </form>
  );
}
