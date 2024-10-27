import styled, { css } from "styled-components";
import { Grid } from "@material-ui/core";
import theme from "~/styles/theme";

export const TableCell = styled.td`
  color: ${theme.palette.common.black};
  font-size: 12px;
  text-align: center;
  vertical-align: middle;
  padding: 16px 0;
  border-bottom: 1px solid ${theme.palette.common.lightGrey};
  ${(props) =>
    props.restrict &&
    css`
      max-width: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
`;

export const GridButton = styled(Grid)`
  text-align: center;
`;
