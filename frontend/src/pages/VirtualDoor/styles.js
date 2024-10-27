import styled from "styled-components";
import theme from "~/styles/theme";
import { Button, Grid } from "@material-ui/core";
import { Margin } from "~/components/elements";

export const container = styled.div`
  margin: 0 auto;
  padding: 32px;
  width: 100%;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    padding: 0;
    max-width: 1200px;
  }
`;
export const heightGrid = styled(Grid)`
  text-align: center;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    height: 100vh;
  }
`;
export const widthForm = styled.form`
  width: 195px;
`;
export const widthButton = styled(Button)`
  width: 100%;
  margin: 0 auto;
`;

export const widthMargin = styled(Margin)`
  width: 100%;
`;
