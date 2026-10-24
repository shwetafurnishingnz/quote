import {
  AlertIcon,
  CalculatorIcon,
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
} from "../../layout/components/Icons";
import {
  FABRIC_OPTIONS,
  MOUNT_OPTIONS,
  STYLE_OPTIONS,
} from "../../variables/utils/variables";

const money = (value) =>
  `$${Number(value).toLocaleString("en-NZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function SelectField({ id, label, value, options, onChange }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StepField({ id, label, value, inputMode, error, onChange, onStep }) {
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="field-with-steps">
        <button type="button" className="step-btn" aria-label={`Decrease ${label}`} onClick={() => onStep(-1)}>
          −
        </button>
        <input
          id={id}
          inputMode={inputMode}
          placeholder="0"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="button" className="step-btn" aria-label={`Increase ${label}`} onClick={() => onStep(1)}>
          +
        </button>
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

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
    <>
      <div className="page-header">
        <h1 className="sheet-title">Build a quote</h1>
        <p className="sheet-subtitle">
          Pick the product, then enter each blind with its own length and sag.
        </p>
      </div>

      <div className="quote-layout">
        <form className="sheet" onSubmit={onCalculate}>
          {quoteErrors.global && (
            <div className="form-global-error">
              <AlertIcon size={18} />
              Each blind needs a length and sag greater than zero.
            </div>
          )}

          <section className="quote-form-section">
            <h2 className="section-title">Product</h2>
            <p className="section-hint">Applies to every blind in this quote.</p>
            <div className="field-grid">
              <SelectField id="quote-style" label="Style" value={style} options={STYLE_OPTIONS} onChange={onStyleChange} />
              <SelectField id="quote-fabric" label="Fabric" value={fabric} options={FABRIC_OPTIONS} onChange={onFabricChange} />
              <SelectField id="quote-mount" label="Mount" value={mount} options={MOUNT_OPTIONS} onChange={onMountChange} />
            </div>
          </section>

          <section className="quote-form-section">
            <h2 className="section-title">Blinds</h2>
            <p className="section-hint">Measurements in centimetres.</p>

            <div className="blind-list">
              {blinds.map((blind, index) => {
                const errors = quoteErrors.blinds?.[index] ?? {};
                return (
                  <div className="blind-row" key={blind.id ?? index}>
                    <div className="blind-row-head">
                      <div className="blind-row-title">
                        <span className="blind-row-badge">{index + 1}</span>
                        Blind {index + 1}
                      </div>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Remove blind ${index + 1}`}
                        title="Remove blind"
                        onClick={() => onRemoveBlind(index)}
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>

                    <div className="blind-row-fields">
                      <StepField
                        id={`blind-length-${index}`}
                        label="Length (cm)"
                        inputMode="decimal"
                        value={blind.length}
                        error={errors.length && "Must be greater than 0"}
                        onChange={(value) => onBlindsChange(index, "length", value)}
                        onStep={(delta) => onStepField(index, "length", delta)}
                      />
                      <StepField
                        id={`blind-sag-${index}`}
                        label="Sag (cm)"
                        inputMode="decimal"
                        value={blind.sag}
                        error={errors.sag && "Must be greater than 0"}
                        onChange={(value) => onBlindsChange(index, "sag", value)}
                        onStep={(delta) => onStepField(index, "sag", delta)}
                      />
                      <StepField
                        id={`blind-brackets-${index}`}
                        label="Brackets"
                        inputMode="numeric"
                        value={blind.brackets ?? 2}
                        onChange={(value) => onBlindsChange(index, "brackets", value)}
                        onStep={(delta) => onStepField(index, "brackets", delta)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button type="button" className="btn btn-dashed" onClick={onAddBlind}>
              <PlusIcon size={18} />
              Add another blind
            </button>
          </section>

          <div className="form-actions quote-form-footer">
            <button type="button" className="btn btn-ghost" onClick={onClear}>
              Clear
            </button>
            <span className="spacer" />
            <button type="submit" className="btn btn-primary">
              Calculate quote
            </button>
          </div>
        </form>

        <aside className="sheet quote-summary" aria-live="polite">
          {quoteResult ? (
            <>
              <div className="quote-total-card">
                <div className="quote-total-label">Total incl. GST</div>
                <div className="quote-total-value">{money(quoteResult.total)}</div>
                <div className="quote-total-meta">
                  {quoteResult.blinds?.length ?? quoteResult.quantity} blind
                  {(quoteResult.blinds?.length ?? quoteResult.quantity) === 1 ? "" : "s"}
                </div>
              </div>

              <div className="quote-line">
                <span className="quote-line-label">Subtotal</span>
                <span className="quote-line-value">{money(quoteResult.subtotal)}</span>
              </div>
              <div className="quote-line">
                <span className="quote-line-label">GST</span>
                <span className="quote-line-value">{money(quoteResult.gst)}</span>
              </div>

              {quoteResult.breakdown?.length > 0 && (
                <details className="quote-details" open>
                  <summary>
                    What's included
                    <ChevronDownIcon size={16} />
                  </summary>
                  <div className="quote-details-body">
                    {quoteResult.breakdown.map((row, index) => (
                      <div className="quote-breakdown-line" key={`${row.label}-${index}`}>
                        <span className="quote-line-label">{row.label}</span>
                        <span className="quote-line-value">{money(row.value)}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              <details className="quote-details">
                <summary>
                  Calculation
                  <ChevronDownIcon size={16} />
                </summary>
                <div className="quote-details-body">
                  <div className="quote-equation-text">{quoteResult.equation}</div>
                </div>
              </details>
            </>
          ) : (
            <div className="quote-summary-empty">
              <span className="home-card-icon">
                <CalculatorIcon />
              </span>
              <div className="section-title">No quote yet</div>
              Fill in your blinds and press <strong>Calculate quote</strong> to
              see the price here.
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
