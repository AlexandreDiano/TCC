import styled from "styled-components";
import theme from "~/styles/theme";

export const NavMenuCell = styled.div`
  padding: 20px 16px;
  cursor: pointer;
`;
export const NavMenuDivider = styled.div`
  border-bottom: 1px solid ${theme.palette.common.lighter};
`;
export const NavMenuText = styled.p`
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  cursor: pointer;
  color: ${theme.palette.common.black};
`;
export const MenuIconHolder = styled.div`
  display: inline-block;
  vertical-align: middle;
  height: 16px;
  width: 16px;
  margin-right: 16px;
  cursor: pointer;
  svg {
    height: 100%;
    width: 100%;
    path {
      color: ${theme.palette.common.blue};
    }
  }
`;
