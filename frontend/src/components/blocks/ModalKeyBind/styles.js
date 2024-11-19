import styled from "styled-components";
import theme from "~/styles/theme";

export const UsersTitle = styled.div`
  font-size: 15px;
  padding: 15px;
  text-transform: uppercase;
  color: ${theme.palette.common.grey};
  background: ${theme.palette.common.lighter};
`;

export const UsersSelectionList = styled.div`
  height: 25vh;
  border: 1px solid ${theme.palette.common.lighter};
  overflow: auto;
`;

export const UserSelectionCard = styled.div`
  position: relative;
  cursor: pointer;
  font-size: 12px;
  color: ${(props) =>
    props.selected
      ? theme.palette.primary.contrastText
      : theme.palette.common.black};
  padding: 15px;
  background: ${(props) =>
    props.selected ? theme.palette.common.blue : theme.palette.common.white};
  border: 1px solid
    ${(props) =>
      props.selected
        ? theme.palette.common.blue
        : theme.palette.common.lighter};
`;

export const IconHolder = styled.div`
  position: absolute;
  top: calc(50% - 15px);
  right: 15px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: ${theme.palette.common.green}
  cursor: pointer;
  margin: 0 auto;
  text-align: center;
  svg {
    height: 75%;
    width: 75%;
    margin-top: 4px;
    path {
      color: ${theme.palette.common.white};
    }
}
`;
