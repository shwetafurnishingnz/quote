import {
  FABRIC_OPTIONS,
  MOUNT_OPTIONS,
  STYLE_OPTIONS,
} from "../../variables/utils/variables";

export default function QuoteSection({
  blinds,
  style,
  fabric,
  mount,
  quoteErrors,
  quoteResult,
  onBlindsChange,
  onStyleChange,
  onFabricChange,
  onMountChange,
  onStepField,
  onClear,
  onCalculate,
  onAddBlind,
  onRemoveBlind,
}) {
  return (
    <div className="sheet">
      <h1 className="sheet-title">New quote</h1>
      <p className="sheet-subtitle">
        Enter each blind with its own length and sag.
      </p>

      <form onSubmit={onCalculate}>
        {quoteErrors.global && (
          <div className="form-global-error">
            Check the highlighted fields — each blind needs length and sag greater than zero.
          </div>
        )}

        <div className="field-grid top-fields">
          <div className="field">
            <label htmlFor="quote-style">Style</label>
            <select id="quote-style" value={style} onChange={onStyleChange}>
              {STYLE_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="quote-fabric">Fabric</label>
            <select id="quote-fabric" value={fabric} onChange={onFabricChange}>
              {FABRIC_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="quote-mount">Mount</label>
            <select id="quote-mount" value={mount} onChange={onMountChange}>
              {MOUNT_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="blind-list">
          {blinds.map((blind, index) => (
            <div className="blind-row" key={blind.id ?? index}>
              <div className="blind-row-title">Blind {index + 1}</div>
              <div className="blind-row-fields">
                <div className={`field${quoteErrors.blinds?.[index]?.length ? " has-error" : ""}`}>
                  <label htmlFor={`blind-length-${index}`}>Length (cm)</label>
                  <div className="field-with-steps">
                    <button type="button" className="step-btn" onClick={() => onStepField(index, "length", -1)}>
                      −
                    </button>
                    <input
                      id={`blind-length-${index}`}
                      inputMode="decimal"
                      value={blind.length}
                      onChange={(event) => onBlindsChange(index, "length", event.target.value)}
                    />
                    <button type="button" className="step-btn" onClick={() => onStepField(index, "length", 1)}>
                      +
                    </button>
                  </div>
                  {quoteErrors.blinds?.[index]?.length && (
                    <span className="field-error">Length must be greater than 0.</span>
                  )}
                </div>

                <div className={`field${quoteErrors.blinds?.[index]?.sag ? " has-error" : ""}`}>
                  <label htmlFor={`blind-sag-${index}`}>Sag (cm)</label>
                  <div className="field-with-steps">
                    <button type="button" className="step-btn" onClick={() => onStepField(index, "sag", -1)}>
                      −
                    </button>
                    <input
                      id={`blind-sag-${index}`}
                      inputMode="decimal"
                      value={blind.sag}
                      onChange={(event) => onBlindsChange(index, "sag", event.target.value)}
                    />
                    <button type="button" className="step-btn" onClick={() => onStepField(index, "sag", 1)}>
                      +
                    </button>
                  </div>
                  {quoteErrors.blinds?.[index]?.sag && (
                    <span className="field-error">Sag must be greater than 0.</span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor={`blind-brackets-${index}`}>Brackets</label>
                  <div className="field-with-steps">
                    <button type="button" className="step-btn" onClick={() => onStepField(index, "brackets", -1)}>
                      −
                    </button>
                    <input
                      id={`blind-brackets-${index}`}
                      inputMode="numeric"
                      value={blind.brackets ?? 2}
                      onChange={(event) => onBlindsChange(index, "brackets", event.target.value)}
                    />
                    <button type="button" className="step-btn" onClick={() => onStepField(index, "brackets", 1)}>
                      +
                    </button>
                  </div>
                </div>

                <div className="blind-row-actions">
                  <button type="button" className="btn btn-secondary small" onClick={() => onRemoveBlind(index)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onAddBlind}>
            + Add blind
          </button>
          <button type="submit" className="btn btn-primary">
            Calculate quote
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClear}>
            Clear
          </button>
        </div>
      </form>

      {quoteResult && (
        <div className="quote-result">
          <div className="quote-line">
            <span className="quote-line-label">Blinds</span>
            <span className="quote-line-value">{quoteResult.blinds?.length ?? quoteResult.quantity}</span>
          </div>
          <div className="quote-line">
            <span className="quote-line-label">Subtotal</span>
            <span className="quote-line-value">${quoteResult.subtotal.toFixed(2)}</span>
          </div>
          <div className="quote-line">
            <span className="quote-line-label">GST</span>
            <span className="quote-line-value">${quoteResult.gst.toFixed(2)}</span>
          </div>
          <div className="quote-line quote-line-total">
            <span>Total</span>
            <span className="quote-line-value">${quoteResult.total.toFixed(2)}</span>
          </div>

          <div className="quote-equation">
            <div className="quote-equation-title">Calculation</div>
            <div className="quote-equation-text">{quoteResult.equation}</div>
          </div>

          <div className="quote-breakdown">
            <div className="quote-equation-title">What is being added</div>
            {quoteResult.breakdown?.map((row, index) => (
              <div className="quote-breakdown-line" key={`${row.label}-${index}`}>
                <span className="quote-line-label">{row.label}</span>
                <span className="quote-line-value">${Number(row.value).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
