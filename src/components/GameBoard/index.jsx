import { useState, useEffect, useRef } from "react";
import Stage from "../../utils/Stage.js";
import EventManager from "../../utils/EventManager.js";
import Sudoku from "../../utils/Sudoku.js";
import config from "../../utils/Config.js";
import GameConfig from "../GameConfig";
import init from "wasm-sudoku";
import { HiPlay, HiPause } from "react-icons/hi2";

import { useTranslation } from "react-i18next";

import "./style.css";

let prevBoardSize = null;
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
}
const GameBoard = () => {
  const { t } = useTranslation();

  const canvasRef = useRef(null);
  const gameBoardRef = useRef(null);
  const stageRef = useRef(null);
  const eventManagerRef = useRef(null);
  const timerRef = useRef(null);

  const [boardSize, setBoardSize] = useState(9);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  function loadConfig() {
    setBoardSize(config.boardSize);
    prevBoardSize = config.boardSize;
  }

  const handleWin = () => {
    setIsPaused(true);
    setGameStarted(false);
  };

  useEffect(() => {
    init().then(() => {
      loadConfig();
      const gameBoard =
        gameBoardRef.current ||
        new Sudoku({
          boardSize: config.boardSize,
          level: config.level,
          autoRemoveNotes: config.autoRemoveNotes,
          winCallback: handleWin,
        });
      gameBoardRef.current = gameBoard;
      const canvas = canvasRef.current;
      const stage = stageRef.current || new Stage(canvas, gameBoard, config);
      stageRef.current = stage;
      handleNewGame();
      const eventManager =
        eventManagerRef.current || new EventManager(stage, gameBoard, config);
      eventManagerRef.current = eventManager;
    });

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  function startTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  }

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    } else {
      clearInterval(timerRef.current);
    }
  }, [isPaused]);

  const handlePauseResume = () => {
    if (!isPaused) {
      gameBoardRef.current.pause_game();
      stageRef.current.renderPause(t("Paused"));
      setIsPaused(true);
    } else {
      gameBoardRef.current.resume_game();
      stageRef.current.render();
      setIsPaused(false);
    }
  };

  const handleRestart = () => {
    setIsPaused(false);
    setElapsedTime(0);
    setGameStarted(true);
    gameBoardRef.current.reset_game();
    stageRef.current.render();
  };

  const handleNewGame = () => {
    setIsPaused(false);
    setElapsedTime(0);
    setGameStarted(true);
    gameBoardRef.current.start_new_game();
    stageRef.current.render();
  };

  const handleUpdateConfig = () => {
    let restart = false;
    if (gameBoardRef.current.level !== config.level) {
      gameBoardRef.current.set_level(config.level);
      restart = true;
    }
    if (config.boardSize !== prevBoardSize) {
      prevBoardSize = config.boardSize;
      setBoardSize(config.boardSize);
      gameBoardRef.current.set_board_size(config.boardSize);
      stageRef.current.setCanvasSize();
      restart = true;
    }
    gameBoardRef.current.autoRemoveNotes = config.autoRemoveNotes;
    if (restart) {
      handleNewGame();
    } else {
      stageRef.current.render(eventManagerRef.current.selectedSquare);
    }
  };

  return (
    <div className="game-wrap">
      <div className="game-main">
        <div className="game-stat">
          <div>
            <span>{t("Filled")}: </span>
            <span>
              {gameBoardRef.current?.get_board().filter((x) => x !== 0).length}{" "}
              / {gameBoardRef.current?.get_board().length}
            </span>
          </div>
          <div>
            <span>{t("Error")}: </span>
            <span>{gameBoardRef.current?.errorCount || 0}</span>
          </div>
          <div className="game-timer-wrap">
            <span className="game-timer">{formatTime(elapsedTime)}</span>
            {gameStarted && (
              <button className="game-timer-btn" onClick={handlePauseResume}>
                {isPaused ? (
                  <HiPlay fontSize={24} />
                ) : (
                  <HiPause fontSize={24} />
                )}
              </button>
            )}
          </div>
        </div>
        <canvas ref={canvasRef} id="game-board" />
        <div className="number-buttons-wrap">
          <span>{t("Numbers")}</span>
          <div className="number-buttons">
            {Array.from({ length: boardSize }, (_, i) => i + 1).map((num) => (
              <button
                className="number-button"
                key={num}
                onClick={() => {
                  if (isPaused) {
                    return;
                  }
                  eventManagerRef.current.fillNumber(num);
                  stageRef.current.render(
                    eventManagerRef.current.selectedSquare
                  );
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <div className="number-buttons-wrap">
          <span>{t("Notes")}</span>
          <div className="number-buttons">
            {Array.from({ length: boardSize }, (_, i) => i + 1).map((num) => (
              <button
                className="number-button notes-button"
                key={num}
                onClick={() => {
                  if (isPaused) {
                    return;
                  }
                  eventManagerRef.current.fillNote(num);
                  stageRef.current.render(
                    eventManagerRef.current.selectedSquare
                  );
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <div className="action-buttons">
          {gameStarted && (
            <>
              <button
                className="action-button button"
                onClick={() => {
                  if (isPaused) {
                    return;
                  }
                  eventManagerRef.current.fillNumber(0);
                  stageRef.current.render(
                    eventManagerRef.current.selectedSquare
                  );
                }}
              >
                {t("Erase")}
              </button>

              {/* 提示 */}
              <button
                className="action-button button"
                onClick={() => {
                  if (isPaused) {
                    return;
                  }
                  const selected = eventManagerRef.current.selectedSquare;
                  const hintNum = gameBoardRef.current.hint(
                    selected.row,
                    selected.col
                  );
                  eventManagerRef.current.fillNumber(hintNum);
                  stageRef.current.render(selected);
                }}
              >
                {t("Hint")}
              </button>

              {/* 解答 */}
              <button
                className="action-button button"
                onClick={() => {
                  if (isPaused) {
                    return;
                  }
                  gameBoardRef.current.solve();
                  stageRef.current.render();
                }}
              >
                {t("Solve")}
              </button>
            </>
          )}
        </div>
      </div>
      <div>
        <div>
          <button className="button" onClick={handleRestart}>
            {t("Restart this Game")}
          </button>
          <button className="button" onClick={handleNewGame}>
            {t("New Game")}
          </button>
        </div>
        <GameConfig onUpdate={handleUpdateConfig} />
      </div>
    </div>
  );
};

export default GameBoard;
