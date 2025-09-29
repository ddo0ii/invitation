import { Box, Stack, Typography } from "@mui/material";
import appConfig from "../app.config.js";

function Intro() {
  const { groom, bride } = appConfig.couple;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography
        className="section-title"
        sx={{ fontSize: { xs: "10px", sm: "12px" }, mb: 5 }}
      >
        INVITATION
      </Typography>
      <Typography>서로 다른 두 사람이 만나</Typography>
      <Typography>이제는 하나 되어 믿음의 가정을 이루려 합니다.</Typography>
      <Typography>사랑과 믿음으로 영원을 약속하는 자리에 오셔서</Typography>
      <Typography>따뜻한 축복으로 함께해 주세요.</Typography>
      <Stack spacing={2} textAlign="center" marginTop={8}>
        <Typography sx={{ fontSize: { xs: 14, sm: 16 }, letterSpacing: 1 }}>
          {groom.father} · {groom.mother} 의 {groom.character} {groom.firstName}
        </Typography>
        <Typography sx={{ fontSize: { xs: 14, sm: 16 }, letterSpacing: 1 }}>
          {bride.father} · {bride.mother} 의 {bride.character} {bride.firstName}
        </Typography>
      </Stack>
    </Box>
  );
}

export default Intro;
