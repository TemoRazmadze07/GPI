/* Payment brand marks. Brand-locked assets — a sanctioned exception to the
   token rule, same as the Figma Wallet Pay Button set (162:78): wallet buttons
   are solid #000 with the official marks per Apple/Google guidelines.
   - Google mark = the official gstatic dark_gpay.svg (white wordmark).
   - Apple mark = apple glyph + "Pay" text stand-in. Production renders the real
     <apple-pay-button>; in Figma the official  Pay lockup is already in the
     component. Swap when the official vector is exported to code.
   - Visa / Mastercard row marks are simplified stand-ins in official colours. */
import darkGpay from '../assets/dark_gpay.svg'

export function AppleMark() {
  return (
    <span className="pay-wallet__mark" aria-hidden="true">
      <svg viewBox="0 0 384 512" width="14" height="18" fill="currentColor">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.9-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      <span className="pay-wallet__word">Pay</span>
    </span>
  )
}

export function GPayMark() {
  return <img className="pay-wallet__img" src={darkGpay} alt="" aria-hidden="true" />
}

export function VisaMark() {
  return (
    <span className="pay-brandmark pay-brandmark--visa" aria-hidden="true">
      VISA
    </span>
  )
}

export function McMark() {
  return (
    <svg className="pay-brandmark" viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
      <circle cx="9" cy="8" r="7" fill="#EB001B" />
      <circle cx="15" cy="8" r="7" fill="#F79E1B" />
      <path d="M12 2.4a7 7 0 0 1 0 11.2 7 7 0 0 1 0-11.2z" fill="#FF5F00" />
    </svg>
  )
}
