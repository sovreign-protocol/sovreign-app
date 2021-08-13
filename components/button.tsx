import classNames from "classnames";

type ButtonProps = {
  small?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button({
  type = "button",
  small = false,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const cachedClassNames = classNames(
    className,
    small ? "px-4 py-2" : "p-4 text-lg leading-5",
    disabled ? "bg-primary-300" : "bg-white text-primary",
    "w-full",
    "rounded-md font-medium",
    "focus:outline-none focus:ring-4"
  );

  return (
    <button
      type={type}
      className={cachedClassNames}
      disabled={disabled}
      {...rest}
    />
  );
}

type MaxButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function MaxButton({
  type = "button",
  className = "",
  ...rest
}: MaxButtonProps) {
  const cachedClassNames = classNames(
    className,
    "text-indigo-500 focus:outline-none focus:underline hover:underline"
  );

  return (
    <button type={type} className={cachedClassNames} {...rest}>
      {`(Max)`}
    </button>
  );
}
