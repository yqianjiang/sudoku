
export function solveSudokuAll(board) {
  const matrix = board.map((row) => {
    return row.map((item) => +item || 0);
  });

  const res = trySolve([...matrix], 0, 0);

  if (res.length > 1) {
    console.log('解的数量：', res.length);
  }
  // for (const i in board) {
  //     board[i] = res[0][i].map(x=>`${x}`);
  // }
}

const getNeighborVal = (matrix, i, j) => {
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
  const res = [];
  const neighbors = getNeighborIdx(i, j);
  for (const item of neighbors) {
    let [x, y] = item;
    res.push(matrix[x][y]);
  }
  return res;
};

// 检查item在arr中是否已经存在
const checkScope = (arr, item) => {
  return arr.includes(item);
};

// 检测matrix[i][j]是否合法
const checkNumber = (
  matrix,
  i,
  j,
  candidate
) => {
  const item = candidate;

  // 检查同一行、同一列、九宫格是否已经存在item
  if (
    checkScope(matrix[i], item) ||
    checkScope(
      matrix.map((x) => x[j]),
      item
    ) ||
    checkScope(getNeighborVal(matrix, i, j), item)
  ) {
    return false;
  }

  return true;
};

// 在某一格填入数字k（非原地）
const fillItem = (
  matrix,
  i,
  j,
  k
) => {
  // matrix[i][j] |= 1 << k;
  const res = [];
  for (const x in matrix) {
    res.push([...matrix[x]]);
  }
  res[i][j] = k;
  return res;
};

const getNextIdx = (i, j) => {
  if (i + 1 < 9) {
    return [i + 1, j];
  } else if (j + 1 < 9) {
    return [0, j + 1];
  } else {
    // 超出范围
    return [0, 0];
  }
};

// 找出所有可能的解
// 遍历每一格...当发现错误时退出遍历。
// 返回填好的新matrix
const trySolve = (matrix, i, j) => {
  const [x, y] = getNextIdx(i, j);

  // 不需要填入，直接下一格
  if (matrix[i][j] !== 0) {
    if (x + y === 0) {
      return [matrix]; // 遍历完成，返回当前结果
    }
    return trySolve(matrix, x, y);
  }

  // 需要填入数字

  const res = []; // 暂存所有ok的matrix

  // 1-9，每个数字尝试一次
  for (let k = 1; k < 10; k++) {
    // 检查填入k是否可行，若可行，复制一份，在复制的基础上继续推演trySolve下一格
    if (checkNumber(matrix, i, j, k)) {
      // 把第k个位置变为1 --> 填入数字k
      const tmpMatrix = fillItem(matrix, i, j, k);

      if (x + y === 0) {
        return [tmpMatrix]; // 遍历完成，返回当前结果
      }

      res.push(...trySolve(tmpMatrix, x, y));
    }
  }

  return res;
};