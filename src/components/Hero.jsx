import { Box, Container, Stack, Typography } from '@mui/material'
import appConfig from '../app.config'

function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        minHeight: { xs: '100vh', md: '110vh' },
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
          // objectFit: 'contain',
          // backgroundColor: '#000',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'brightness(0.9)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.45) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Stack alignItems="center" spacing={2} textAlign="center">
          <Typography sx={{ typography: { xs: 'caption', sm: 'overline' } }} color="text.secondary">
            2025 | 06 | 21
          </Typography>
          <Typography sx={{ typography: { xs: 'h3', md: 'h2' } }} fontWeight={800}>
            OUR
          </Typography>
          <Typography sx={{ typography: { xs: 'h3', md: 'h2' } }} fontWeight={800}>
            WEDDING
          </Typography>
          <Typography sx={{ typography: { xs: 'body2', sm: 'subtitle1' } }} color="text.secondary">
            {new Date(appConfig.site.dateTime).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              weekday: 'long',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Typography>
          <Typography sx={{ typography: { xs: 'body2', sm: 'subtitle1' } }} color="text.secondary">
            {appConfig.site.venue}
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default Hero


