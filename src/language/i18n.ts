import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations from different features
import enLanding from "../features/landing/showLanding/language/locale/en.json";
import daLanding from "../features/landing/showLanding/language/locale/da.json";
import enSidebar from "./locale/en.json";
import daSidebar from "./locale/da.json";
import enApplication from "../features/application/showMain/language/locale/en.json";
import daApplication from "../features/application/showMain/language/locale/da.json";
// Add more feature translations as needed

i18n.use(initReactI18next).init({
    resources: {
        en: {
            landing: enLanding,
            sidebar: enSidebar,
            application: enApplication,
            // Add more namespaces
        },
        da: {
            landing: daLanding,
            sidebar: daSidebar,
            application: daApplication,
            // Add more namespaces
        },
    },
    lng: "da",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
