import styled from "styled-components";
import theme from "~/styles/theme";

export const Card = styled.div`
  border: 1px solid ${theme.palette.common.grey};
  border-radius: 10px;
  padding-bottom: 10px;
  background: ${theme.palette.background.darkBlue};
`;

export const CardHeader = styled.div`
  border-radius: 10px 10px 0 0;
  padding: 20px 24px;
`;

export const CardTitle = styled.h2`
  color: ${theme.palette.common.white};
  font-size: 20px;
  line-height: 1.5;
  font-weight: bold;
`;

export const CardContent = styled.div`
  border-radius: 0 0 10px 10px;
  padding: 20px 24px;
`;
