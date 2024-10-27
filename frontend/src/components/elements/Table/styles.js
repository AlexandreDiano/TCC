import styled from "styled-components";
import theme from "~/styles/theme";

export const Tab = styled.table`
  margin: 0 auto;
  width: 100%;
`;
export const TabHead = styled.thead`
    border-top: 1px solid ${theme.palette.common.lightGrey}
    border-bottom: 1px solid ${theme.palette.common.lightGrey}
    color: ${theme.palette.common.blue};
`;

export const HeadCell = styled.th`
  padding: 15px 10px;
  text-transform: uppercase;
  font-size: 14px;
  vertical-align: middle;
`;
