import useAddTokenToMetaMask from "@/hooks/useAddTokenToMetaMask";
import useWeb3Store from "@/hooks/useWeb3Store";
import MetaMaskOutline from "@/svgs/MetaMaskOutline";

export default function AddTokensToMetaMask() {
  const library = useWeb3Store((state) => state.library);

  const { addToken } = useAddTokenToMetaMask();

  if (library && library.provider.isMetaMask) {
    return (
      <button
        onClick={addToken}
        aria-label="Add Tokens To MetaMask"
        className="px-3 py-[10px] bg-primary-400 ring-1 ring-inset ring-white ring-opacity-10 text-sm rounded-xl hidden xl:flex items-center space-x-2 flex-shrink-0 focus:ring-opacity-20 hover:ring-opacity-20 focus:outline-none"
      >
        <MetaMaskOutline size={20} />

        <div className="flex -space-x-2">
          <div className="relative">
            <div className="absolute ring-1 ring-inset ring-white ring-opacity-20 rounded-full h-6 w-6" />

            <img
              width={24}
              height={24}
              className="rounded-full h-6 w-6"
              src={`/tokens/${`REIGN`}.png`}
              alt={`REIGN`}
            />
          </div>

          <div className="relative">
            <div className="absolute ring-1 ring-inset ring-white ring-opacity-20 rounded-full h-6 w-6" />

            <img
              width={24}
              height={24}
              className="rounded-full h-6 w-6"
              src={`/tokens/${`SOV`}.png`}
              alt={`SOV`}
            />
          </div>
        </div>
      </button>
    );
  }

  return null;
}
