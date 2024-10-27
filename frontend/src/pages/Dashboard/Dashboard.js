import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MainMenu,
  ContentSection,
  DashboardInfos,
  DashboardCharts,
} from "~/components/sections";
import { PageHeader } from "~/components/blocks";
import { Margin } from "~/components/elements";
import { TopBackground, BottomBackground } from "./styles";
import { Creators as DashboardActions } from "~/store/modules/dashboard/actions";
import { scrollTop } from "~/utils/tools";

function Dashboard() {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.authentication.user.roletype);

  useEffect(() => {
    scrollTop();
    dispatch(DashboardActions.getDashboardInfos());
    dispatch(DashboardActions.getAccessesInfos());
    dispatch(DashboardActions.getAccessesHistory());
    if (userRole !== "user") {
      dispatch(DashboardActions.getUsersInfos());
    }
  }, [dispatch, userRole]);

  return (
    <>
      <MainMenu />
      <ContentSection>
        <TopBackground>
          <Margin mb={3}>
            <PageHeader title="Dashboard" />
          </Margin>
          <DashboardInfos />
        </TopBackground>
        <BottomBackground>
          <DashboardCharts userRole={userRole} />
        </BottomBackground>
      </ContentSection>
    </>
  );
}

export default Dashboard;
