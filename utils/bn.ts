import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

export default function formatToFloat(value: BigNumberish, decimals = 18) {
  if (typeof value === "undefined") {
    return Number(0).toString();
  }

  return parseFloat(formatUnits(value, decimals));
}
