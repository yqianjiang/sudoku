class EventManager {
  constructor(stage, gameBoard, configs) {
    this.stage = stage;
    this.gameBoard = gameBoard;
    this.configs = configs;
    this.selectedSquare = null;
    this.notesMode = false; // 标记模式状态

    const handleClick = this.throttle(this.handleClick.bind(this), 300);
    const handleWindowResize = this.debounce(this.handleWindowResize.bind(this), 100);

    this.stage.canvas.addEventListener('click', handleClick);
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('resize', handleWindowResize);

    this.handleWindowResize();
  }

  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  throttle(func, delay) {
    let lastCallTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCallTime >= delay) {
        func.apply(this, args);
        lastCallTime = now;
      }
    };
  }

  handleClick(event) {
    if (!this.gameBoard.is_running()) {
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
    if (!this.gameBoard.is_running()) {
      return;
    }
    // 阻止默认
    event.preventDefault();

    // Tab 切换标记模式
    if (event.key === 'Tab') {
      this.toggleNotesMode();
      this.stage.render(this.selectedSquare);
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
      if (this.notesMode) {
        this.gameBoard.fill_notes(this.selectedSquare.row, this.selectedSquare.col, number);
      } else {
        this.gameBoard.fill_number(this.selectedSquare.row, this.selectedSquare.col, number);
      }
    }
  }

  fillNote(number) {
    if (!this.selectedSquare) {
      return;
    }

    if (number >= 0 && number <= this.configs.boardSize) {
      this.gameBoard.fill_notes(this.selectedSquare.row, this.selectedSquare.col, number);
    }
  }

  toggleNotesMode() {
    this.notesMode = !this.notesMode;
  }

  handleWindowResize() {
    // 根据窗口大小调整 this.stage.theme.cellSize
    const width = document.body.clientWidth - 60;
    const height = window.innerHeight;
    const size = Math.min(width, height);
    const maxCellSize = Math.floor(size / this.configs.boardSize);
    const cellSize = Math.min(maxCellSize, 50);
    this.stage.theme.cellSize = cellSize;
    document.documentElement.style.setProperty('--cell-size', `${cellSize}px`);
    this.stage.setCanvasSize();
    this.stage.render(this.selectedSquare);
  }
}

export default EventManager;
