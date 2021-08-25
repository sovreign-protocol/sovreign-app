import useSWR from "swr";

const BASE = `https://best-buy-provider.vercel.app/api/token_list`;

function getBestBuy() {
  type Data = Record<string, bigint>;

  return async (): Promise<Data> => {
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

  return useSWR(shouldFetch ? ["BestBuy"] : null, getBestBuy(), {
    shouldRetryOnError: false,
  });
}
