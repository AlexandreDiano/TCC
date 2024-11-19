import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { CardInfo } from "~/components/blocks";
import { ContentHolder } from "./styles";

export default function DashboardInfos() {
  const dashInfos = useSelector(
    (state) => state.dashboard.dashInfos.dashboardInfos
  );

  return (
    <>
      <ContentHolder>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} md={6} lg={3}>
            <CardInfo
              title="Usuários"
              value={dashInfos && dashInfos.domain_users_count}
              icon="users"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CardInfo
              title="Acessos hoje"
              value={dashInfos && dashInfos.today_accesses_count}
              icon="today"
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CardInfo
              title="Acessos mês"
              value={dashInfos && dashInfos.month_accesses_count}
              icon="month"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CardInfo
              title="Acessos total"
              value={dashInfos && dashInfos.all_accesses_count}
              icon="all"
              color="secondary"
            />
          </Grid>
        </Grid>
      </ContentHolder>
    </>
  );
}
