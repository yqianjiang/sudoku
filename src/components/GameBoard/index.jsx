import { useState, useEffect, useRef } from "react";
import Stage from "../../utils/Stage.js";
import EventManager from "../../utils/EventManager.js";
import Sudoku from "../../utils/Sudoku.js";
import config, { LEVEL, levelMap } from "../../utils/Config.js";
import GameConfig from "../GameConfig";
import GameStat from "../GameStat/index.jsx";
import init from "wasm-sudoku";
import { useGameStat } from "./hooks/useGameStat.js";
import { formatTime } from "../../utils";

import { HiPlay, HiPause } from "react-icons/hi2";
import toast, { Toaster } from "react-hot-toast";

import { useTranslation } from "react-i18next";

import "./style.css";

let prevBoardSize = null;

const GameBoard = () => {
  const { t } = useTranslation();

  const canvasRef = useRef(null);
  const gameBoardRef = useRef(null);
  const stageRef = useRef(null);
  const eventManagerRef = useRef(null);
  const timerRef = useRef(null);

  const [boardSize, setBoardSize] = useState(9);
  const [level, setLevel] = useState(LEVEL.NORMAL);
  const [isPaused, setIsPaused] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { stat, updateStat } = useGameStat();

  function loadConfig() {
    setBoardSize(config.boardSize);
    setLevel(config.level);
    prevBoardSize = config.boardSize;
  }

  const handleWin = () => {
    setIsPaused(true);
    setGameStarted(false);
    setIsWin(true);
    if (!gameBoardRef.current.winByAutoSolve) {
      updateStat({
        difficulty: config.level,
        newTime: gameBoardRef.current.spentTime,
        errorCount: gameBoardRef.current.errorCount,
        hintCount: gameBoardRef.current.hintCount,
      });
    }
  };

  useEffect(() => {
    init().then(() => {
      loadConfig();

      // 初始化 Sudoku 类
      if (!gameBoardRef.current) {
        const gameBoard = new Sudoku({
          boardSize: config.boardSize,
          level: config.level,
          autoRemoveNotes: config.autoRemoveNotes,
          winCallback: handleWin,
        });
        gameBoardRef.current = gameBoard;

        // 初始化 Stage 类，管理棋盘渲染
        const canvas = canvasRef.current;
        const stage = stageRef.current || new Stage(canvas, gameBoard, config);
        stageRef.current = stage;

        // 初始化 eventManager 类，管理棋盘交互
        const eventManager =
          eventManagerRef.current || new EventManager(stage, gameBoard, config);
        eventManagerRef.current = eventManager;
        // 初始化游戏
        if (gameBoard.is_waiting()) {
          handleNewGame();
        } else {
          handleLoadGame();
        }
      }
    });

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  function startTimer() {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      gameBoardRef.current.set_spentTime(gameBoardRef.current.spentTime + 1);
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
      stageRef.current.renderPause();
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
    setIsWin(false);
    gameBoardRef.current.reset_game();
    stageRef.current.render();
  };

  const handleNewGame = () => {
    setIsPaused(false);
    setElapsedTime(0);
    setGameStarted(true);
    setIsWin(false);
    gameBoardRef.current.start_new_game();
    stageRef.current.render();
  };

  const handleLoadGame = () => {
    setElapsedTime(gameBoardRef.current.spentTime);
    if (gameBoardRef.current.is_running()) {
      // 如果原本 running
      setGameStarted(true);
      handlePauseResume();
    } else if (gameBoardRef.current.is_paused()) {
      // 如果从暂停状态加载
      setGameStarted(true);
      setIsPaused(true);
      stageRef.current.renderPause();
    } else if (gameBoardRef.current.is_win()) {
      setIsPaused(true);
      setGameStarted(false);
      setIsWin(true);
    }

    // todo: 渲染一个 "新游戏" 或 "继续游戏" 的选项（现在都是进到暂停界面）
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

  function handleChangeLevel(e) {
    const newLevel = e.target.value;
    setLevel(newLevel);
    config.updateConfigs({ level: newLevel });
    handleUpdateConfig();
  }

  return (
    <>
      <div className="level-selector">
        <label>
          {t("Level")}
          <select value={level} onChange={handleChangeLevel}>
            {Object.keys(LEVEL).map((level) => (
              <option value={LEVEL[level]} key={level}>
                {t(levelMap[LEVEL[level]])}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="game-wrap">
        <div className="game-main">
          <div className="game-stat">
            <div>
              <span>{t("Filled")}: </span>
              <span>
                {gameBoardRef.current?.get_board()?.filter((x) => x !== 0)
                  ?.length || "-"}{" "}
                / {gameBoardRef.current?.get_board()?.length || "-"}
              </span>
            </div>
            <div>
              <span>{t("Error")}: </span>
              <span>{gameBoardRef.current?.errorCount || 0}</span>
            </div>
            <div>
              <span>{t("Hint")}: </span>
              <span>{gameBoardRef.current?.hintCount || 0}</span>
            </div>
            <div className="game-timer-wrap">
              <span className="game-timer">{formatTime(elapsedTime)}</span>
              {gameStarted && (
                <button
                  className="game-timer-btn"
                  onClick={handlePauseResume}
                  aria-label={isPaused ? "play" : "pause"}
                >
                  {isPaused ? (
                    <HiPlay fontSize={16} />
                  ) : (
                    <HiPause fontSize={16} />
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="game-board-wrap">
            <canvas ref={canvasRef} id="game-board" />
            {isPaused && (
              <div className="game-board-react-wrapper">
                {isWin ? (
                  // 展示胜利弹窗
                  <div className="win-modal">
                    <h2 className="win-modal-title">{t("Congratulations")}</h2>
                    <p>
                      {t("You have solved the puzzle!", {
                        time: formatTime(elapsedTime),
                      })}
                    </p>
                    <button className="button" onClick={handleNewGame}>
                      {t("New Game")}
                    </button>
                  </div>
                ) : (
                  <button
                    className="game-board-paused-btn"
                    onClick={handlePauseResume}
                  >
                    <HiPlay fontSize={40} />
                  </button>
                )}
              </div>
            )}
          </div>
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
                    if (gameBoardRef.current.solve()) {
                      stageRef.current.render();
                    } else {
                      toast(t("no solution"));
                    }
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
          <GameStat stat={stat} />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default GameBoard;
