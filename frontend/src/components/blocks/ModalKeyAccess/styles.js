import styled from "styled-components";
import theme from "~/styles/theme";
import { Grid } from "@material-ui/core";

export const ModalContentHolder = styled.div`
  border: 1px solid ${theme.palette.common.lighter};
  overflow: auto;
`;

export const TabsHolder = styled(Grid)`
  height: 45px;
  padding-top: 15px;
  background: ${theme.palette.common.lighter};
  overflow-x: auto;
  flex-wrap: nowrap;
`;

export const WeekDayTab = styled(Grid)`
  cursor: pointer;
  height: 30px;
  border-radius: 5px 5px 0 0;
  padding: 5px 15px;
  background: ${(props) =>
    props.selected
      ? theme.palette.common.white
      : theme.palette.common.lightGrey};
`;

export const AccessSettingsHolder = styled.div`
  height: 100%;
  padding: 15px 20px;
`;

export const SelectDayText = styled.p`
  display: block;
  margin: 25% auto;
  text-align: center;
`;

export const IconHolder = styled.div`
position: absolute;
top: calc(50% - 15px);
right: 15px;
height: 30px;
width: 30px;
border-radius: 50%;
background: ${theme.palette.common.green}
cursor: pointer;
margin: 0 auto;
  text-align: center;
  svg {
    height: 75%;
    width: 75%;
    margin-top: 4px;
    path {
      color: ${theme.palette.common.white};
    }
  }
  `;
export const SchedulesHolder = styled(Grid)`
  border-bottom: 1px solid ${theme.palette.common.lightGrey};
  height: 100px;
  overflow-y: auto;
`;

export const ScheduleItem = styled(Grid)`
  width: 150px;
  height: fit-content;
  border: 1px solid ${theme.palette.common.black};
  border-radius: 5px;
  margin: 5px;
  font-size: 15px;
  position: relative;
`;

export const RemoveButton = styled.div`
  cursor: pointer;
  display: inline-block;
  position: absolute;
  right: 1px;
  top: 1px;
  background: ${theme.palette.common.lighter};
  height: 29px;
  width: 29px;
  border-radius: 5px;
  text-align: center;
`;

export const IconRadius = styled.div`
  display: inline-block;
  margin: 4.5px auto 0;
  height: 20px;
  width: 20px;
  background: ${theme.palette.error.main};
  border-radius: 50%;
  svg {
    height: 100%;
    margin: 0 auto;
    path {
      color: ${theme.palette.common.white};
    }
  }
`;
export const ReplicateHolder = styled(Grid)`
  height: 100px;
`;

export const ReplicateDayElement = styled(Grid)`
  cursor: pointer;
  width: 200px;
  height: 40px;
  border-radius: 5px;
  margin: 5px;
  font-size: 15px;
  overflow: hidden;
`;
export const ReplicateDayCheck = styled.div`
  display: inline-block;
  width: 33%;
  height: 100%;
  background: ${(props) =>
    props.checked ? theme.palette.common.green : theme.palette.common.grey};
  vertical-align: middle;
  text-align: center;
  padding: 6px;
  svg {
    height: 30px;
    width: auto;
    path {
      color: ${theme.palette.common.white};
    }
  }
`;
export const ReplicateDayName = styled.div`
  display: inline-block;
  width: 67%;
  height: 100%;
  background: ${theme.palette.common.black};
  color: ${theme.palette.common.white};
  text-align: center;
  padding: 12px;
  vertical-align: middle;
`;
