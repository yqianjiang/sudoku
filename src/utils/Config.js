class Config {
  constructor() {
    this.configs = {
      highlightNumbers: true,
      highlightCells: true,
      showErrors: true,
      boardSize: 9,
      level: 3,
    };
    this.initConfigs();
  }

  get highlightCells() {
    return this.configs.highlightCells;
  }

  get highlightNumbers() {
    return this.configs.highlightNumbers;
  }

  get showErrors() {
    return this.configs.showErrors;
  }

  get boardSize() {
    return this.configs.boardSize;
  }

  get level() {
    return this.configs.level;
  }

  initConfigs() {
    // read from local storage
    const configs = localStorage.getItem('sudoku:configs');
    if (configs) {
      this.configs = JSON.parse(configs);
    }
  }

  saveConfigs() {
    // save to local storage
    localStorage.setItem('sudoku:configs', JSON.stringify(this.configs));
  }

  updateConfigs(newConfigPartial) {
    this.configs = {
      ...this.configs,
      ...newConfigPartial,
    };
    this.saveConfigs();
  }

  resetConfigs() {
    this.configs = {
      highlightNumbers: true,
      highlightCells: true,
      showErrors: true,
    };
    this.saveConfigs();
  }
}

// 全局唯一
const config = new Config();
export default config;