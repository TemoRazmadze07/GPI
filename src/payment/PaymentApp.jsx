import PayShell from './PayShell.jsx'
import LoginScreen from './LoginScreen.jsx'
import OtpScreen from './OtpScreen.jsx'
import PolicySelectScreen from './PolicySelectScreen.jsx'
import PaymentScreen from './PaymentScreen.jsx'
import BankStubScreen from './BankStubScreen.jsx'
import SuccessScreen from './SuccessScreen.jsx'
import DemoBar from '../components/DemoBar.jsx'
import { SEED_CARDS, setCards } from './data.js'

/* PaymentApp — devpayment.gpih.ge redesign (Rule 5 surface, prefix `pay-`).

   The full flow, in order:
     #/pay/login     identify — personal number + birth date
     #/pay/otp       SMS one-time code
     #/pay/policies  choose which policy to pay
     #/pay           pay (saved cards / new card / wallets)
     #/pay/bank      Liberty Bank stand-in (their page, not ours)
     #/pay/done      receipt

   #/pay stays the payment screen so links already shared with the team keep
   working; #/pay/login is the flow's real entry point.

   ONE DemoBar for the whole module, mounted here — it is `position: fixed`, so
   a second instance inside a screen would sit exactly on top of this one. The
   card-state chips write sessionStorage and reload, which is also the honest
   way to demo a "returning" visitor. */
const SCREENS = {
  login: LoginScreen,
  otp: OtpScreen,
  policies: PolicySelectScreen,
  bank: BankStubScreen,
  done: SuccessScreen,
}

const STEPS = [
  ['login', '#/pay/login'],
  ['otp', '#/pay/otp'],
  ['policies', '#/pay/policies'],
  ['pay', '#/pay'],
  ['done', '#/pay/done?m=visa-4318'],
]

export default function PaymentApp({ section }) {
  const Screen = SCREENS[section] || PaymentScreen

  const setDemoCards = (cards) => () => {
    setCards(cards)
    window.location.hash = '#/pay'
    window.location.reload()
  }

  return (
    <PayShell>
      <Screen />
      <DemoBar
        wrap
        collapsible
        actions={[
          ...STEPS.map(([label, hash]) => ({
            label,
            ghost: true,
            onClick: () => {
              window.location.hash = hash
            },
          })),
          { label: 'returning', onClick: setDemoCards(SEED_CARDS) },
          { label: 'new', onClick: setDemoCards([]) },
        ]}
      />
    </PayShell>
  )
}
