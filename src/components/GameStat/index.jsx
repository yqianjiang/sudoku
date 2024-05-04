import { formatTime } from "../../utils/index.js";
import { levelMap } from "../../utils/Config.js";
import { useTranslation } from "react-i18next";
import "./style.css";

const GameStat = ({ stat }) => {
  const { t } = useTranslation();

  const renderStat = () => {
    return Object.keys(levelMap).map((level) => {
      if (!stat[level]) {
        return (
          <div className="game-stat-level-block" key={level}>
            <div className="game-stat-level-block-title">
              {t(levelMap[level])}
            </div>
            <div className="game-stat-level-block-content">
              {t("No challenge record yet.")}
            </div>
          </div>
        );
      }
      const { bestTime, winCount, perfectWinCount } = stat[level];
      return (
        <div className="game-stat-level-block" key={level}>
          <div className="game-stat-level-block-title">
            {t(levelMap[level])}
          </div>
          <div className="game-stat-level-block-content">
            <div>
              {t("Shortest Time")}: {formatTime(bestTime)}
            </div>
            <div>
              {t("Solved Puzzles")}: {winCount}
            </div>
            <div>
              {t("Perfect Solutions")}: {perfectWinCount}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="game-stat-container">
      <div className="game-stat-title">{t("Game Statistics")}</div>
      {renderStat()}
    </div>
  );
};

export default GameStat;
