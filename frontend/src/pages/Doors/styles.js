import styled from "styled-components";
import theme from "~/styles/theme";
import { Grid } from "@material-ui/core";

export const Background = styled.div`
  min-height: calc(100vh - 76px);
  background: ${theme.palette.background.grey};
  @media (min-width: ${theme.breakpoints.values.md}px) {
    min-height: 100vh;
  }
`;

export const PadGrid = styled(Grid)`
  padding: 0 16px;
  max-width: 100%;
  margin: 0;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    padding: 0 39px;
  }
`;
