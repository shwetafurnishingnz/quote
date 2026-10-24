import { ArrowRightIcon, CalculatorIcon, SlidersIcon } from "../../layout/components/Icons";

export default function HomeSection({ onNavigate }) {
  return (
    <>
      <div className="home-hero">
        <h1 className="sheet-title">Indoor blinds, quoted fast.</h1>
        <p className="sheet-subtitle">
          Enter each blind's dimensions, style, fabric and mount to get an
          instant price. Pricing variables are shared across every signed-in
          device.
        </p>
      </div>

      <div className="home-grid">
        <button
          type="button"
          className="home-card"
          onClick={() => onNavigate("/quote")}
        >
          <span className="home-card-icon">
            <CalculatorIcon />
          </span>
          <ArrowRightIcon className="home-card-arrow" />
          <div className="home-card-title">Start a quote</div>
          <p className="home-card-desc">
            Add blinds with length, sag and brackets, then get a full price
            breakdown.
          </p>
        </button>

        <button
          type="button"
          className="home-card"
          onClick={() => onNavigate("/variables")}
        >
          <span className="home-card-icon">
            <SlidersIcon />
          </span>
          <ArrowRightIcon className="home-card-arrow" />
          <div className="home-card-title">Pricing variables</div>
          <p className="home-card-desc">
            Adjust material costs, overhead, GST and margin used in every
            quote.
          </p>
        </button>
      </div>
    </>
  );
}
