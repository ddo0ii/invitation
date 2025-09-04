import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: 'Pretendard, Noto Sans KR, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, sans-serif',
    // 커스텀 타이포: 어디서든 theme.typography.weddingCaps 사용 가능
    weddingCaps: {
      fontFamily: 'Cormorant SC, serif',
      letterSpacing: '0.4em',
      textTransform: 'none',
    },
    weddingNames: {
      fontFamily: 'Cormorant SC, serif',
      letterSpacing: '0.08em',
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1b5e20',
    },
    secondary: {
      main: '#8d6e63',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#4d4d4d',
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: 'md',
      },
    },
  },
})

export default theme


