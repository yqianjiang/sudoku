import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Sudoku": "Sudoku",
      "Level:": "Level:",
      "Highlight Numbers:": "Highlight Numbers:",
      "Highlight Cells:": "Highlight Cells:",
      "Show Errors:": "Show Errors:",
      "Level": "Level:",
      "Very Easy": "Very Easy",
      "Easy": "Easy",
      "Normal": "Normal",
      "Hard": "Hard",
      "Empty": "Empty",
      "Very Hard": "Very Hard",
      "New Game": "New Game",
      "Restart this Game": "Restart this Game",
      "Resume": "Resume",
      "Pause": "Pause",
      Erase: "Erase",
      Solve: "Solve",
      Hint: "Hint",
    }
  },
  zh: {
    translation: {
      "Sudoku": "数独",
      "Level:": "难度:",
      "Highlight Numbers:": "高亮数字:",
      "Highlight Cells:": "高亮单元格:",
      "Show Errors:": "显示错误:",
      "Level": "难度:",
      "Very Easy": "非常简单",
      "Easy": "简单",
      "Normal": "普通",
      "Hard": "困难",
      "Very Hard": "非常困难",
      "Empty": "空白",
      "New Game": "新游戏",
      "Restart this Game": "重玩该局",
      "Resume": "继续",
      "Pause": "暂停",
      Erase: "擦除",
      Solve: "解答",
      Hint: "提示",
    }
  },
  ja: {
    translation: {
      "Sudoku": "数独",
      "Level:": "レベル:",
      "Highlight Numbers:": "ハイライト数字:",
      "Highlight Cells:": "ハイライトセル:",
      "Show Errors:": "エラーを表示:",
      "Level": "レベル:",
      "Very Easy": "とても簡単",
      "Easy": "簡単",
      "Normal": "普通",
      "Hard": "ハード",
      "Very Hard": "とてもハード",
      "Empty": "空白",
      "New Game": "新しいゲーム",
      "Restart this Game": "このゲームを再起動する",
      "Resume": "再開",
      "Pause": "一時停止",
      Erase: "消す",
      Solve: "解く",
      Hint: "ヒント",
    }
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;