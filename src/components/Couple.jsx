import { Stack, Typography, Grid } from '@mui/material'
import appConfig from '../app.config'

function Couple() {
  const { groom, bride } = appConfig.couple
  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid xs={12} md={6}>
        <Stack spacing={0.5} textAlign="center">
          <Typography variant="overline">신랑측</Typography>
          <Typography variant="h6" fontWeight={700}>
            신랑 {groom.name}
          </Typography>
          <Typography color="text.secondary">아버지 {groom.father}</Typography>
          <Typography color="text.secondary">어머니 {groom.mother}</Typography>
        </Stack>
      </Grid>
      <Grid xs={12} md={6}>
        <Stack spacing={0.5} textAlign="center">
          <Typography variant="overline">신부측</Typography>
          <Typography variant="h6" fontWeight={700}>
            신부 {bride.name}
          </Typography>
          <Typography color="text.secondary">아버지 {bride.father}</Typography>
          <Typography color="text.secondary">어머니 {bride.mother}</Typography>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default Couple


