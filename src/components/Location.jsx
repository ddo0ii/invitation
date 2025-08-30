import { Box, Button, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import appConfig from '../app.config'

function openLink(url) {
  window.open(url, '_blank', 'noopener')
}

function Location() {
  return (
    <Stack spacing={3}>
      <Stack spacing={1} textAlign="center">
        <Typography variant="h6" fontWeight={700}>
          오시는 길
        </Typography>
        <Typography>{appConfig.site.address}</Typography>
        <Typography color="text.secondary">{appConfig.site.venue}</Typography>
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="center">
        <Button size="small" variant="outlined" onClick={() => openLink(appConfig.transport.mapLinks.naver)}>
          네이버 지도
        </Button>
        <Button size="small" variant="outlined" onClick={() => openLink(appConfig.transport.mapLinks.kakaoNavi)}>
          카카오 내비
        </Button>
        <Button size="small" variant="outlined" onClick={() => openLink(appConfig.transport.mapLinks.tmap)}>
          티맵
        </Button>
      </Stack>

      <Box>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          오시는 길
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="지하철 이용 시" secondary={appConfig.transport.subway} />
          </ListItem>
        </List>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          자가용 이용 시 주차안내
        </Typography>
        <List dense>
          {appConfig.transport.parking.map((p) => (
            <ListItem key={p}>
              <ListItemText primary={p} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          기차 이용 시
        </Typography>
        <List dense>
          {appConfig.transport.train.map((t) => (
            <ListItem key={t}>
              <ListItemText primary={t} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Stack>
  )
}

export default Location


