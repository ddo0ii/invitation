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
        <Typography variant="h6" fontWeight={700}>
          WEDDING DATE
        </Typography>
        <Typography>{dateLabel}</Typography>
      </Box>
      <Box className="winfo__card">
        <Typography variant="h6" fontWeight={700}>
          LOCATION
        </Typography>
        <Typography>{appConfig.site.address}</Typography>
        <Typography color="text.secondary">{appConfig.site.venue}</Typography>
      </Box>
    </Box>
  );
}

export default WeddingInfo;
