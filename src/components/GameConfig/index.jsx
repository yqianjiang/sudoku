import { useState, useEffect } from "react";
import config from "../../utils/Config.js";
import { useTranslation } from "react-i18next";
import "./style.css";

// import PropTypes from "prop-types";

const GameConfig = ({ onUpdate }) => {
  const { t } = useTranslation();

  const [highlightNumbers, setHighlightNumbers] = useState(true);
  const [highlightCells, setHighlightCells] = useState(true);
  const [showErrors, setShowErrors] = useState(true);
  // const [autoFillNotes, setAutoFillNotes] = useState(false);
  const [autoRemoveNotes, setAutoRemoveNotes] = useState(true);
  // const [boardSize, setBoardSize] = useState(9);

  function loadConfig() {
    setHighlightCells(config.highlightCells);
    setHighlightNumbers(config.highlightNumbers);
    setShowErrors(config.showErrors);
    // setAutoFillNotes(config.autoFillNotes);
    setAutoRemoveNotes(config.autoRemoveNotes);
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

  // function toggleAutoFillNotes() {
  //   setAutoFillNotes(!autoFillNotes);
  //   config.updateConfigs({ autoFillNotes: !autoFillNotes });
  //   onUpdate();
  // }

  function toggleAutoRemoveNotes() {
    setAutoRemoveNotes(!autoRemoveNotes);
    config.updateConfigs({ autoRemoveNotes: !autoRemoveNotes });
    onUpdate();
  }

  // function handleChangeBoardSize(e) {
  //   const newBoardSize = parseInt(e.target.value);
  //   setBoardSize(newBoardSize);
  //   config.updateConfigs({ boardSize: newBoardSize });
  //   onUpdate();
  // }

  return (
    <div className="settings">
      <div className="settings-title">{t("Settings")}</div>
      <div className="settings-option">
        <label className="settings-option-label">
          {t("Highlight Numbers")}
          <input
            type="checkbox"
            checked={highlightNumbers}
            onChange={toggleHighlightNumbers}
          />
        </label>
      </div>
      <div className="settings-option">
        <label className="settings-option-label">
          {t("Highlight Cells")}
          <input
            type="checkbox"
            checked={highlightCells}
            onChange={toggleHighlightCells}
          />
        </label>
      </div>
      <div className="settings-option">
        <label className="settings-option-label">
          {t("Show Errors")}
          <input
            type="checkbox"
            checked={showErrors}
            onChange={toggleShowErrors}
          />
        </label>
      </div>
      {/* <div className="settings-option">
        <label className="settings-option-label">
          {t("Auto Fill Notes:")}
          <input type="checkbox" disabled />
        </label>
      </div> */}
      <div className="settings-option">
        <label className="settings-option-label">
          {t("Auto Remove Notes")}
          <input
            type="checkbox"
            checked={autoRemoveNotes}
            onChange={toggleAutoRemoveNotes}
          />
        </label>
      </div>
      {/* <div className="settings-option">
        <label className="settings-option-label">
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
