import { useEffect, useMemo, useState } from 'react'
// import Grid from '@mui/material/Grid2'
import { Stack, Typography,Grid } from '@mui/material'
import dayjs from 'dayjs'
import appConfig from '../app.config'

function calcDiff() {
  const now = dayjs()
  const target = dayjs(appConfig.site.dateTime)
  const diffMs = target.diff(now)
  // const duration = dayjs.duration ? dayjs.duration(diffMs) : null
  // 수동 계산 (dayjs/plugin/duration 미사용 시)
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))
  const days = Math.floor(totalSeconds / (24 * 3600))
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

function Countdown() {
  const [tick, setTick] = useState(0)
  const diff = useMemo(calcDiff, [tick])

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <Stack spacing={3} alignItems="center">
      <Grid container spacing={2} justifyContent="center">
        {[{ label: 'Days', value: diff.days }, { label: 'Hours', value: diff.hours }, { label: 'Minutes', value: diff.minutes }, { label: 'Seconds', value: diff.seconds }].map((item) => (
          <Grid key={item.label} xs={6} sm={3}>
            <Stack textAlign="center">
              <Typography variant="h4" fontWeight={800}>
                {String(item.value).padStart(2, '0')}
              </Typography>
              <Typography color="text.secondary">{item.label}</Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
      <Typography>
        지환 _♥_ 하은 님의 결혼식이 {diff.days}일 남았습니다.
      </Typography>
    </Stack>
  )
}

export default Countdown


