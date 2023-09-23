import { I18n } from "i18n-js";
import ar from "./ar";
import en from "./en";
import ru from "./ru";
import de from "./de";
import es from "./es";
import hi from "./hi";
import ja from "./ja";
import uk from "./uk";
import tr from "./tr";
import ko from "./ko";
import ms from "./ms";
import fr from "./fr";
import it from "./it";
import pt from "./pt";
import zh from "./zh";

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
  ja: {
    ...ja
  },
  uk: {
    ...uk
  },
  tr: {
    ...tr
  },
  ko: {
    ...ko
  },
  ms: {
    ...ms
  },
  fr: {
    ...fr
  },
  it: {
    ...it
  },
  ar: {
    ...ar
  },
  es: {
    ...es
  },
  hi: {
    ...hi
  },
  pt: {
    ...pt
  },
  zh: {
    ...zh
  },
});
