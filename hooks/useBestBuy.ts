import useSWR from "swr";

const BASE = `https://api.sovreign.app/token_list`;

function getBestBuy() {
  type Data = { token: string; amount_out: bigint }[];

  return async (): Promise<Data> => {
    // return [
    //   {
    //     token: "0x6a22e5e94388464181578aa7a6b869e00fe27846",
    //     amount_out: BigInt(1129294452757910212),
    //   },
    //   {
    //     token: "0x261efcdd24cea98652b9700800a13dfbca4103ff",
    //     amount_out: BigInt(1080339331927678050),
    //   },
    //   {
    //     token: "0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6",
    //     amount_out: BigInt(1073020868940829814),
    //   },
    //   {
    //     token: "0x0f83287ff768d1c1e17a42f44d644d7f22e8ee1d",
    //     amount_out: BigInt(1064334363574703218),
    //   },
    //   {
    //     token: "0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb",
    //     amount_out: BigInt(801873407649892730),
    //   },
    //   {
    //     token: "0x57ab1ec28d129707052df4df418d58a2d46d5f51",
    //     amount_out: BigInt(789846902266101800),
    //   },
    // ];

    const r = await fetch(BASE, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (r.ok) {
      return r.json();
    }

    throw new Error(r.status + "" + r.statusText);
  };
}

export default function useBestBuy() {
  const shouldFetch = true;

  return useSWR(shouldFetch ? ["BestBuy"] : null, getBestBuy());
}
