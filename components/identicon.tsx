import { useEffect, useRef } from "react";

export default function Identicon({ address }: { address: string }) {
  const jazzicon = useRef<(diameter: number, seed: number) => HTMLDivElement>();

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    async function loadJazzicon() {
      const generateIdenticon = (await import("@metamask/jazzicon")).default;

      jazzicon.current = generateIdenticon;
    }

    loadJazzicon();
  }, []);

  useEffect(
    () => {
      if (typeof jazzicon.current === "undefined") {
        return;
      }

      if (address && ref.current) {
        ref.current.innerHTML = "";

        ref.current.appendChild(
          jazzicon.current(20, parseInt(address.slice(2, 10), 16))
        );
      }
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [jazzicon.current, address]
  );

  return <div className="h-5 w-5 rounded-full bg-primary-400" ref={ref} />;
}
