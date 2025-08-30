import { Stack } from '@mui/material'
import Section from './components/Section'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Verse from './components/Verse'
import WeddingInfo from './components/WeddingInfo'
import Couple from './components/Couple'
import Countdown from './components/Countdown'
import Gallery from './components/Gallery'
import Location from './components/Location'
import ThanksTo from './components/ThanksTo'
import Guestbook from './components/Guestbook'
import Share from './components/Share'

function App() {
  return (
    <Stack>
      <Hero />

      <Section id="intro">
        <Intro />
      </Section>

      <Section id="verse" bg="#fafafa">
        <Verse />
      </Section>

      <Section id="wedding-info">
        <WeddingInfo />
      </Section>

      <Section id="couple" bg="#fafafa">
        <Couple />
      </Section>

      <Section id="countdown">
        <Countdown />
      </Section>

      <Section id="gallery" bg="#fafafa" title="GALLERY" subtitle="명준과 소영, 함께한 시간들">
        <Gallery />
      </Section>

      <Section id="location" title="LOCATION">
        <Location />
      </Section>

      <Section id="thanks-to" bg="#fafafa" title="THANKS TO" subtitle="마음 전하는 곳">
        <ThanksTo />
      </Section>

      <Section id="guestbook" title="GUEST BOOK">
        <Guestbook />
      </Section>

      <Section id="share" bg="#fafafa">
        <Share />
      </Section>
    </Stack>
  )
}

export default App
