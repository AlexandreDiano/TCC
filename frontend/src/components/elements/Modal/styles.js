import styled from "styled-components";
import { MdClose } from "react-icons/md";
import { Dialog } from "@material-ui/core";
import theme from "~/styles/theme";

export const Paper = styled.div`
  padding: 50px 60px;
  background: ${theme.palette.common.white};
  padding-top: 70px;
`;
export const Close = styled(MdClose)`
  cursor: pointer;
  color: ${theme.palette.primary.main};
  font-size: 26px;
  position: absolute;
  top: 25px;
  right: 25px;
`;
export const DialogStyle = styled(Dialog)`
  .MuiDialog-paper {
    @media (max-width: ${theme.breakpoints.values.md}px) {
      width: calc(100% - 5px);
      max-width: initial;
      margin: 0;
    }
  }
`;
