import styled from "styled-components";
import { Grid } from "@material-ui/core";
import theme from "~/styles/theme";

export const Card = styled(Grid)`
  max-width: 100%;
  padding: 0;
  border: 1px solid transparent;
  margin-bottom: ${(props) => props.mb * 8}px;
`;

export const TitleHolder = styled.div`
  background: ${theme.palette.primary.darker};
  padding: 20px 24px;
  border-radius: 10px 10px 0 0;
  text-align: left;
`;

export const CardTitle = styled.h2`
  color: ${theme.palette.common.white};
  font-size: 17px;
  font-weight: 600px;
  line-height: 25.5px;
`;

export const ContentHolder = styled.div`
  padding: 24px;
  background: ${theme.palette.common.white};
  border-radius: ${(props) => (props.round ? "0 0 10px 10px" : "10px")};
  border: 1px solid black;
`;
