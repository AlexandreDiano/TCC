import styled from "styled-components";
import { Grid } from "@material-ui/core";

export const GridButton = styled(Grid)`
  text-align: ${(props) => (props.mobile ? "center" : "right")};
`;
