import styled from "styled-components";
import { Grid } from "@material-ui/core";
import theme from "~/styles/theme";

export const Card = styled.div`
  border: 1px solid ${theme.palette.common.grey};
  border-radius: 10px;
  padding: 16px 24px;
  background: ${theme.palette.common.white};
`;

export const CardDivider = styled(Grid)`
  width: fit-content;
  vertical-align: middle;
`;

export const CardTitle = styled.p`
  color: ${theme.palette.common.grey};
  font-size: 13px;
  text-transform: uppercase;
`;

export const CardValue = styled.p`
  font-weight: bold;
  font-size: 20px;
  color: ${theme.palette.primary.dark};
`;

export const IconHolder = styled.div`
  padding: 12px;
  border-radius: 50%;
  text-align: center;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.color === "primary"
      ? theme.palette.common.blue
      : theme.palette.common.green};
  svg {
    height: 20px;
    width: auto;
    path {
      color: ${theme.palette.common.white};
    }
  }
`;
