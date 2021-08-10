import getExplorerLink, { ExplorerDataType } from "@/utils/getExplorerLink";

export function TransactionToast({
  message,
  hash,
  chainId,
}: {
  chainId?: number;
  message: string;
  hash?: string;
}) {
  if (typeof chainId === "undefined" || typeof hash === "undefined") {
    return <span>{message}</span>;
  }

  return (
    <div>
      <p className="mb-1">{message}</p>

      <div>
        <a
          href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:underline"
        >
          View on Explorer
        </a>
      </div>
    </div>
  );
}
