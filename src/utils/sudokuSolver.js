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
