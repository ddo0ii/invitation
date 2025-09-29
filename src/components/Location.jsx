import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  accordionSummaryClasses,
  Box,
  Button,
  ButtonGroup,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import appConfig from "../app.config";
import KakaoMap from "./KakaoMap";

function openLink(url) {
  window.open(url, "_blank", "noopener");
}

function Location() {
  const theme = useTheme();

  return (
    <Stack spacing={3}>
      <Stack spacing={1} textAlign="center">
        <Typography variant="h6" fontWeight={700}>
          오시는 길
        </Typography>
        <Typography>{appConfig.site.address}</Typography>
        <Typography color="text.secondary">{appConfig.site.venue}</Typography>
      </Stack>
      <KakaoMap
        address={appConfig.site.mapAddress}
        markerText={appConfig.site.venue}
      />
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button
          size="small"
          variant="outlined"
          onClick={() => openLink(appConfig.transport.mapLinks.naver)}
          sx={{ flex: 1 }}
        >
          네이버 지도
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => openLink(appConfig.transport.mapLinks.kakaoNavi)}
          sx={{ flex: 1 }}
        >
          카카오 내비
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => openLink(appConfig.transport.mapLinks.tmap)}
          sx={{ flex: 1 }}
        >
          티맵
        </Button>
      </Stack>
      <br />
      <Accordion
        disableGutters
        defaultExpanded
        elevation={0}
        sx={{
          borderTop: `1px solid #000`,
          borderBottom: `1px solid #000`,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            [`& .${accordionSummaryClasses.content}`]: {
              marginLeft: theme.spacing(1),
            },
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            오시는 길
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: theme.spacing(2),
            borderTop: "1px solid rgba(0, 0, 0, .125)",
          }}
        >
          <List dense>
            <Typography fontWeight={700}>지하철 이용 시</Typography>
            {appConfig.transport.subway.map((p) => (
              <ListItem key={p}>
                <ListItemText primary={p} />
              </ListItem>
            ))}
            <Divider sx={{ mt: 2, mb: 3 }} />
            <Typography fontWeight={700}>자가용 이용 시 주차안내</Typography>
            {appConfig.transport.parking.map((p) => (
              <ListItem key={p}>
                <ListItemText primary={p} />
              </ListItem>
            ))}
            <Divider sx={{ mt: 2, mb: 3 }} />
            <Typography fontWeight={700}>버스 이용 시</Typography>
            {appConfig.transport.bus.map((t) => (
              <ListItem key={t}>
                <ListItemText primary={t} />
              </ListItem>
            ))}
            <Divider sx={{ mt: 2, mb: 3 }} />
            <Typography fontWeight={700}>기타</Typography>
            {appConfig.transport.etc.map((t) => (
              <ListItem key={t}>
                <ListItemText primary={t} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}

export default Location;
