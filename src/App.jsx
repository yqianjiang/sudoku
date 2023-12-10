import { useTranslation } from "react-i18next";
import "./App.css";
import { changeLanguage } from "i18next";
import { useEffect, useState, Fragment } from "react";
import GameBoard from "./components/GameBoard";

function App() {
  const { t } = useTranslation();
  const [currLang, setCurrLang] = useState("");

  useEffect(() => {
    const lang = document.documentElement.lang;
    changeLanguage(lang);
    if (lang === "en") {
      setCurrLang("");
    } else {
      setCurrLang(lang);
    }
  }, []);

  const languages = [
    { code: "", label: "English" },
    { code: "zh", label: "中文" },
    { code: "ja", label: "日本語" },
  ];

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setCurrLang(lang);
  };

  return (
    <>
      {languages.map((language, idx) => (
        <Fragment key={'lang' + language.code}>
          {currLang === language.code ? (
            <span key={language.code} style={{ fontWeight: "bold" }}>
              {language.label}
            </span>
          ) : (
            <a
              key={language.code}
              href={`/${language.code}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              {language.label}
            </a>
          )}
          {idx !== languages.length - 1 && " | "}
        </Fragment>
      ))}
      <h1>{t("Sudoku")}</h1>
      <GameBoard />
    </>
  );
}

export default App;
