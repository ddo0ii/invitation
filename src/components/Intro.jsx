import { Box, Typography } from "@mui/material";

function Intro() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography fontWeight={700} sx={{ marginBottom: "20px" }}>
        INVITATION
      </Typography>
      <Typography>서로 다른 두 사람이 만나</Typography>
      <Typography>이제는 하나 되어 믿음의 가정을 이루려 합니다.</Typography>
      <Typography>사랑과 믿음으로 영원을 약속하는 자리에 오셔서</Typography>
      <Typography>따뜻한 축복으로 함께해 주세요.</Typography>
    </Box>
  );
}

export default Intro;
