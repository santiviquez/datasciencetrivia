import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: `Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
    heading: `"Dela Gothic One"`,
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 800,
  },
});

export default theme;
