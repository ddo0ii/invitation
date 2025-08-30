import { Box, Container, Stack, Typography } from '@mui/material'
import appConfig from '../app.config'

function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        minHeight: { xs: '60vh', md: '70vh' },
        overflow: 'hidden',
      }}
    >
      <Box
        component="video"
        autoPlay
        muted
        loop
        playsInline
        src="/video/intro.mp4"
        aria-label="intro background video"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'brightness(0.8)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.55) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Stack alignItems="center" spacing={2} textAlign="center">
          <Typography variant="overline" color="text.secondary">
            2025 | 06 | 21
          </Typography>
          <Typography variant="h2" fontWeight={800}>
            OUR
          </Typography>
          <Typography variant="h2" fontWeight={800}>
            WEDDING
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {new Date(appConfig.site.dateTime).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              weekday: 'long',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {appConfig.site.venue}
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default Hero


