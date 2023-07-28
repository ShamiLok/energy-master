import { I18n } from "i18n-js";
import en from "./en";
import ru from "./ru";
import de from "./de";

export const i18n = new I18n({
  en: {
    ...en
  },
  ru: {
    ...ru
  },
  de: {
    ...de
  },
});

// i18n.defaultLocale = "ru";