class EventManager {
  constructor(stage, gameBoard, configs) {
    this.stage = stage;
    this.gameBoard = gameBoard;
    this.configs = configs;
    this.selectedSquare = null;

    this.stage.canvas.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleClick(event) {
    if (this.gameBoard.gameState !== 'running') {
      console.log('当前不可操作')
      return;
    }

    // 处理点击事件的逻辑
    const x = event.clientX;
    const y = event.clientY;

    // 根据点击的坐标计算出对应的方格
    const square = this.calculateSquare(x, y);
    this.selectedSquare = square;

    // 更新游戏面板
    this.stage.render(square);
  }

  calculateSquare(x, y) {
    // 减去 canvas 的偏移量
    const rect = this.stage.canvas.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;

    const cellSizeCol = this.stage.theme.cellSize;
    const cellSizeRow = this.stage.theme.cellSize
    const row = Math.floor(y / cellSizeRow);
    const col = Math.floor(x / cellSizeCol);

    return { row, col }
  }

  // 键盘输入
  handleKeyDown(event) {
    if (this.gameBoard.gameState !== 'running') {
      return;
    }

    const maxNum = this.configs.boardSize;
    // 方向键切换选中的方格
    if (event.key === 'ArrowUp') {
      this.selectedSquare.row = (this.selectedSquare.row + (maxNum - 1)) % maxNum;
    } else if (event.key === 'ArrowDown') {
      this.selectedSquare.row = (this.selectedSquare.row + 1) % maxNum;
    } else if (event.key === 'ArrowLeft') {
      this.selectedSquare.col = (this.selectedSquare.col + (maxNum - 1)) % maxNum;
    } else if (event.key === 'ArrowRight') {
      this.selectedSquare.col = (this.selectedSquare.col + 1) % maxNum;
    }

    // 数字键填入数字
    const number = Number(event.key);
    this.fillNumber(number);

    // 删除键删除数字
    if (event.key === 'Backspace') {
      this.fillNumber(0);
    }

    // 更新
    this.stage.render(this.selectedSquare);
  }

  fillNumber(number) {
    if (!this.selectedSquare) {
      return;
    }

    if (number >= 0 && number <= this.configs.boardSize) {
      this.gameBoard.fillNumber(this.selectedSquare.row, this.selectedSquare.col, number);
    }
  }
}

export default EventManager;