import styled from "styled-components";
import { Grid } from "@material-ui/core";
import theme from "~/styles/theme";

export const MenuHolder = styled(Grid)`
  position: fixed;
  height: 76px;
  z-index: 1;
  background: ${theme.palette.common.white};
  padding: 1rem;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    display: inline-block;
    width: 200px;
    height: 100vh;
  }
`;

export const IconHolder = styled(Grid)`
  height: 40px;
  width: ${(props) => (props.width === "auto" ? "auto" : "40px")};
  cursor: pointer;
  img {
    height: 100%;
    width: 100%;
  }
  @media (min-width: ${theme.breakpoints.values.md}px) {
    margin: 0 auto 50px;
    text-align: center;
    img {
      width: auto;
    }
  }
`;

export const ModalPerson = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: ${(props) => (props.open ? "2" : "-1")};
  opacity: ${(props) => (props.open ? "1" : "0")};
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;
export const ModalHolder = styled.div`
  width: 192px;
  height: ${(props) => (props.open ? "auto" : "0")};
  border-radius: 5px;
  top: 60px;
  right: 10px;
  overflow: hidden;
  position: absolute;
  background: ${theme.palette.common.white};
  transition: height 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;
export const ModalPersonCell = styled.div`
  cursor: ${(props) => (props.action === "true" ? "pointer" : "default")};
  padding: 20px 16px;
`;
export const ModalPersonCellDivider = styled.div`
  border-bottom: 1px solid ${theme.palette.common.lighter};
`;
export const MenuPersonTitle = styled.p`
  text-transform: uppercase;
  font-size: 10px;
  color: ${theme.palette.primary.dark};
  font-weight: bold;
  vertical-align: middle;
`;

export const MenuPersonText = styled.p`
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  cursor: pointer;
  color: ${theme.palette.common.black};
`;
export const MenuIconHolder = styled.div`
  display: inline-block;
  vertical-align: middle;
  height: 20px;
  width: 20px;
  margin-right: 16px;
  cursor: pointer;
  svg {
    height: 100%;
    width: 100%;
    path {
      color: ${theme.palette.primary.main};
    }
  }
`;
