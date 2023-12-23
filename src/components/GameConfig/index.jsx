import { useState, useEffect } from "react";
import config from "../../utils/Config.js";
import { useTranslation } from "react-i18next";

// import PropTypes from "prop-types";

const GameConfig = ({ onUpdate, onUpdateLevel }) => {
  const { t } = useTranslation();

  const [level, setLevel] = useState(3);
  const [highlightNumbers, setHighlightNumbers] = useState(true);
  const [highlightCells, setHighlightCells] = useState(true);
  const [showErrors, setShowErrors] = useState(true);
  // const [boardSize, setBoardSize] = useState(9);

  function loadConfig() {
    setHighlightCells(config.highlightCells);
    setHighlightNumbers(config.highlightNumbers);
    setShowErrors(config.showErrors);
    // setBoardSize(config.boardSize);
    setLevel(config.level);
  }

  useEffect(() => {
    loadConfig();
  }, []);

  function toggleHighlightNumbers() {
    setHighlightNumbers(!highlightNumbers);
    config.updateConfigs({ highlightNumbers: !highlightNumbers });
    onUpdate();
  }

  function toggleHighlightCells() {
    setHighlightCells(!highlightCells);
    config.updateConfigs({ highlightCells: !highlightCells });
    onUpdate();
  }

  function toggleShowErrors() {
    setShowErrors(!showErrors);
    config.updateConfigs({ showErrors: !showErrors });
    onUpdate();
  }

  // function handleChangeBoardSize(e) {
  //   const newBoardSize = parseInt(e.target.value);
  //   setBoardSize(newBoardSize);
  //   config.updateConfigs({ boardSize: newBoardSize });
  //   onUpdate();
  // }

  function handleChangeLevel(e) {
    const newLevel = e.target.value;
    setLevel(newLevel);
    config.updateConfigs({ level: newLevel });
    onUpdateLevel();
  }

  return (
    <div>
      <div>
        <label>
          {t('Level:')}
          <select value={level} onChange={handleChangeLevel}>
            <option value="1">{t('Very Easy')}</option>
            <option value="2">{t('Easy')}</option>
            <option value="3">{t('Normal')}</option>
            <option value="4">{t('Hard')}</option>
            {/* <option value="5">{t('Very Hard')}</option> */}
            {/* <option value="0">{t('Empty')}</option> */}
          </select>
        </label>
      </div>
      <div>
        <label>
          {t('Highlight Numbers:')}
          <input
            type="checkbox"
            checked={highlightNumbers}
            onChange={toggleHighlightNumbers}
          />
        </label>
      </div>
      <div>
        <label>
          {t('Highlight Cells:')}
          <input
            type="checkbox"
            checked={highlightCells}
            onChange={toggleHighlightCells}
          />
        </label>
      </div>
      <div>
        <label>
          {t('Show Errors:')}
          <input
            type="checkbox"
            checked={showErrors}
            onChange={toggleShowErrors}
          />
        </label>
      </div>
      {/* <div>
        <label>
          Board Size:
          <select value={boardSize} onChange={handleChangeBoardSize}>
            <option value={4}>4x4</option>
            <option value={9}>9x9</option>
          </select>
        </label>
      </div> */}
    </div>
  );
};

// GameConfig.propTypes = {
//   onUpdate: PropTypes.func,
// };

export default GameConfig;
