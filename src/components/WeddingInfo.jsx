import { Box, Typography } from "@mui/material";
import appConfig from "../app.config";
import "./WeddingInfo.css";

function WeddingInfo() {
  const date = new Date(appConfig.site.dateTime);
  const dateLabel = date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Box className="winfo">
      <Box className="winfo__card">
        <Typography fontWeight={700} sx={{ fontSize: { xs: 14, sm: 16 } }}>
          WEDDING DATE
        </Typography>
        <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>{dateLabel}</Typography>
      </Box>
      <Box className="winfo__card">
        <Typography fontWeight={700} sx={{ fontSize: { xs: 14, sm: 16 } }}>
          LOCATION
        </Typography>
        <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>{appConfig.site.address}</Typography>
        <Typography color="text.secondary" sx={{ fontSize: { xs: 12, sm: 14 } }}>{appConfig.site.venue}</Typography>
      </Box>
    </Box>
  );
}

export default WeddingInfo;
