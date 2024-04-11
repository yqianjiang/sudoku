export const LEVEL = {
  VERY_EASY: 0,
  EASY: 1,
  NORMAL: 2,
  HARD: 3,
  VERY_HARD: 4,
}


class Config {
  constructor() {
    this.configs = {
      highlightNumbers: true,
      highlightCells: true,
      showErrors: true,
      autoFillNotes: false,
      autoRemoveNotes: true,
      boardSize: 9,
      level: LEVEL.NORMAL,
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

  get autoFillNotes() {
    return this.configs.autoFillNotes;
  }

  get autoRemoveNotes() {
    return this.configs.autoRemoveNotes;
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
