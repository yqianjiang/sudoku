import { generate_sudoku, solve_sudoku } from "wasm-sudoku";
import { LEVEL } from "./Config";

const levelNumsMap = {
  [LEVEL.VERY_EASY]: 68,
  [LEVEL.EASY]: 58,
  [LEVEL.NORMAL]: 35,
  [LEVEL.HARD]: 29,
  [LEVEL.VERY_HARD]: 25,
}

function generateSudoku(level) {
  // 生成初始的数独谜题，puzzle 是一个确保有唯一解的、已经填充26-30个数字的数独
  let puzzle = generate_sudoku();

  // 根据难度级别确定需要保留的数字数量
  let numsToKeep = levelNumsMap[level];
  let numsFilled = puzzle.filter((num) => num > 0).length;

  // 计算需要增加的数字数量，然后从 puzzle 的空格坐标中随机选择，填入 solved 中对应的数字，这样可以确保生成的数独谜题有唯一解
  let numsToAdd = numsToKeep - numsFilled;
  if (numsToAdd === 0) {
    return puzzle;
  } else if (numsToAdd < 0) {
    // 如果需要保留的数字数量小于等于已经填充的数字数量，重新生成数独谜题
    return generateSudoku(level);
  }

  let solved = solve_sudoku(puzzle);
  let emptyCells = [];
  for (let i = 0; i < puzzle.length; i++) {
    if (puzzle[i] === 0) {
      emptyCells.push(i);
    }
  }

  for (let i = 0; i < numsToAdd; i++) {
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    puzzle[emptyCells[randomIndex]] = solved[emptyCells[randomIndex]];
    emptyCells.splice(randomIndex, 1);
  }

  return puzzle;
}


const GameState = {
  OVER: "over",
  RUNNING: "running",
  PAUSED: "paused",
  WIN: "win",
};

class Sudoku {
  constructor({ boardSize, level, autoRemoveNotes, winCallback }) {
    this.boardSize = boardSize;
    this.level = level;
    this.autoRemoveNotes = autoRemoveNotes;
    this.originState = [];
    this.gameState = GameState.OVER;
    this.wrongCells = [];
    this.initNotes();
    this.winCallback = winCallback;
    this.errorCount = 0;
  }

  initNotes() {
    this.notes = new Array(this.boardSize * this.boardSize).fill(null).map(() => new Array(this.boardSize).fill(false));
  }

  reset_game() {
    this.board = [...this.originState]
    this.initNotes();
    this.wrongCells = [];
    this.errorCount = 0;
    this.gameState = GameState.RUNNING;
  }

  start_new_game() {
    this.wrongCells = [];
    this.errorCount = 0;

    // const start = performance.now();

    // 随机开局
    this.board = generateSudoku(this.level);
    this.originState = [...this.board];

    // console.log("生成用时", (performance.now() - start).toFixed(2) + "ms");

    this.initNotes();
    this.gameState = GameState.RUNNING;
  }

  pause_game() {
    this.gameState = GameState.PAUSED;
  }

  resume_game() {
    this.gameState = GameState.RUNNING;
  }


  solve() {
    const res = solve_sudoku(this.board);
    if (res) {
      this.board = [...res];
      this.finishGame();
    } else {
      console.log("无解");
    }
  }

  hint(x, y) {
    const res = solve_sudoku(this.board);
    if (res) {
      return res[x * this.boardSize + y];
    }
    return 0;
  }

  finishGame() {
    // 检查是否胜利
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (!this.checkNumber(row, col, this.get_number(row, col))) {
          return;
        }
      }
    }

    this.gameState = GameState.WIN;
    this.winCallback();
  }

  is_origin_cell(row, col) {
    return this.originState[row * this.boardSize + col] > 0;
  }

  fill_notes(row, col, number) {
    if (this.get_number(row, col) > 0) {
      return;
    }

    const currentNotes = this.get_notes(row, col);
    this.set_notes(row, col, currentNotes.map((note, index) => index === number - 1 ? !note : note));
  }

  checkWrongCellsRemovable() {
    const wrongCells = [];
    for (let i = 0; i < this.wrongCells.length; i++) {
      const [row, col] = this.wrongCells[i];
      if (!this.checkNumber(row, col, this.get_number(row, col))) {
        wrongCells.push([row, col]);
      }
    }
    this.wrongCells = wrongCells;
  }

  removeInvalidNotes(row, col, number) {
    // 填入数字后，清除无效的笔记（即已经填入的数字对应的笔记）
    // 检查填入数字的同一行、同一列、同一九宫格，未填入数字且存在笔记的单元格，如果笔记中包含填入的数字，则清除
    const squareSize = Math.sqrt(this.boardSize);
    const startRow = Math.floor(row / squareSize) * squareSize;
    const startCol = Math.floor(col / squareSize) * squareSize;

    for (let i = 0; i < this.boardSize; i++) {
      // 检查同一行
      if (i !== col && this.get_number(row, i) === 0) {
        const notes = this.get_notes(row, i);
        if (notes[number - 1]) {
          this.fill_notes(row, i, number);
        }
      }

      // 检查同一列
      if (i !== row && this.get_number(i, col) === 0) {
        const notes = this.get_notes(i, col);
        if (notes[number - 1]) {
          this.fill_notes(i, col, number);
        }
      }
    }

    // 检查同一九宫格
    for (let i = startRow; i < startRow + squareSize; i++) {
      for (let j = startCol; j < startCol + squareSize; j++) {
        if (i !== row && j !== col && this.get_number(i, j) === 0) {
          const notes = this.get_notes(i, j);
          if (notes[number - 1]) {
            this.fill_notes(i, j, number);
          }
        }
      }
    }
  }


  fill_number(row, col, number) {
    // 检查是否可以填入
    if (this.is_origin_cell(row, col)) {
      return;
    }
    this.set_number(row, col, number);

    // 检查是否填错
    if (number !== 0 && !this.checkNumber(row, col, number)) {
      this.wrongCells.push([row, col]);
      this.errorCount++;
    } else {
      this.wrongCells = this.wrongCells.filter((cell) => cell[0] !== row || cell[1] !== col);
    }

    // 检查是否填满
    let isFull = true;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.get_number(i, j) === 0) {
          isFull = false;
          break;
        }
      }
    }
    if (isFull) {
      this.finishGame();
    }

    this.checkWrongCellsRemovable();

    if (number !== 0 && this.autoRemoveNotes) {
      this.removeInvalidNotes(row, col, number);
    }
  }

  clear_number(row, col) {
    this.fill_number(row, col, 0);
  }

  set_number(row, col, number) {
    this.board[row * this.boardSize + col] = number;
  }

  get_number(row, col) {
    return this.board[row * this.boardSize + col];
  }

  get_board() {
    return this.board;
  }

  set_notes(row, col, notes) {
    this.notes[row * this.boardSize + col] = notes;
  }

  set_level(level) {
    this.level = level;
  }

  get_notes(row, col) {
    return this.notes[row * this.boardSize + col];
  }

  get_board_size() {
    return this.boardSize;
  }

  get_wrong_cells() {
    return this.wrongCells;
  }

  is_running() {
    return this.gameState === GameState.RUNNING;
  }

  is_paused() {
    return this.gameState === GameState.PAUSED;
  }

  is_win() {
    return this.gameState === GameState.WIN;
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
    for (let col = 0; col < this.boardSize; col++) {
      if (col !== currCol && this.get_number(row, col) === number) {
        return false;
      }
    }
    return true;
  }

  // 检查同一列是否有重复
  checkCol(currRow, col, number) {
    for (let row = 0; row < this.boardSize; row++) {
      if (row !== currRow && this.get_number(row, col) === number) {
        return false;
      }
    }
    return true;
  }

  // 检查同一九宫格是否有重复
  checkSquare(row, col, number) {
    const squareSize = Math.sqrt(this.boardSize);
    const startRow = Math.floor(row / squareSize) * squareSize;
    const startCol = Math.floor(col / squareSize) * squareSize;

    const currRow = row, currCol = col;
    for (let row = startRow; row < startRow + squareSize; row++) {
      for (let col = startCol; col < startCol + squareSize; col++) {
        if (row !== currRow && col !== currCol && this.get_number(row, col) === number) {
          return false;
        }
      }
    }
    return true;
  }

}

export default Sudoku;
