import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Gowun Dodum, sans-serif",
    body1: {
      fontSize: 14,
      '@media (min-width:768px)': { fontSize: 16 },
    },
    body2: {
      fontSize: 14,
      '@media (min-width:768px)': { fontSize: 16 },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#9BC4AA", // pastel sage
      light: "#CFE3D6",
      dark: "#6EA186",
      contrastText: "#1a1a1a",
    },
    secondary: {
      main: "#F2CFD8", // pastel blush
      light: "#F8E6EC",
      dark: "#D9AABA",
      contrastText: "#1a1a1a",
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
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: "none",
          fontWeight: 600,
          paddingInline: 20,
          paddingBlock: 10,
        },
        containedPrimary: {
          backgroundColor: "#CFE3D6",
          color: "#1a1a1a",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          "&:hover": {
            backgroundColor: "#B9D5C3",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
        },
        containedSecondary: {
          backgroundColor: "#F8E6EC",
          color: "#1a1a1a",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          "&:hover": {
            backgroundColor: "#F3D8E1",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
        },
        outlinedPrimary: {
          color: "#3A6F43",
          borderColor: "#B9D5C3",
          backgroundColor: "rgba(155,196,170,0.08)",
          "&:hover": {
            borderColor: "#6EA186",
            backgroundColor: "rgba(155,196,170,0.14)",
          },
        },
        outlinedSecondary: {
          borderColor: "#F2CFD8",
          color: "#D9AABA",
          backgroundColor: "rgba(242,207,216,0.10)",
          "&:hover": {
            borderColor: "#D9AABA",
            backgroundColor: "rgba(242,207,216,0.16)",
          },
        },
        textPrimary: {
          color: "#6EA186",
          "&:hover": {
            backgroundColor: "rgba(155,196,170,0.10)",
          },
        },
        textSecondary: {
          color: "#D9AABA",
          "&:hover": {
            backgroundColor: "rgba(242,207,216,0.10)",
          },
        },
      },
    },
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
