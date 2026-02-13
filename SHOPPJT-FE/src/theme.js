// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";

const COLORS = {
  main: "#fca4b2",
  bg: "#f4eff1",
  black: "#333333",
  white: "#ffffff",
  basic: "#767676",
  gray1: "#dddddd",
};

const KOR_FONT = `"Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Segoe UI", Roboto, Arial, sans-serif`;

// 기본 테마
const baseTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 680,
      md: 980,
      lg: 1300,
      xl: 1920,
    },
  },

  palette: {
    mode: "light",
    primary: { main: COLORS.main },
    background: {
      default: COLORS.bg,
      paper: COLORS.white,
    },
    text: {
      primary: COLORS.black,
      secondary: COLORS.basic,
    },
    divider: COLORS.gray1,
  },

  typography: {
    fontFamily: KOR_FONT,

    h1: {
      fontWeight: 600,
      fontSize: "3rem",
      color: COLORS.black,
    },
    h2: {
      fontSize: "1.2rem",
      color: COLORS.black,
    },
    body1: {
      fontSize: "1rem",
    },
    subtitle1: {
      fontSize: "1.111rem",
      marginTop: "16px",
      color: COLORS.basic,
    },
  },
});

const theme = createTheme(baseTheme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": { boxSizing: "border-box" },
        "*": { fontFamily: KOR_FONT, wordBreak: "keep-all" },

        html: { width: "100%", fontSize: "18px" },
        body: {
          width: "100%",
          minWidth: "320px",
          margin: 0,
          color: COLORS.black,
          fontWeight: 400,
          fontSize: "1rem",
          lineHeight: "150%",
          letterSpacing: "-0.64px",
          fontFamily: KOR_FONT,
          wordBreak: "keep-all",
          WebkitTextSizeAdjust: "none",
        },

        // reset
        "ul, ol, li": { listStyle: "none", margin: 0, padding: 0 },
        a: {
          cursor: "pointer",
          textDecoration: "none",
          color: "inherit",
          transition: "all 0.7s cubic-bezier(0.215, 0.61, 0.355, 1)",
        },
        table: { borderCollapse: "separate", borderSpacing: 0, fontSize: "0.9375rem" },
        "table caption": { overflow: "hidden", fontSize: 0, lineHeight: 0 },
        address: { fontStyle: "normal" },
        hr: { display: "none" },

        // focus outline 제거
        "input:focus, textarea:focus, button:focus": { outline: "none" },

        // placeholder
        "input::placeholder, textarea::placeholder": { color: "#999" },

        "select::-ms-expand": { display: "none" },
        'input[type="text"]::-ms-clear': { display: "none" },

        // ===== breakpoint 기반 반응형 =====

        // md 이하 (≤980)
        [baseTheme.breakpoints.down("md")]: {
          html: { fontSize: "16px", letterSpacing: "-0.54px" },
        },

        // sm 이하 (≤680)
        [baseTheme.breakpoints.down("sm")]: {
          html: { fontSize: "14px" },
          body: { lineHeight: "120%" },

          // input/textarea에서만 자동 확대 방지
          "input, textarea": {
            textSizeAdjust: "none",
            WebkitTextSizeAdjust: "none",
          },
        },
      },
    },

    // 버튼 기본 톤
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600,
        },
        containedPrimary: {
          color: COLORS.white,
        },
      },
    },

    // 인풋 기본 톤
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: COLORS.white,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: COLORS.basic },
      },
    },
  },
});

export default theme;
