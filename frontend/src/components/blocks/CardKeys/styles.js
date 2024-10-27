import styled, { css } from "styled-components";
import theme from "~/styles/theme";

export const IconHolder = styled.div`
  vertical-align: middle;
  height: 20px;
  width: 20px;
  cursor: pointer;
  margin: 0 auto;
  svg {
    height: 100%;
    width: 100%;
    path {
      color: ${theme.palette.common.blue};
    }
  }
`;

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
