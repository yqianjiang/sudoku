import { useState, useEffect, useRef } from "react";
import Stage from "../../utils/Stage.js";
import EventManager from "../../utils/EventManager.js";
import Sudoku from "../../utils/Sudoku.js";
import config from "../../utils/Config.js";
import GameConfig from "../GameConfig";

import { useTranslation } from "react-i18next";

import "./style.css";

let prevBoardSize = null;
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}
const GameBoard = () => {
  const { t } = useTranslation();

  const canvasRef = useRef(null);
  const gameBoardRef = useRef(null);
  const stageRef = useRef(null);
  const eventManagerRef = useRef(null);

  const [boardSize, setBoardSize] = useState(9);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  function loadConfig() {
    setBoardSize(config.boardSize);
    prevBoardSize = config.boardSize;
  }

  useEffect(() => {
    loadConfig();
    const gameBoard = gameBoardRef.current || new Sudoku(config);
    gameBoard.startNewGame();
    gameBoardRef.current = gameBoard;
    const canvas = canvasRef.current;
    const stage = stageRef.current || new Stage(canvas, gameBoard, config);
    stageRef.current = stage;
    const eventManager = eventManagerRef.current || new EventManager(stage, gameBoard, config);
    eventManagerRef.current = eventManager;

    stage.render();

    // 计时器
    const timer = setInterval(() => {
      if (gameBoardRef.current.gameState === "win") {
        clearInterval(timer);
        stage.renderWin();
        return;
      }

      if (gameBoardRef.current.gameState !== "running") {
        return;
      }
      setElapsedTime(gameBoardRef.current.spendTime);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handlePauseResume = () => {
    if (gameBoardRef.current.gameState === "running") {
      gameBoardRef.current.pause();
      stageRef.current.renderPause(t("Pause"));
      setIsPaused(true);
    } else {
      gameBoardRef.current.resume();
      stageRef.current.render();
      setIsPaused(false);
    }
  };

  const handleRestart = () => {
    setIsPaused(false);
    gameBoardRef.current.resetGame();
    stageRef.current.render();
  };
  
  const handleNewGame = () => {
    gameBoardRef.current.startNewGame();
    stageRef.current.render();
  };

  const handleUpdateConfig = () => {
    if (config.boardSize !== prevBoardSize) {
      prevBoardSize = config.boardSize;
      setBoardSize(config.boardSize);
      gameBoardRef.current.startNewGame();
      stageRef.current.setCanvasSize();
      stageRef.current.render();
    }

    stageRef.current.render(eventManagerRef.current.selectedSquare);
  }

  return (
    <div>
      <canvas ref={canvasRef} id="game-board" />
      <div className="number-buttons">
        {Array.from({ length: boardSize }, (_, i) => i + 1).map((num) => (
          <button
            className="number-button"
            key={num}
            onClick={() => {
              if (gameBoardRef.current.gameState !== "running") {
                return;
              }
              eventManagerRef.current.fillNumber(num);
              stageRef.current.render(eventManagerRef.current.selectedSquare);
            }}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="action-buttons">
        <span className="game-timer">{formatTime(elapsedTime)}</span>
        <button className="action-button" onClick={handlePauseResume}>
          {isPaused ? t("Resume") : t("Pause")}
        </button>
        <button
          className="action-button"
          onClick={() => {
            if (gameBoardRef.current.gameState !== "running") {
              return;
            }
            eventManagerRef.current.fillNumber(0);
            stageRef.current.render(eventManagerRef.current.selectedSquare);
          }}
        >
          {t("Erase")}
        </button>

        {/* 切换笔记模式的按钮 */}
        <button
          className="action-button"
          onClick={() => {
            if (gameBoardRef.current.gameState !== "running") {
              return;
            }
            eventManagerRef.current.toggleNotesMode();
            stageRef.current.render(eventManagerRef.current.selectedSquare);
          }}
        >
          {eventManagerRef?.current?.notesMode ? t("Notes On") : t("Notes Off")}
        </button>
        {/* 提示 */}
        <button
          className="action-button"
          onClick={() => {
            if (gameBoardRef.current.gameState !== "running") {
              return;
            }
            const selected = eventManagerRef.current.selectedSquare;
            const hintNum = gameBoardRef.current.hint(selected.row, selected.col);
            eventManagerRef.current.fillNumber(hintNum);
            stageRef.current.render(selected);
          }}
        >
          {t("Hint")}
        </button>

        {/* 解答 */}
        <button
          className="action-button"
          onClick={() => {
            if (gameBoardRef.current.gameState !== "running") {
              return;
            }
            gameBoardRef.current.solve();
            stageRef.current.render();
          }}
        >
          {t("Solve")}
        </button>
      </div>
      <div>
        <button onClick={handleRestart}>{t('Restart this Game')}</button>
        <button onClick={handleNewGame}>{t('New Game')}</button>
      </div>
      <GameConfig onUpdate={handleUpdateConfig} onUpdateLevel={handleNewGame} />
    </div>
  );
};

export default GameBoard;
