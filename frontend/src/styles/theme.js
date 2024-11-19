import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Open Sans",
    fontDisplay: "swap",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1140,
      xl: 1920,
    },
  },
  palette: {
    common: {
      turquoise: "#1ff8d4",
      green: "#27e174",
      blue: "#1a174d",
      bgModal: "rgba(0,0,0,0.5)",
      black: "#212529",
      white: "#fff",
      disabled: "rgba(0,0,0,0.24)",
      disabledNegative: "rgba(255,255,255,0.24)",
      transparent: "transparent",
      alert: "#f5365c",
      success: "#2dce89",
      grey: "#8898aa",
      lightGrey: "#adb5bd",
      lighter: "#e9ecef",
      negative: {
        static: "#FFFFFF",
        hover: "#0062FF",
      },
    },
    primary: {
      light: "#5e72e4",
      main: "#525f7f",
      dark: "#323263",
      darker: "#172b4d",
      contrastText: "#fff",
    },
    secondary: {
      light: "#2BDBA6",
      main: "#2BDBA6",
      dark: "#006647",
      contrastText: "#fff",
    },
    tertiary: {
      main: "#488EFF",
    },
    background: {
      blue: "#1a174d",
      lilac: "#e4e3ff",
      darkBlue: "linear-gradient(87deg,#172b4d 0,#1a174d 100%)",
      green: "linear-gradient(135deg, #1ff8d4 0, #27e174 100%)",
      greenish: "#f7fafc",
      grey: "#f8f9fe",
    },
    error: {
      main: "#DE1616",
    },
  },
});

export default theme;
