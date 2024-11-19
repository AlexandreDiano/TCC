import styled from "styled-components";
import theme from "~/styles/theme";

export const UserHolder = styled.div`
  padding: 16px;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    padding: 24px 39px;
  }
`;

export const PageTitle = styled.h1`
  text-transform: uppercase;
  color: ${theme.palette.primary.dark};
  font-weight: 600;
  font-size: 15px;
  vertical-align: middle;
  line-height: 22.5px;
`;

export const UserName = styled.h2`
  color: ${theme.palette.primary.darker};
  font-size: 20px;
  font-weight: 600;
  line-height: 22.5px;
  vertical-align: middle;
`;
