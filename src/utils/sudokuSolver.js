const getNeighborIdx = (i, j) => {
  const getBox = (x) => Math.floor(x / 3);
  const di = getBox(i) * 3;
  const dj = getBox(j) * 3;
  return [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ].map((y) => [y[0] + di, y[1] + dj]);
};

const getNeighborVal = (matrix, i, j, maxNum) => {
  const res = [];
  const neighbors = getNeighborIdx(i, j, maxNum);
  for (const item of neighbors) {
    let [x, y] = item;
    res.push(+matrix[x][y]);
  }
  return res;
};

const checkScope = (arr, item, candidateMode) => {
  if (candidateMode) {
    return arr.includes(item);
  } else {
    return arr.filter((x) => +x === +item).length > 1;
  }
};

export const checkNumber = (matrix, i, j, candidate = 999, maxNum=9) => {
  const candidateMode = candidate !== 999;
  const item = candidateMode ? candidate : +matrix[i][j];

  if (item === 0) return true;
  if (item > maxNum || item < 1) return false;

  if (
    checkScope(matrix[i], item, candidateMode) ||
    checkScope(
      matrix.map((x) => x[j]),
      item,
      candidateMode
    ) ||
    checkScope(getNeighborVal(matrix, i, j), item, candidateMode)
  ) {
    return false;
  }

  return true;
};

const trySolve = (matrix, maxNum=9) => {
  for (const i in matrix) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== 0) {
        continue;
      }

      for (let k = 1; k < maxNum + 1; k++) {
        if (checkNumber(matrix, +i, j, k, maxNum)) {
          matrix[i][j] = k;
          if (trySolve(matrix, maxNum)) {
            return true;
          }

          matrix[i][j] = 0;
        }
      }
      if (matrix[i][j] === 0) {
        return false;
      }
    }
  }
  return true;
};

export const solveSudoku = (initMatrix, maxNum) => {
  const matrix = initMatrix.map((row) => {
    return row.map((item) => +item || 0);
  });

  const res = trySolve(matrix, maxNum);

  if (res) {
    return matrix;
  }
};

/**
 * 检查数独关卡是否有唯一解
 * @param {number[][]} board 
 * @returns {number} 解的数量
 */
export const checkUniqueSolution = (board, solutions = 0, x = 0, y = 0) => {
  const boardSize = board.length;

  // Overflow to next row
  if (y === boardSize) {
    x += 1;
    y = 0;
  }

  // If x equals boardSize, a solution is found
  if (x === boardSize) {
    return solutions + 1;
  }

  // If there is already more than one solution, no need to continue
  if (solutions > 1) {
    return solutions;
  }

  if (board[x][y] !== 0) {
    // Skip this cell
    return checkUniqueSolution(board, solutions, x, y + 1);
  }

  for (let i = 1; i <= boardSize; i++) {
    if (isValid(board, x, y, i)) {
      board[x][y] = i;
      solutions = checkUniqueSolution(board, solutions, x, y + 1);
      if (solutions > 1) break; // If there is already more than one solution, no need to continue.
      board[x][y] = 0; // undo the move
    }
  }

  return solutions;
}

function isValid(board, x, y, num) {
  const boardSize = board.length;
  // Check if `num` is not in same row
  for(let i = 0; i < boardSize; i++) {
    if(board[i][y] === num) return false;
  }
  // Check if `num` is not in same column
  for(let i = 0; i < boardSize; i++) {
    if(board[x][i] === num) return false;
  }
  // Check if `num` is not in same box
  let startRow = x - x%3;
  let startCol = y - y%3;
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      if(board[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
}