import { checkUniqueSolution } from "./sudokuSolver";
import { cloneDeep } from "lodash";

const boardSize = 9;

function calculateDeleteCounts(difficulty) {
  // 更改此处的删除计数以更好的反映难度级别
  return {
    1: boardSize * boardSize - 48,
    2: boardSize * boardSize - 38,
    3: boardSize * boardSize - 32,
    4: boardSize * boardSize - 29,
    // 5: boardSize * boardSize - 25,
  }[difficulty];
}

function deleteRandomInBoard(board, deleteCount) {
  const positions = [];
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] !== 0) {
        positions.push([i, j]);
      }
    }
  }

  for (let i = 0; i < deleteCount && positions.length > 0; i++) {
    let randomIndex = Math.floor(Math.random() * positions.length);
    const [x, y] = positions[randomIndex];
    
    if (board[x][y] !== 0) {
      board[x][y] = 0;
    }
    positions.splice(randomIndex, 1);
  }

  return board;
}

export function generateSudoku(board, difficulty, maxAttempts = 8) {
  let targetDeleteCount = calculateDeleteCounts(difficulty);

  let tempDeleteCount = Math.min(targetDeleteCount, 30);
  let deletedCount = 0;

  let retriedCount = 0;
  let count = 0;
  while (deletedCount < targetDeleteCount) {
    count++;
    tempDeleteCount = Math.min(tempDeleteCount, targetDeleteCount - deletedCount);
    let tempBoard = cloneDeep(board);
    tempBoard = deleteRandomInBoard(tempBoard, tempDeleteCount);
    
    const solutions = checkUniqueSolution(tempBoard);
    if (solutions !== 1) {  // 如果没有找到唯一解
        tempDeleteCount = Math.max(Math.floor(tempDeleteCount / 2), 1);  // 折半再试
        retriedCount++;
        if (retriedCount > maxAttempts) {
          console.log("retriedCount >= maxAttempts, 剩余" + (targetDeleteCount - deletedCount) + "个格子未删除");
          break;
        }
    } else {
      board = tempBoard; 
      deletedCount += tempDeleteCount;
      retriedCount = 0;
    }
  }
  
  console.log("done, count: ", count);
  return board;
}