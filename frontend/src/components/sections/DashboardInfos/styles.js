import styled from "styled-components";
import theme from "~/styles/theme";

export const ContentHolder = styled.div`
  padding: 0 16px;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    padding: 0 39px;
  }
`;
