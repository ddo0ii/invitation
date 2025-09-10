import { Box, Typography } from "@mui/material";
import appConfig from "../app.config";

function Hero() {
  return (
    <Box className="hero-main">
      <Typography
        className="wedding-caps"
        // sx={{ fontSize: { xs: 13, md: 15 } }}
        sx={{ fontSize: "0.6em" }}
      >
        WEDDING INVITATION
      </Typography>
      <Box className="wedding-caps-name-box">
        <Typography
          className="wedding-caps-name"
          sx={{ fontSize: "1em" }}
          // sx={{ fontSize: { xs: 13, md: 15 } }}
        >
          강명준
        </Typography>
        <Typography
          className="wedding-caps-name"
          sx={{ fontSize: "1em" }}
          // sx={{ fontSize: { xs: 13, md: 15 } }}
        >
          |
        </Typography>
        <Typography
          className="wedding-caps-name"
          sx={{ fontSize: "1em" }}
          // sx={{ fontSize: { xs: 13, md: 15 } }}
        >
          권소영
        </Typography>
      </Box>
      <Box
        sx={{
          position: "relative",
          py: { xs: 8, md: 12 },
          minHeight: { xs: "100vh", md: "110vh" },
          overflow: "hidden",
        }}
      >
        {/* Top title overlay - match reference */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            pt: { xs: 4, md: 6 },
            textAlign: "center",
            color: "#1a1a1a",
          }}
        ></Box>
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          src="./video/intro.mp4"
          aria-label="intro background video"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            // objectFit: 'contain',
            // backgroundColor: '#000',
            zIndex: 0,
            pointerEvents: "none",
            filter: "brightness(0.9)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.32) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        {/* top and bottom fade like reference */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: { xs: 160, md: 200 },
            background:
              "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.0) 100%)",
            backdropFilter: "blur(2px)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: { xs: 180, md: 240 },
            background:
              "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.0) 100%)",
            backdropFilter: "blur(2px)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      </Box>
      <Typography
        className="script-names"
        sx={{ fontSize: { xs: 28, md: 34 } }}
      >
        Myungjun and Soyeong
      </Typography>
      <Typography
        sx={{ typography: { xs: "body2", sm: "subtitle1" } }}
        color="text.secondary"
      >
        {new Date(appConfig.site.dateTime).toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "long",
          hour: "numeric",
          minute: "2-digit",
        })}
      </Typography>
      <Typography
        sx={{ typography: { xs: "body2", sm: "subtitle1" } }}
        color="text.secondary"
      >
        {appConfig.site.venue}
      </Typography>
    </Box>
  );
}

export default Hero;
