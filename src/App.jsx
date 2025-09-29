import { Stack } from "@mui/material";
import AudioToggle from "./components/AudioToggle";
import Countdown from "./components/Countdown";
import Gallery from "./components/Gallery";
import Guestbook from "./components/Guestbook";
import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Location from "./components/Location";
import RSVPDialog from "./components/RSVPDialog";
import Section from "./components/Section";
import Share from "./components/Share";
import ThanksTo from "./components/ThanksTo";
import Verse from "./components/Verse";

function App() {
  return (
    <Stack>
      <AudioToggle />
      <RSVPDialog />
      <Hero />

      <Section id="verse">
        <Verse />
      </Section>

      <Section id="intro" bg="#fafafa">
        <Intro />
      </Section>

      <Section id="countdown">
        <Countdown />
      </Section>

      <Section
        id="gallery"
        bg="#fafafa"
        title="GALLERY"
        subtitle="명준과 소영, 함께한 시간들"
      >
        <Gallery />
      </Section>

      <Section id="location" title="LOCATION">
        <Location />
      </Section>

      <Section
        id="thanks-to"
        bg="#fafafa"
        title="THANKS TO"
        subtitle="마음 전하는 곳"
      >
        <ThanksTo />
      </Section>

      {/*<Section id="guestbook" title="GUEST BOOK">*/}
      {/*  <Guestbook />*/}
      {/*</Section>*/}

      <Section
        id="share"
        // bg="#fafafa"
      >
        <Share />
      </Section>
    </Stack>
  );
}

export default App;
