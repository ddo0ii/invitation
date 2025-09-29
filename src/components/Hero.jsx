import { Box, Typography } from "@mui/material";
import appConfig from "../app.config";
import "./Hero.css";

function Hero() {
  return (
    <Box className="hero-main">
      <Typography
        className="wedding-caps"
        variant="cormorant-sc-medium"
        sx={{ fontSize: { xs: "10px", sm: "12px" } }}
      >
        WEDDING INVITATION
      </Typography>
      <Box className="wedding-caps-name-box">
        <Typography className="wedding-caps-name" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
          {appConfig.couple.groom.name}
        </Typography>
        <Typography className="wedding-caps-name" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
          |
        </Typography>
        <Typography className="wedding-caps-name" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
          {appConfig.couple.bride.name}
        </Typography>
      </Box>
      <Box className="section hero">
        {/* Top title overlay - match reference */}
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 3, pt: { xs: 4, md: 6 }, textAlign: "center", color: "#1a1a1a" }}></Box>
        <Box component="video" autoPlay muted loop playsInline src="./video/intro.mp4" aria-label="intro background video" className="hero__video" />

        <Box className="hero__wash" />
        {/* top and bottom fade like reference */}
        <Box className="hero__fade-top" />
        <Box className="hero__fade-bottom" />
      </Box>
      <Box
        sx={{
          marginTop: "100px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography
          className="script-names"
          variant="windsong"
          sx={{ fontSize: { xs: 22, sm: 26 } }}
        >
          {appConfig.site.mainCharacterEn}
        </Typography>
        <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color="text.secondary">
          {new Date(appConfig.site.dateTime).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "long",
            hour: "numeric",
            minute: "2-digit",
          })}
        </Typography>
        <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color="text.secondary">
          {appConfig.site.venue}
        </Typography>
      </Box>
    </Box>
  );
}

export default Hero;
