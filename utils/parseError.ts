type ErrorCodeStrings = "UNPREDICTABLE_GAS_LIMIT";

type ErrorMessages = "execution reverted: ERR_MAX_IN_RATIO";

type ErrorCodeNumbers = -32603 | 4001;

type EthereumErrorMessage = {
  reason: string;
  code: number | ErrorCodeStrings;
  error: {
    code: number | ErrorCodeNumbers;
    message: string | ErrorMessages;
    data: {
      originalError: {
        code: number;
        data: string;
        message: string | ErrorMessages;
      };
    };
  };
  method: string;
  transaction: {
    from: string;
    to: string;
    data: string;
    accessList: any;
  };
};

export default function parseError(error: any) {
  const _error: EthereumErrorMessage = error;

  return {
    code: _error?.code ?? _error?.error?.code ?? undefined,
    message: _error.error.message ?? "Something Went Wrong",
  };
}
