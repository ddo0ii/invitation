import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Gowun Dodum, sans-serif",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#1b5e20",
    },
    secondary: {
      main: "#8d6e63",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#4d4d4d",
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "md",
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: "cormorant-sc-light" },
          style: { fontFamily: "Cormorant SC, serif", fontWeight: 300 },
        },
        {
          props: { variant: "cormorant-sc-regular" },
          style: { fontFamily: "Cormorant SC, serif", fontWeight: 400 },
        },
        {
          props: { variant: "cormorant-sc-medium" },
          style: { fontFamily: "Cormorant SC, serif", fontWeight: 500 },
        },
        {
          props: { variant: "cormorant-sc-semibold" },
          style: { fontFamily: "Cormorant SC, serif", fontWeight: 600 },
        },
        {
          props: { variant: "cormorant-sc-bold" },
          style: { fontFamily: "Cormorant SC, serif", fontWeight: 700 },
        },

        {
          props: { variant: "windsong" },
          style: { fontFamily: "WindSong, cursive" },
        },
        {
          props: { variant: "pretendard" },
          style: {
            fontFamily:
              "Pretendard, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Noto Sans KR, Helvetica, Arial, sans-serif",
          },
        },
        {
          props: { variant: "gowun-batang" },
          style: { fontFamily: "Gowun Batang, serif" },
        },
        {
          props: { variant: "gowun-dodum" },
          style: { fontFamily: "Gowun Dodum, sans-serif" },
        },
        {
          props: { variant: "stylish" },
          style: { fontFamily: "Stylish, cursive" },
        },
      ],
    },
  },
});

export default theme;
