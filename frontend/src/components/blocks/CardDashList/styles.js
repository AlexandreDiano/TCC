import styled from "styled-components";
import { Grid } from "@material-ui/core";
import { Button } from "~/components/elements";
import theme from "~/styles/theme";

export const Card = styled.div`
  border: 1px solid ${theme.palette.common.grey};
  border-radius: 10px;
  padding-bottom: 10px;
  background: ${theme.palette.common.white};
`;

export const CardHeader = styled(Grid)`
  position: relative;
  padding: 20px;
  border-radius: 10px 10px 0 0;
  background: ${theme.palette.common.white};
`;

export const CardTitle = styled.h3`
  font-weight: bold;
  font-size: 17px;
  line-height: 32px;
  span {
    font-size: 14px;
    color: ${theme.palette.primary.light};
    display: block;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      display: inline;
    }
  }
`;
export const CardButton = styled(Button)`
  position: absolute;
  right: 20px;
  background: ${theme.palette.background.blue};
  color: ${theme.palette.common.white};
`;

export const TableCell = styled.td`
  color: ${theme.palette.common.black};
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
  padding: 16px 0;
  border-bottom: 1px solid ${theme.palette.common.lightGrey};
`;
