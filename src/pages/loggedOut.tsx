import CheckIcon from "~icons/mdi/check";
import { LOGIN_URL } from "../lib/api";
import { useI18n } from "../providers/I18nProvider";

export default function LoggedOutPage() {
  const { t } = useI18n();

  return (
    <div class="flex flex-col min-h-screen items-center justify-center p-4">
      <CheckIcon class="h-16 w-full mb-8" />
      <p class="text-xl text-center">{t("logout.loggedOut")}</p>
      <p class="text-center mt-2 max-w-md">{t("logout.explanation")}</p>
      <button
        type="button"
        onClick={() => (window.location.href = LOGIN_URL)}
        class="btn btn-soft mt-4"
      >
        {t("logout.logBackIn")}
      </button>
    </div>
  );
}
