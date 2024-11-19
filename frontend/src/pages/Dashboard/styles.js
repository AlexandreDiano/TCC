import styled from "styled-components";
import theme from "~/styles/theme";

export const TopBackground = styled.div`
  position: relative;
  min-height: 596px;
  background: ${theme.palette.background.green};
  @media (min-width: ${theme.breakpoints.values.md}px) {
    min-height: 410px;
  }
  @media (min-width: ${theme.breakpoints.values.lg}px) {
    min-height: 300px;
  }
`;
export const BottomBackground = styled.div`
  position: relative;
  min-height: calc(100vh - 596px);
  background: ${theme.palette.background.grey};
  @media (min-width: ${theme.breakpoints.values.md}px) {
    min-height: calc(100vh - 410px);
    min-height: 75vh;
  }
  @media (min-width: ${theme.breakpoints.values.lg}px) {
    min-height: calc(100vh - 300px);
  }
`;
