import { createAsync, useSearchParams } from "@solidjs/router";
import { createEffect } from "solid-js";
import Loader from "../components/Loader";
import { logoutApi } from "../lib/logout";
import { useI18n } from "../providers/I18nProvider";
import { AppError } from "../types/api";

// Hydra's logout UI: an app (for example Gitea's Sign Out) asked Hydra to sign the person out. Signing out ends
// Staff-Auth and every app that uses it at once, without asking: a confirmation would add no protection, since the
// panel's own logout (/api/logout) is a plain link too. Hydra then continues to its post-logout page.
export default function LogoutPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  // A missing, invalid or used challenge throws, which shows the error page.
  const redirectUrl = createAsync(async () => {
    const logoutChallenge = params.logout_challenge;
    if (!logoutChallenge)
      throw new AppError("fatal", "logout.error.noChallenge", null);
    if (typeof logoutChallenge !== "string")
      throw new AppError("fatal", "logout.error.invalidChallenge", null);
    return await logoutApi.logout(logoutChallenge);
  });
  createEffect(() => {
    const url = redirectUrl();
    if (url) window.location.href = url;
  });

  return <Loader text={t("logout.loading")} fillScreen={true} />;
}
