import * as blockies from "blockies-ts";

type Props = {
  address: string;
};

export default function Blockie({ address }: Props) {
  const imgSrc = blockies.create({ seed: address }).toDataURL();

  return <img src={imgSrc} alt={address} className="w-5 h-5 rounded-full" />;
}
