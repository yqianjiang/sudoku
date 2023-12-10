import { useTranslation } from "react-i18next";
import './App.css'
import { changeLanguage } from "i18next";
import { useEffect } from "react";

function App() {
  const { t } = useTranslation();

  useEffect(() => {
    changeLanguage(document.documentElement.lang);
  }, [])

  return (
    <>
      <a href="/">en</a>
      <a href="/zh">中</a>
      <h1>{t('Sudoku')}</h1>
    </>
  )
}

export default App
