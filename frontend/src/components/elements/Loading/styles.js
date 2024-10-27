import styled, { css } from "styled-components";
// import theme from '~/styles/theme';

export const Box = styled.div`
  ${(props) =>
    !props.button &&
    css`
      width: 100%;
      min-height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;
