import styled from "styled-components";
import Select from "react-select";
import theme from "~/styles/theme";

export const BoxInput = styled.div`
  font-size: 14px;
  font-weight: normal;
  label {
    margin-bottom: 10px;
    display: block;
  }
  > div {
    margin-top: 2px;
  }
`;

export const SelectInput = styled(Select)`
  svg {
    color: ${theme.palette.common.blue};
  }
`;
