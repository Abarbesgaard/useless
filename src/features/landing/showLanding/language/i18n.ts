import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./locale/en.json";
import daJSON from "./locale/da.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: enJSON },
        da: { translation: daJSON },
    },
    lng: "da",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
