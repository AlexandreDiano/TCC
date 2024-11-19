import styled from 'styled-components';
import theme from '~/styles/theme';

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const LeftBar = styled.div`
  @media (min-width: ${theme.breakpoints.values.sm}px) {
    max-width: 58%;
    flex-basis: 58%;
    border-right: 1px solid ${theme.palette.common.lightGrey};
  }
  width: 100%;
`;

export const RightBar = styled.div`
  @media (min-width: ${theme.breakpoints.values.sm}px) {
    max-width: 42%;
    flex-basis: 42%;
    display: block;
  }
  width: 100%;
  /* display: none; */
`;

export const InnerLeft = styled.div`
  max-width: 460px;
  width: 100%;
`;

export const InnerRight = styled.div`
  max-width: 272px;
  width: 100%;
  margin: 0 0 0 auto;
`;
