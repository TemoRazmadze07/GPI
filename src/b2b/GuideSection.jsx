import { useState } from 'react'
import DemoBar from '../components/DemoBar.jsx'
import GuideScreen from './GuideScreen.jsx'
import GuideScreenB from './GuideScreenB.jsx'
import { guideVersion, setGuideVersion } from './data/guideItems.js'

/* GuideSection — mounts #/b2b/guide as version A (the live concept, untouched)
   or version B (the 2026-08-17 feed concept) behind a DemoBar switch: the
   established demo affordance (dark pill, English, hidden on ?study), so the
   A/B toggle can never be mistaken for product UI. Session-scoped; A is the
   default because A is what production shows today. Version B's item routes
   (#/b2b/guide/<id>) and the external page (#/guide/<id>) exist regardless of
   the switch — they are deep links, not nav destinations. */

export default function GuideSection() {
  const [version, setVersion] = useState(guideVersion)
  const pick = (v) => {
    setGuideVersion(v)
    setVersion(v)
  }

  return (
    <>
      {version === 'B' ? <GuideScreenB /> : <GuideScreen />}
      <DemoBar
        actions={[
          { label: 'guide A', ghost: version !== 'A', onClick: () => pick('A') },
          { label: 'guide B', ghost: version !== 'B', onClick: () => pick('B') },
        ]}
      />
    </>
  )
}
