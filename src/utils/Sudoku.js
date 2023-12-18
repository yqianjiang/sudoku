import { solveSudoku } from "./sudokuSolver";

const getRandomInt = (range = 9, scale = 1) => {
  return Math.floor((Math.random() * range) / scale);
};

const initBoard = (maxNum) => {
  const matrix = [];
  for (let i = 0; i < maxNum; i++) {
    matrix[i] = [];
    for (let j = 0; j < maxNum; j++) {
      matrix[i][j] = 0;
    }
  }

  return matrix;
}

const initSudokuBoard = (maxNum) => {
  const matrix = initBoard(maxNum);
  // 把第一行乱序填入1-9
  for (let k = 1; k < maxNum + 1; k++) {
    // 随机选一个格子填数
    let j = getRandomInt(maxNum);
    while (matrix[0][j] > 0) {
      // 重新选格子
      j = getRandomInt(maxNum);
    }
    matrix[0][j] = k;
  }
  return matrix;
};

class Sudoku {
  constructor(configs) {
    this.configs = configs;
    this.originState = [];
    this.gameState = "over";
    this.spendTime = 0;
    this.timer = null;
    this.initGame();
    this.wrongCells = [];
  }

  solve() {
    const maxNum = this.configs.boardSize;
    const res = solveSudoku(this.board, maxNum);
    if (res) {
      this.board = res.map((x) => x.map((y) => y));
      this.finishGame();
    } else {
      console.log("无解");
    }
  }

  hint(x, y) {
    const maxNum = this.configs.boardSize;
    const res = solveSudoku(this.board, maxNum);
    if (res) {
      return res[x][y];
    }
    return 0;
  }

  initGame() {
    this.wrongCells = [];

    const start = new Date().getTime();

    // 随机开局，不一定有解 (基本上有解)
    const maxNum = this.configs.boardSize;
    let matrix = initSudokuBoard(maxNum);
    let res = solveSudoku(matrix, maxNum);
    let count = 1;
    while (!res && count < 5) {
      matrix = initSudokuBoard(maxNum);
      res = solveSudoku(matrix, maxNum);
      count++;
    }
    if (res) {
       // 在res的基础上挖空，根据难度挖空，挖空后保证有唯一解
       // 难度越高，挖空的越多。难度等级为1-5
      this.board = res.map((x) =>
        x.map((y) => {
          if (getRandomInt(6, +this.configs.level)) {
            return y;
          }
          return 0;
        })
      );
    } else {
      this.board = matrix;
    }
    this.originState = this.board.map((x) => x.map((y) => y));

    if (count > 1) {
      console.log(count);
      console.log("loaded, 用时", new Date().getTime() - start);
    }
  }

  resetGame() {
    this.restartTimer();
    this.board = this.originState.map((x) => x.map((y) => y));
    this.wrongCells = [];
    this.gameState = "running";
  }

  startGame() {
    this.gameState = "running";
    this.restartTimer();
  }

  pause() {
    this.gameState = "paused";
    this.stopTimer();
  }

  resume() {
    this.gameState = "running";
    this.resumeTimer();
  }

  startNewGame() {
    this.stopTimer();
    this.initGame();
    this.startGame();
  }

  restartTimer() {
    this.stopTimer();
    this.spendTime = 0;
    this.timer = setInterval(() => {
      this.spendTime++;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  resumeTimer() {
    this.timer = setInterval(() => {
      this.spendTime++;
    }, 1000);
  }

  finishGame() {
    // 检查是否胜利
    for (let row = 0; row < this.configs.boardSize; row++) {
      for (let col = 0; col < this.configs.boardSize; col++) {
        if (!this.checkNumber(row, col, this.board[row][col])) {
          return;
        }
      }
    }

    this.gameState = "win";
    this.stopTimer();
  }

  isOriginal(row, col) {
    return this.originState[row][col] > 0;
  }

  fillNumber(row, col, number) {
    // 检查是否可以填入
    if (this.isOriginal(row, col)) {
      return;
    }
    this.board[row][col] = number;

    // 检查是否填错
    if (number !== 0 && !this.checkNumber(row, col, number)) {
      this.wrongCells.push({ row, col });
    } else {
      this.wrongCells = this.wrongCells.filter((cell) => cell.row !== row || cell.col !== col);
    }

    // 检查是否填满
    let isFull = true;
    for (let i = 0; i < this.configs.boardSize; i++) {
      for (let j = 0; j < this.configs.boardSize; j++) {
        if (this.board[i][j] === 0) {
          isFull = false;
          break;
        }
      }
    }
    if (isFull) {
      this.finishGame();
    }
  }

  clearNumber(row, col) {
    this.fillNumber(row, col, 0);
  }

  getNumber(row, col) {
    return this.board[row][col];
  }

  getBoard() {
    return this.board;
  }

  // 检查填入的数字是否正确
  // 1. 检查同一行是否有重复
  // 2. 检查同一列是否有重复
  // 3. 检查同一九宫格是否有重复
  checkNumber(row, col, number) {
    return this.checkRow(row, col, number) && this.checkCol(row, col, number) && this.checkSquare(row, col, number);
  }

  // 检查同一行是否有重复
  checkRow(row, currCol, number) {
    for (let col = 0; col < this.configs.boardSize; col++) {
      if (col !== currCol && this.board[row][col] === number) {
        return false;
      }
    }
    return true;
  }

  // 检查同一列是否有重复
  checkCol(currRow, col, number) {
    for (let row = 0; row < this.configs.boardSize; row++) {
      if (row !== currRow && this.board[row][col] === number) {
        return false;
      }
    }
    return true;
  }

  // 检查同一九宫格是否有重复
  checkSquare(row, col, number) {
    const squareSize = Math.sqrt(this.configs.boardSize);
    const startRow = Math.floor(row / squareSize) * squareSize;
    const startCol = Math.floor(col / squareSize) * squareSize;

    const currRow = row, currCol = col;
    for (let row = startRow; row < startRow + squareSize; row++) {
      for (let col = startCol; col < startCol + squareSize; col++) {
        if (row !== currRow && col !== currCol && this.board[row][col] === number) {
          return false;
        }
      }
    }
    return true;
  }

}

export default Sudoku;