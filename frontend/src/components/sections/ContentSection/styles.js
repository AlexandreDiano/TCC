import styled from "styled-components";
import { Grid } from "@material-ui/core";
import theme from "~/styles/theme";

export const MenuSpacer = styled.div`
  vertical-align: top;
  height: 84px;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    display: inline-block;
    width: 200px;
  }
`;
export const Content = styled.div`
  vertical-align: top;
  width: 100vw;
  min-height: calc(100vh - 76px);
  @media (min-width: ${theme.breakpoints.values.md}px) {
    min-height: 100vh;
    display: inline-block;
    width: calc(100vw - 200px);
  }
`;

export const GridNoWrap = styled(Grid)`
  flex-wrap: nowrap;
`;
