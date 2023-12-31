class Stage {
  constructor(canvas, gameBoard, configs) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.gameBoard = gameBoard;

    this.configs = configs;

    this.theme = {
      background: '#fff',
      highlightColor: '#99ddff',
      highlightNumberColor: '#66bbff',
      selectedStrokeColor: '#0055FF',
      boardStrokeColor: '#336699',
      errorColor: '#ff0055',
      textColor: '#333',
      textColorPlayer: '#666',
      boldLineWidth: 3,
      normalLineWidth: 1,
      cellSize: 34,
    };
    this.scaleFactor = window.devicePixelRatio;
    this.setCanvasSize();
  }

  setCanvasSize() {
    const { boardSize } = this.configs;
    const width = boardSize * this.theme.cellSize;
    const height = boardSize * this.theme.cellSize;
    // 设置css确保显示的大小
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    // 避免模糊
    this.canvas.width = width * this.scaleFactor;
    this.canvas.height = height * this.scaleFactor;
    this.ctx.scale(this.scaleFactor, this.scaleFactor);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render(square) {
    this.clear();
    if (this.configs.highlightCells && square) {
      this.drawRelatedSquares(square);
    }
    if (this.configs.highlightNumbers && square) {
      this.drawRelatedNumbers(square);
    }
    if (square) {
      this.drawSelectedSquare(square);
    }
    if (this.configs.showErrors) {
      this.drawWrongCells();
    }
    this.drawGameBoard();
    this.renderNotes();
    this.renderNumbers();
  }

  // 渲染蒙层
  renderMask(opacity, numberVisible) {
    this.clear();
    this.drawGameBoard();
    if (numberVisible) {
      this.renderNumbers();
    }
    this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    this.ctx.fillRect(0, 0, this.canvas.width / this.scaleFactor, this.canvas.height / this.scaleFactor);
  }

  // 渲染文字
  renderText(text, x, y) {
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  renderWin() {
    this.renderMask(0.3, true);
    this.renderText('You Win!', this.canvas.width / 2 / this.scaleFactor, this.canvas.height / 2 / this.scaleFactor);
  }

  renderPause(text) {
    this.renderMask(0.5);
    this.renderText(text || 'Paused', this.canvas.width / 2 / this.scaleFactor, this.canvas.height / 2 / this.scaleFactor);
  }

  // 画数独游戏的背景游戏板，九宫格范围内线条加粗
  drawGameBoard() {
    const rows = this.configs.boardSize;
    const cols = this.configs.boardSize;
    const cellSize = this.theme.cellSize;
    const boldLineWidth = this.theme.boldLineWidth;

    this.ctx.lineWidth = this.theme.normalLineWidth;
    this.ctx.strokeStyle = this.theme.boardStrokeColor;

    // 画横线
    for (let i = 0; i <= rows; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * cellSize);
      this.ctx.lineTo(this.canvas.width, i * cellSize);
      this.ctx.stroke();
    }

    // 画竖线
    for (let i = 0; i <= cols; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * cellSize, 0);
      this.ctx.lineTo(i * cellSize, this.canvas.height);
      this.ctx.stroke();
    }

    // 画加粗的九宫格
    this.ctx.lineWidth = boldLineWidth;

    // 画加粗的横线
    for (let i = 0; i <= rows; i += Math.sqrt(rows)) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * cellSize);
      this.ctx.lineTo(this.canvas.width, i * cellSize);
      this.ctx.stroke();
    }

    // 画加粗的竖线
    for (let i = 0; i <= cols; i += Math.sqrt(cols)) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * cellSize, 0);
      this.ctx.lineTo(i * cellSize, this.canvas.height);
      this.ctx.stroke();
    }
  }

  // 填数字，numbers 是一个 9x9 的二维数组，每个元素是一个数字，0 表示空
  renderNumbers() {
    const numbers = this.gameBoard.getBoard();
    const cellSize = this.theme.cellSize;
    const fontSize = 0.6 * cellSize;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (let row = 0; row < numbers.length; row++) {
      for (let col = 0; col < numbers[row].length; col++) {
        const number = numbers[row][col];
        const isOriginal = this.gameBoard.isOriginal(row, col); // Check if the number is original

        if (number !== 0) {
          this.ctx.fillStyle = this.theme.textColor;
          if (isOriginal) {
            this.ctx.font = `${fontSize}px Arial`;
          } else {
            this.ctx.font = `bold ${fontSize}px Arial`; // Set font to bold for player-filled numbers
          }

          this.ctx.fillText(number, col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
        }
      }
    }
  }

  renderNotes() {
    const numbers = this.gameBoard.getBoard();
    const size = Math.sqrt(this.configs.boardSize);
    const cellSize = this.theme.cellSize;
    const fontSize = 0.26 * cellSize;
    const padding = 2;
    const innerCellSize = cellSize - padding * 2;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (let row = 0; row < numbers.length; row++) {
      for (let col = 0; col < numbers[row].length; col++) {
        const number = numbers[row][col];

        if (number === 0) {
          // Draw notes, notes 为一个等同于 boardSize 的一维 boolean 数组，每个数字有固定的渲染位置，为 true 时渲染
          const notes = this.gameBoard.getNotes(row, col);

          // 计算当前格子的左上角
          const startX = col * cellSize;
          const startY = row * cellSize;

          for (let i = 0; i < notes.length; i++) {
            if (notes[i]) {
              const x = startX + padding + innerCellSize / 2 + (i % size - 1) * innerCellSize / 3;
              const y = startY + padding + innerCellSize / 2 + Math.floor(i / size - 1) * innerCellSize / 3;
              this.ctx.fillStyle = this.theme.textColorPlayer;
              this.ctx.fillText(i + 1, x, y);
            }
          }
        }
      }
    }
  }

  // 画选中的方格
  drawSelectedSquare(square) {
    const cellSize = this.theme.cellSize;
    const boldLineWidth = this.theme.boldLineWidth;

    this.ctx.lineWidth = boldLineWidth;
    this.ctx.strokeStyle = this.theme.selectedStrokeColor;
    this.ctx.fillStyle = this.theme.highlightNumberColor;

    this.ctx.fillRect(square.col * cellSize, square.row * cellSize, cellSize, cellSize);
    this.ctx.strokeRect(square.col * cellSize, square.row * cellSize, cellSize, cellSize);
  }
  
  drawWrongCells() {
    const cellSize = this.theme.cellSize;
    const errorColor = this.theme.errorColor;
    
    this.ctx.fillStyle = errorColor;
    for (let i = 0; i < this.gameBoard.wrongCells.length; i++) {
      const cell = this.gameBoard.wrongCells[i];
      this.ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
    }
  }

  // 如果选中方格有数字，高亮所有相同的数字
  drawRelatedNumbers(square) {
    const cellSize = this.theme.cellSize;
    const highlightColor = this.theme.highlightNumberColor;

    const numbers = this.gameBoard.getBoard();
    const selectedNumber = numbers[square.row][square.col];

    if (!selectedNumber) {
      return;
    }

    for (let row = 0; row < numbers.length; row++) {
      for (let col = 0; col < numbers[row].length; col++) {
        if (numbers[row][col] === selectedNumber) {
          this.ctx.fillStyle = highlightColor;
          this.ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  // 选中方格同时高亮同一行、同一列、同一九宫格的方格
  drawRelatedSquares(square) {
    const cellSize = this.theme.cellSize;
    const highlightColor = this.theme.highlightColor;

    // 高亮同一行的方格
    for (let col = 0; col < this.configs.boardSize; col++) {
      if (col !== square.col) {
        this.ctx.fillStyle = highlightColor;
        this.ctx.fillRect(col * cellSize, square.row * cellSize, cellSize, cellSize);
      }
    }

    // 高亮同一列的方格
    for (let row = 0; row < this.configs.boardSize; row++) {
      if (row !== square.row) {
        this.ctx.fillStyle = highlightColor;
        this.ctx.fillRect(square.col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }

    // 高亮同一九宫格的方格
    const size = Math.sqrt(this.configs.boardSize);
    const startRow = Math.floor(square.row / size) * size;
    const startCol = Math.floor(square.col / size) * size;
    for (let row = startRow; row < startRow + size; row++) {
      for (let col = startCol; col < startCol + size; col++) {
        if (row !== square.row || col !== square.col) {
          this.ctx.fillStyle = highlightColor;
          this.ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
  }
}

export default Stage;
