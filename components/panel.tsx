import classNames from "classnames";
import React from "react";

type PanelProps = {
  light?: boolean;
  padding?: false | "p-1" | "p-2" | "p-3" | "p-4";
} & JSX.IntrinsicElements["div"];

export default function Panel({
  light = false,
  className = "",
  padding = "p-4",
  ...rest
}: PanelProps) {
  const cachedClassNames = classNames(
    className,
    padding,
    "rounded-xl ring-1 ring-inset ring-white",
    light ? "bg-primary-300 ring-opacity-20" : "bg-primary-400 ring-opacity-10"
  );

  return <div className={cachedClassNames} {...rest} />;
}
