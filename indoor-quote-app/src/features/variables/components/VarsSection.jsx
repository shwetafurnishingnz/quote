import { VAR_GROUPS } from "../utils/variables";

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
    <div className="sheet">
      <h1 className="sheet-title">Pricing variables</h1>
      <p className="sheet-subtitle">
        These drive every quote. Changes save locally immediately and sync
        to every signed-in device when the cloud connection is available.
      </p>

      <div className={`sync-badge ${syncStatus}`}>
        <span className="sync-dot" />
        {syncStatusMessage}
      </div>

      <form onSubmit={onSave}>
        {VAR_GROUPS.map((group) => (
          <div className="var-group" key={group.key}>
            <p className="var-group-title">{group.label}</p>
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
                      onClick={() => onStepField(group.key, field.key, field.step)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save variables
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
