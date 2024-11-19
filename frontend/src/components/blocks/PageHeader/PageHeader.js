import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { UserHolder, PageTitle, UserName } from "./styles";

export default function PageHeader({ title }) {
  const name = useSelector((state) => state.authentication.user.name);
  const surname = useSelector((state) => state.authentication.user.surname);

  return (
    <UserHolder>
      <Grid container justifyContent="space-between">
        <Grid item>
          <PageTitle>{title}</PageTitle>
        </Grid>
        <Grid item>
          <UserName>{`${name} ${surname}`}</UserName>
        </Grid>
      </Grid>
    </UserHolder>
  );
}
