import { cloneDeep } from "lodash";
import { checkUniqueSolution } from "./sudokuSolver";

const boardSize = 9;
const gridSize = Math.sqrt(boardSize);

/**
 * 
 * @param {number} difficulty 数字越大，表示越难
 * @returns 
 */
function calculateDeleteCounts(difficulty) {
  const deleteCounts = {
    1: [2, 1.32, 1],  // 42.12 非常简单
    2: [2, 1.04, 1, 1],  // 35.64 简单
    3: [2, 1.66, 1, 1],  // 
    4: [2, 1, 1, 1, 0.76],  // 29.15 困难
    // 5: [2, 1, 1, 1, 1, 0.2], // 25 非常困难【容易卡住。。这个算法不行】
  }[difficulty];

  const totalDeleteCount = boardSize * deleteCounts.reduce((a, b) => a + b, 0);
  return [deleteCounts, totalDeleteCount];
}

/**
 * 
 * @param {number[][]} board 一个填满的数独棋盘（答案）
 * @param {number} difficulty 
 * @param {number} attempts 
 * @returns 
 */
export function generateSudoku(board, difficulty, attempts = 5) {
  const [deleteCounts, targetDeleteCount] = calculateDeleteCounts(difficulty);
  const gridCounts = new Array(gridSize).fill(boardSize).map(() => new Array(gridSize).fill(boardSize));
  let totalDeleteCount = 0;

  // 遍历每个阶段
  for (let deleteCount of deleteCounts) {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // 如果当前九宫格内还有足够多的数字，尝试删除
        if (gridCounts[i][j] >= deleteCount && totalDeleteCount < targetDeleteCount) {
          // 尝试次数
          for (let attempt = 0; attempt < attempts; attempt++) {
            let tempBoard = cloneDeep(board);
            const realDeleteCount = deleteRandomInGrid(tempBoard, i, j, Math.min(deleteCount, targetDeleteCount - totalDeleteCount));

            // 如果删除后棋盘仍然有唯一解，接受当前删除；
            // 否则回退刚才的删除，继续尝试
            const solutions = checkUniqueSolution(tempBoard);
            if (solutions === 1) {
              board = tempBoard;
              gridCounts[i][j] -= realDeleteCount;
              totalDeleteCount += realDeleteCount;
              break;
            } else {
              if (attempt+1 === attempts) {
                console.log(`第${attempts}次尝试失败`);
              }
            }
          }
        }
      }
    }
  }
  console.log("数字数量（实际）: ", 81 - totalDeleteCount)

  return board;
}

// 在一个九宫格内随机删除一定数量的数字
function deleteRandomInGrid(board, gridI, gridJ, deleteCount) {
  // 计算要删除的整数个数和额外可能删除的一个数字的概率
  let deleteInteger = Math.floor(deleteCount);
  let deleteProbability = deleteCount - deleteInteger;
  let realDeleteCount = 0;

  // 随机选择九宫格中的一个数字并删除，重复 deleteInteger 次
  for (let i = 0; i < deleteInteger; i++) {
    if (deleteRandom(board, gridI, gridJ)) {
      realDeleteCount++;
    }
  }

  // 如果按照概率计算需要删除额外的数字，再删除一个
  if (Math.random() < deleteProbability) {
    if (deleteRandom(board, gridI, gridJ)) {
      realDeleteCount++;
    }
  }

  return realDeleteCount;
}

// 在一个九宫格内随机删除一个数字
function deleteRandom(board, gridI, gridJ) {
  let positions = [];

  // 找出九宫格内所有非空的位置
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board[gridI * gridSize + i][gridJ * gridSize + j] !== 0) {
        positions.push([gridI * gridSize + i, gridJ * gridSize + j]);
      }
    }
  }

  // 如果存在非空位置，从中随机选择一个并设为空
  if (positions.length > 0) {
    let randomIndex = Math.floor(Math.random() * positions.length);
    let [x, y] = positions[randomIndex];
    if (board[x][y]) {
      board[x][y] = 0;
      return true;
    }
  }
  return false;
}
