import { Box, Container, Stack, Typography } from '@mui/material'
import appConfig from '../app.config'

function Hero() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #f7faf7 0%, #ffffff 100%)',
        py: { xs: 8, md: 12 },
      }}
    >
      <Container>
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


