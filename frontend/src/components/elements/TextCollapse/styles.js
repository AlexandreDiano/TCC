import styled, { css } from "styled-components";
import { MdKeyboardArrowDown } from "react-icons/md";
import { ExpansionPanel } from "@material-ui/core";
import theme from "~/styles/theme";

export const Panel = styled(ExpansionPanel)`
  box-shadow: none;

  &:before {
    display: none;
  }
  ${(props) =>
    props.simple &&
    css`
      border-bottom: 1px solid ${theme.palette.common.lightGrey};
    `}
  &:hover {
    ${(props) =>
      props.simple &&
      css`
        border-bottom: 1px solid ${theme.palette.primary.light};
        color: ${theme.palette.primary.light};
      `}
  }
`;

export const ArrowDown = styled(MdKeyboardArrowDown)`
  color: ${theme.palette.primary.light};
  font-size: ${(props) => (props.simple ? "30px" : "40px")};
`;
