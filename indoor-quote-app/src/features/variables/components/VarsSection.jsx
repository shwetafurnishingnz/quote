import { VAR_GROUPS } from "../utils/variables";

const GROUP_HINTS = {
  materials: "Per-unit costs for fabric and hardware.",
  overhead: "Fixed costs added to each blind.",
  taxes: "GST and the margin applied to cost.",
};

export default function VarsSection({
  editVars,
  syncStatus,
  syncStatusMessage,
  onStepField,
  onInputChange,
  onSave,
  onCancel,
}) {
  return (
    <>
      <div className="vars-header">
        <div>
          <span className="eyebrow">Settings</span>
          <h1 className="sheet-title">Pricing variables</h1>
          <p className="sheet-subtitle">
            These drive every quote. Changes save locally and sync to every
            signed-in device when the cloud is available.
          </p>
        </div>

        <div className={`sync-badge ${syncStatus}`}>
          <span className="sync-dot" />
          {syncStatusMessage}
        </div>
      </div>

      <form onSubmit={onSave}>
        <div className="var-groups">
          {VAR_GROUPS.map((group) => (
            <section className="sheet" key={group.key}>
              <h2 className="section-title">{group.label}</h2>
              <p className="section-hint">{GROUP_HINTS[group.key]}</p>
              <div className="field-grid">
                {group.fields.map((field) => (
                  <div className="field" key={field.key}>
                    <label htmlFor={`${group.key}-${field.key}`}>
                      {field.label}
                    </label>
                    <div className="field-with-steps">
                      <button
                        type="button"
                        className="step-btn"
                        aria-label={`Decrease ${field.label}`}
                        onClick={() => onStepField(group.key, field.key, -field.step)}
                      >
                        −
                      </button>
                      <input
                        id={`${group.key}-${field.key}`}
                        inputMode="decimal"
                        value={editVars[group.key][field.key]}
                        onChange={(event) =>
                          onInputChange(group.key, field.key, event.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="step-btn"
                        aria-label={`Increase ${field.label}`}
                        onClick={() => onStepField(group.key, field.key, field.step)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="form-actions sticky-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Reset changes
          </button>
          <button type="submit" className="btn btn-primary">
            Save variables
          </button>
        </div>
      </form>
    </>
  );
}
