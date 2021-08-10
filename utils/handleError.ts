import { errorCodes, getMessageFromCode, serializeError } from "eth-rpc-errors";
import toast from "react-hot-toast";

export default function handleError(error: any, id: string) {
  console.error(error);

  const _error = serializeError(error, {
    fallbackError: {
      code: 0,
      message: error?.message ?? "Something Went Wrong",
    },
  });

  console.error("Serialized Error:", _error);

  if (_error.code === errorCodes.provider.userRejectedRequest) {
    toast.dismiss(id);

    return;
  }

  const errorMessage =
    _error.code === 0 ? error.message : getMessageFromCode(_error.code);

  toast.error(errorMessage, { id });
}
