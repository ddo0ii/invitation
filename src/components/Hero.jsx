import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import appConfig from "../app.config";
import "./Hero.css";

function Hero() {
  const videoRef = useRef(null);
  useEffect(() => {
    // 비디오를 가장 먼저 받도록 preload hint 추가
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = "./video/intro.mp4";
    link.type = "video/mp4";
    document.head.appendChild(link);
    // 페이지 진입 즉시 재생 시도 (정책상 muted/inline 필요 - 이미 설정됨)
    const tryPlay = () => {
      const el = videoRef.current;
      if (!el) return;
      const p = el.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {/* ignore autoplay policy rejections */});
      }
    };
    // 약간 지연 후 한 번 더 시도 (소스 연결 직후)
    setTimeout(tryPlay, 0);
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  return (
    <Box className="hero-main">
      <Box className="section hero">
        {/* Top title overlay - shown above video on all devices */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            pt: { xs: 3, md: 6 },
            pb: { xs: 1, md: 3 },
            textAlign: "center",
            color: "#1a1a1a",
          }}
        >
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
        </Box>
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          ref={videoRef}
          onCanPlay={() => {
            const el = videoRef.current;
            if (el && el.paused) {
              const p = el.play();
              if (p && typeof p.catch === 'function') {
                p.catch(() => {/* ignore */});
              }
            }
          }}
          src="./video/intro.mp4"
          aria-label="intro background video"
          className="hero__video"
        />

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
