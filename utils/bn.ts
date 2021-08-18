import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

export default function formatToFloat(value: BigNumberish, decimals = 18) {
  if (typeof value === "undefined") {
    return parseFloat("0");
  }

  return parseFloat(formatUnits(value, decimals));
}
