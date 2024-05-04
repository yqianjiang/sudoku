import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Sudoku": "Sudoku",
      "Highlight Numbers": "Highlight Numbers",
      "Highlight Cells": "Highlight Cells",
      "Show Errors": "Show Errors",
      "Auto Remove Notes": "Auto Remove Notes",
      "Settings": "Settings",
      "Level": "Level: ",
      "Very Easy": "Beginner",
      "Easy": "Easy",
      "Normal": "Normal",
      "Hard": "Hard",
      "Empty": "Empty",
      "Very Hard": "Expert",
      "New Game": "New Game",
      "Restart this Game": "Restart this Game",
      "Resume": "Resume",
      "Pause": "Pause",
      "Paused": "Paused",
      Erase: "Erase",
      Solve: "Solve",
      Hint: "Hint",
      Filled: "Filled",
      Error: "Error",
      Numbers: "Numbers",
      Notes: "Notes",
      "Congratulations": "Congratulations!",
      "You have solved the puzzle!": "You have solved the puzzle! Time taken: {{time}}",
      "Game Statistics": "Game Statistics",
      "Shortest Time": "Shortest Time",
      "Solved Puzzles": "Solved Puzzles",
      "Perfect Solutions": "Perfect Solutions",
      "No challenge record yet.": "No challenge record yet.",
    }
  },
  zh: {
    translation: {
      "Sudoku": "数独",
      "Highlight Numbers": "高亮数字",
      "Highlight Cells": "高亮单元格",
      "Show Errors": "显示错误",
      "Auto Remove Notes": "自动删除笔记",
      "Settings": "设置",
      "Level": "难度：",
      "Very Easy": "入门",
      "Easy": "简单",
      "Normal": "普通",
      "Hard": "困难",
      "Very Hard": "专家",
      "Empty": "空白",
      "New Game": "新游戏",
      "Restart this Game": "重玩该局",
      "Resume": "继续",
      "Pause": "暂停",
      "Paused": "暂停中",
      Erase: "擦除",
      Solve: "解答",
      Hint: "提示",
      Filled: "已填",
      Error: "错误",
      Numbers: "填数",
      Notes: "笔记",
      "Congratulations": "恭喜！",
      "You have solved the puzzle!": "你已解决了这个谜题！用时：{{time}}",
      "Game Statistics": "游戏统计信息",
      "Shortest Time": "最短时间",
      "Solved Puzzles": "已解题数",
      "Perfect Solutions": "完美解题",
      "No challenge record yet.": "尚无挑战记录。"
    }
  },
  ja: {
    translation: {
      "Sudoku": "数独",
      "Highlight Numbers": "ハイライト数字",
      "Highlight Cells": "ハイライトセル",
      "Show Errors": "エラーを表示",
      "Auto Remove Notes": "自動的にメモを削除",
      "Settings": "設定",
      "Level": "レベル: ",
      "Very Easy": "初心者",
      "Easy": "簡単",
      "Normal": "普通",
      "Hard": "ハード",
      "Very Hard": "エキスパート",
      "Empty": "空白",
      "New Game": "新しいゲーム",
      "Restart this Game": "このゲームを再起動する",
      "Resume": "再開",
      "Pause": "一時停止",
      "Paused": "一時停止中",
      Erase: "消す",
      Solve: "解く",
      Hint: "ヒント",
      Filled: "埋められた",
      Error: "エラー",
      Numbers: "数字",
      Notes: "メモ",
      "Congratulations": "おめでとうございます！",
      "You have solved the puzzle!": "パズルを解きました！所要時間：{{time}}",
      "Game Statistics": "ゲームの統計",
      "Shortest Time": "最短時間",
      "Solved Puzzles": "解いたパズル",
      "Perfect Solutions": "完璧な解決策",
      "No challenge record yet.": "まだ挑戦記録はありません。",
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
