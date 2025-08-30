import { Stack, Typography,Grid } from '@mui/material'
import appConfig from '../app.config'

function WeddingInfo() {
  const date = new Date(appConfig.site.dateTime)
  const dateLabel = date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid xs={12} md={6}>
        <Stack spacing={1} textAlign="center">
          <Typography variant="h6" fontWeight={700}>
            WEDDING DATE
          </Typography>
          <Typography>{dateLabel}</Typography>
        </Stack>
      </Grid>
      <Grid xs={12} md={6}>
        <Stack spacing={1} textAlign="center">
          <Typography variant="h6" fontWeight={700}>
            LOCATION
          </Typography>
          <Typography>{appConfig.site.address}</Typography>
          <Typography color="text.secondary">{appConfig.site.venue}</Typography>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default WeddingInfo


