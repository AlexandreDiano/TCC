import React from "react";
import { Grid } from "@material-ui/core";
import { Margin } from "~/components/elements";
import { Card, CardDivider, CardTitle, CardValue, IconHolder } from "./styles";
import { FaUsers } from "react-icons/fa";
import {
  MdToday,
  MdDateRange,
  MdSwapVert,
  MdHighlightOff,
} from "react-icons/md";

export default function CardInfo({ title, value, icon, color }) {
  const iconRender = (icon) => {
    switch (icon) {
      case "users":
        return <FaUsers />;
      case "today":
        return <MdToday />;
      case "month":
        return <MdDateRange />;
      case "all":
        return <MdSwapVert />;
      default:
        return <MdHighlightOff />;
    }
  };

  return (
    <Card>
      <Grid container justifyContent="space-between">
        <CardDivider item>
          <Margin mb={1}>
            <CardTitle>{title}</CardTitle>
          </Margin>
          <CardValue>{value}</CardValue>
        </CardDivider>
        <CardDivider item>
          <IconHolder color={color}>{iconRender(icon)}</IconHolder>
        </CardDivider>
      </Grid>
    </Card>
  );
}
