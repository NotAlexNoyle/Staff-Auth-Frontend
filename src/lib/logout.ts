import type { TranslationKey } from "../contexts/I18nContext";
import { type ApiError, AppError, type ErrorData } from "../types/api";
import { BASE_URL, isApiError } from "./api";

export const logoutApi = {
  /**
   * Accepts Hydra's logout challenge.
   * @returns redirect URL
   */
  logout: async (logoutChallenge: string): Promise<string> => {
    let response: Response;
    try {
      response = await fetch(`${BASE_URL}/logout-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoutChallenge }),
      });
    } catch (err) {
      throw toAppError(err);
    }

    if (!response.ok)
      throw toAppError({
        status: response.status,
        errorData: (await response.json()) as ErrorData,
      });
    return await response.text();
  },
};

const fatal = ["INVALID_LOGOUT_CHALLENGE", "LOGOUT_REQUEST_USED"];

function toAppError(err: unknown): AppError {
  if (isApiError(err)) {
    throw new AppError(
      fatal.includes(err.errorData.message) ? "fatal" : "local",
      getApiErrorMessage(err),
      err.status,
    );
  }
  if (err instanceof TypeError) {
    if (err.message.startsWith("NetworkError")) {
      throw new AppError("local", "error.networkError", null);
    }
  }
  throw new AppError("fatal", "error.unknownError", null);
}

function getApiErrorMessage(err: ApiError): TranslationKey {
  switch (err.errorData.message) {
    case "INVALID_LOGOUT_CHALLENGE":
      return "logout.error.invalidChallenge";
    case "LOGOUT_REQUEST_USED":
      return "logout.error.challengeUsed";
    default:
      return "error.unknownError";
  }
}
