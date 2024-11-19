import styled from "styled-components";
import theme from "~/styles/theme";

export const Box = styled.div``;
export const Obs = styled.p`
  cursor: pointer;
  text-align: center;
  color: ${theme.palette.primary.light};
  font-size: 13px;
  margin-top: 10px;
`;
export const ObsHolder = styled.div`
  padding-bottom: 36px;
  border-bottom: 1px solid ${theme.palette.common.lightGrey};
`;

export const HiddenInput = styled.input`
  display: none;
`;
