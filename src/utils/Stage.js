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
      };
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
    this.renderNumbers();
  }

  renderWin() {
    this.clear();
    this.drawGameBoard();
    this.renderNumbers();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('You Win!', this.canvas.width / 2, this.canvas.height / 2);
  }

  renderPause() {
    this.clear();
    this.drawGameBoard();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Paused', this.canvas.width / 2, this.canvas.height / 2);
  }

  // 画数独游戏的背景游戏板，九宫格范围内线条加粗
  drawGameBoard() {
    const rows = this.configs.boardSize;
    const cols = this.configs.boardSize;
    const cellSize = this.canvas.width / cols;
    const boldLineWidth = this.theme.boldLineWidth;

    this.ctx.lineWidth = this.theme.normalLineWidth;
    this.ctx.strokeStyle = this.theme.boardStrokeColor;

    for (let i = 0; i <= rows; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * cellSize);
      this.ctx.lineTo(this.canvas.width, i * cellSize);
      this.ctx.stroke();
    }

    for (let i = 0; i <= cols; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * cellSize, 0);
      this.ctx.lineTo(i * cellSize, this.canvas.height);
      this.ctx.stroke();
    }

    this.ctx.lineWidth = boldLineWidth;

    for (let i = 0; i <= rows; i += Math.sqrt(rows)) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * cellSize);
      this.ctx.lineTo(this.canvas.width, i * cellSize);
      this.ctx.stroke();
    }

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
    const cellSize = this.canvas.width / this.configs.boardSize;
    const fontSize = 0.6 * cellSize;
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (let row = 0; row < numbers.length; row++) {
      for (let col = 0; col < numbers[row].length; col++) {
        const number = numbers[row][col];
        const isOriginal = this.gameBoard.isOriginal(row, col); // Check if the number is original

        if (number !== 0) {
          if (isOriginal) {
            this.ctx.fillStyle = this.theme.textColor; // Use theme.textColor for original numbers
          } else {
            this.ctx.fillStyle = this.theme.textColorPlayer; // Use theme.textColorPlayer for player-filled numbers
          }

          this.ctx.fillText(number, col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
        }
      }
    }
  }


  // 画选中的方格
  drawSelectedSquare(square) {
    const cellSize = this.canvas.width / this.configs.boardSize;
    const boldLineWidth = this.theme.boldLineWidth;

    this.ctx.lineWidth = boldLineWidth;
    this.ctx.strokeStyle = this.theme.selectedStrokeColor;
    this.ctx.fillStyle = this.theme.highlightNumberColor;

    this.ctx.fillRect(square.col * cellSize, square.row * cellSize, cellSize, cellSize);
    this.ctx.strokeRect(square.col * cellSize, square.row * cellSize, cellSize, cellSize);
  }
  
  drawWrongCells() {
    const cellSize = this.canvas.width / this.configs.boardSize;
    const errorColor = this.theme.errorColor;
    
    this.ctx.fillStyle = errorColor;
    for (let i = 0; i < this.gameBoard.wrongCells.length; i++) {
      const cell = this.gameBoard.wrongCells[i];
      this.ctx.fillRect(cell.col * cellSize, cell.row * cellSize, cellSize, cellSize);
    }
  }

  // 如果选中方格有数字，高亮所有相同的数字
  drawRelatedNumbers(square) {
    const cellSize = this.canvas.width / this.configs.boardSize;
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
    const cellSize = this.canvas.width / this.configs.boardSize;
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
