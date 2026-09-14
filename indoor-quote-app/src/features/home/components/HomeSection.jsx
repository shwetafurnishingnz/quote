export default function HomeSection({ onNavigate }) {
  return (
    <div className="sheet">
      <h1 className="sheet-title">Indoor blinds, quoted fast</h1>
      <p className="sheet-subtitle">
        Enter a blind's dimensions, style, fabric and mount to get an
        instant price. Pricing variables are shared across every device
        that's signed in.
      </p>

      <div className="home-grid">
        <button
          type="button"
          className="home-card"
          onClick={() => onNavigate("/quote")}
        >
          <div className="home-card-title">Start a quote</div>
          <p className="home-card-desc">
            Enter width, height, style, fabric, mount and quantity.
          </p>
        </button>

        <button
          type="button"
          className="home-card"
          onClick={() => onNavigate("/variables")}
        >
          <div className="home-card-title">Edit pricing variables</div>
          <p className="home-card-desc">
            Adjust base rates, fabric and style multipliers, and mount
            adjustments.
          </p>
        </button>
      </div>
    </div>
  );
}
