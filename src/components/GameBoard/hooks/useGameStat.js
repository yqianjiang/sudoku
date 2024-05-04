import { useEffect, useState } from "react";

/**
 * 分难度，对每个难度，记录：
 * bestTime: 最短用时
 * meanTime: 平均用时（加权平均？最近的权重更高）
 * winCount: 未使用“解答”按钮的胜利次数
 * perfectWinCount: 0错误、0提示的胜利次数
 */

export const useGameStat = () => {
  const [stat, setStat] = useState({});

  const loadStat = () => {
    const savedGameStat = localStorage.getItem("sudoku_gameStat");
    if (savedGameStat) {
      const gameStat = JSON.parse(savedGameStat);
      if (gameStat) {
        setStat(gameStat);
        return gameStat;
      }
    }
  };
  const saveStat = (stat) => {
    localStorage.setItem("sudoku_gameStat", JSON.stringify(stat));
  };

  const updateStat = ({ difficulty, newTime, errorCount, hintCount }) => {
    // 为什么这里的 stat 总是空的？？明明用户界面上显示的有内容呀。。。
    const stat = loadStat() || {};
    let { bestTime, winCount, perfectWinCount } = stat[difficulty] || {
      bestTime: Number.MAX_SAFE_INTEGER,
      winCount: 0,
      perfectWinCount: 0,
    };
    bestTime = Math.min(bestTime, newTime);
    winCount += 1;
    if (!errorCount && !hintCount) {
      perfectWinCount += 1;
    }

    const _stat = {
      ...stat,
      [difficulty]: {
        bestTime,
        winCount,
        perfectWinCount,
      },
    };

    setStat(_stat);
    saveStat(_stat);
  };

  useEffect(() => {
    loadStat();
  }, []);

  return { stat, updateStat };
}
