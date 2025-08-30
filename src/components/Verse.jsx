import { Stack, Typography } from '@mui/material'
import appConfig from '../app.config'

function Verse() {
  return (
    <Stack spacing={1} textAlign="center">
      {appConfig.verse.lines.map((line) => (
        <Typography key={line} fontWeight={700}>
          {line}
        </Typography>
      ))}
      <Typography color="text.secondary">- {appConfig.verse.ref} -</Typography>
    </Stack>
  )
}

export default Verse


