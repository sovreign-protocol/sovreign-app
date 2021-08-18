import type { BigNumberish } from "@ethersproject/bignumber";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

export default function formatToFloat(value: BigNumberish, decimals = 18) {
  if (typeof value === "undefined") {
    return Number(0).toString();
  }

  return parseFloat(formatUnits(value, decimals));
}

const ZERO = BigNumber.from(0);

const MAX_UINT_256 = BigNumber.from(2).pow(256).sub(1);

export function scaleBy(
  value: BigNumberish,
  decimals?: number
): BigNumber | undefined {
  if (decimals === undefined) {
    return undefined;
  }

  value = BigNumber.from(value);

  return value.mul(BigNumber.from(10).pow(decimals));
}

export function unscaleBy(
  value: BigNumberish,
  decimals?: number
): BigNumber | undefined {
  if (decimals === undefined) {
    return undefined;
  }

  value = BigNumber.from(value);

  return value.div(BigNumber.from(10).pow(decimals));
}
