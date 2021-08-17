import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";

export default function formatToFloat(value: BigNumberish, decimals = 18) {
  if (typeof value === "undefined") {
    return Number(0).toString();
  }

  return parseFloat(formatUnits(value, decimals));
}

const ZERO = BigNumber.from(0);

const MAX_UINT_256 = BigNumber.from(2).pow(256).sub(1);

export function scaleBy(
  value: BigNumber,
  decimals?: number
): BigNumber | undefined {
  if (decimals === undefined) {
    return undefined;
  }

  return value.mul(10 ** decimals);
}

export function unscaleBy(
  value: BigNumber,
  decimals?: number
): BigNumber | undefined {
  if (decimals === undefined) {
    return undefined;
  }

  return value.div(10 ** decimals);
}
