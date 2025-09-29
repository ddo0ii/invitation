import { Stack, Typography } from "@mui/material";
import weddingIcon from "../../public/icon/wedding.svg";
import appConfig from "../app.config";

function Verse() {
  return (
    <Stack
      spacing={1}
      textAlign="center"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <img
        src={weddingIcon}
        style={{ width: "40px", marginBottom: "70px" }}
        alt="weddingIcon"
      />
      {appConfig.verse.lines.map((line) => (
        <Typography
          key={line}
          fontWeight={700}
          sx={{ fontSize: { xs: 14, sm: 16 } }}
        >
          {line}
        </Typography>
      ))}
      <br />
      <Typography color="text.secondary" sx={{ fontSize: { xs: 12, sm: 14 } }}>
        - {appConfig.verse.ref} -
      </Typography>
    </Stack>
  );
}

export default Verse;
