import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import { MdCheck, MdDeleteForever } from "react-icons/md";
import {
  Modal,
  Margin,
  Title,
  Button,
  Loading,
  Toast,
} from "~/components/elements";
import { FormDate } from "~/components/blocks";
import {
  ModalContentHolder,
  TabsHolder,
  WeekDayTab,
  AccessSettingsHolder,
  SelectDayText,
  SchedulesHolder,
  ScheduleItem,
  RemoveButton,
  IconRadius,
  ReplicateHolder,
  ReplicateDayElement,
  ReplicateDayCheck,
  ReplicateDayName,
} from "./styles";
import { schema } from "./validation";
import { Creators as KeysActions } from "~/store/modules/keys/actions";
import {
  formatWeekDayToBr,
  formatTimeToBr,
  hourMask,
  formatDateToSchedule,
  formatScheduleToTime,
} from "~/utils/tools";
import isMobile from "~/hooks/isMobile";
import MESSAGE from "~/utils/messages";

export default function ModalKeyAccess({ open, onClose, accessId }) {
  const dispatch = useDispatch();
  const mobile = isMobile();
  const keysLoading = useSelector((state) => state.keys.accessKey.loading);
  const permissions = useSelector((state) => state.keys.accessKey.permissions);
  const idCurrentPermission = useSelector(
    (state) => state.keys.accessKey.idCurrentPermission
  );
  const saveLoading = useSelector((state) => state.keys.save.loading);
  const saveSuccess = useSelector((state) => state.keys.save.success);
  const saveFail = useSelector((state) => state.keys.save.fail);
  const deleteLoading = useSelector((state) => state.keys.delete.loading);
  const deleteSuccess = useSelector((state) => state.keys.delete.success);
  const deleteFail = useSelector((state) => state.keys.delete.fail);
  const [schedules, setSchedules] = useState([]);
  const [addedSchedules, setAddedSchedules] = useState([]);
  const [removedIDs, setRemovedIDs] = useState([]);
  const [replicateLoading, setReplicateLoading] = useState(false);
  const [replicateDays, setReplicateDays] = useState([idCurrentPermission]);

  const handleSubmit = () => {
    dispatch(KeysActions.scheduleReset());
    if (addedSchedules.length > 0) {
      addedSchedules.forEach((s) => {
        const payload = {
          schedule: {
            permission_id: s.permission_id,
            entry: formatScheduleToTime(s.entry),
            exit: formatScheduleToTime(s.exit),
          },
        };
        dispatch(KeysActions.saveSchedule(payload));
      });
    }
    if (removedIDs.length > 0) {
      removedIDs.forEach((id) => {
        dispatch(KeysActions.deleteSchedule(id));
      });
    }
    dispatch(KeysActions.getKeys());
  };
  const handleReplicate = () => {
    setReplicateLoading(true);
    const removableSchedules = schedules.filter(
      (s) =>
        s.permission_id !== idCurrentPermission &&
        replicateDays.includes(s.permission_id)
    );
    const addableSchedules = schedules.filter(
      (s) => s.permission_id === idCurrentPermission
    );
    removableSchedules.forEach((s) => removeSchedule(s.id));
    replicateDays.forEach((d) => {
      if (d !== idCurrentPermission) {
        addableSchedules.forEach((s) => {
          const newS = Object.assign({}, s, { permission_id: d });
          addSchedule(newS);
        });
      }
    });
    Toast("success", MESSAGE.replicateSchedules);
    setReplicateDays([]);
    setReplicateLoading(false);
  };
  const setIdPermission = useCallback(
    (id) => {
      dispatch(KeysActions.setIdPermission(id));
    },
    [dispatch]
  );
  const handleClose = useCallback(() => {
    setIdPermission(null);
    setAddedSchedules([]);
    setRemovedIDs([]);
    setReplicateDays([]);
    onClose();
  }, [setIdPermission, onClose]);

  const addSchedule = (values) => {
    const numId = Math.floor(Math.random() * 100001);
    const newID = "T-" + numId;
    const newSchedule = { id: newID };
    if (values.permission_id) {
      newSchedule.entry = values.entry;
      newSchedule.exit = values.exit;
      newSchedule.permission_id = values.permission_id;
    } else {
      newSchedule.entry = formatDateToSchedule(values.entry);
      newSchedule.exit = formatDateToSchedule(values.exit);
      newSchedule.permission_id = idCurrentPermission;
    }
    setAddedSchedules((addedSchedulesArray) => [
      ...addedSchedulesArray,
      newSchedule,
    ]);
    setSchedules((schedulesArray) => [...schedulesArray, newSchedule]);
  };

  const removeSchedule = (id) => {
    setSchedules(schedules.filter((i) => i.id !== id));
    if (typeof id === "number") {
      setRemovedIDs((removedArray) => [...removedArray, id]);
    } else if (typeof id === "string") {
      setAddedSchedules(addedSchedules.filter((i) => i.id !== id));
    }
  };

  const handleReplicateDays = (id) => {
    if (id !== idCurrentPermission) {
      if (replicateDays.includes(id)) {
        setReplicateDays(replicateDays.filter((d) => d !== id));
      } else {
        setReplicateDays((daysArray) => [...daysArray, id]);
      }
    }
  };

  useEffect(() => {
    if (open && accessId) {
      dispatch(KeysActions.getAccessKey(accessId));
    }
  }, [open, dispatch, accessId]);
  useEffect(() => {
    if (permissions && permissions.length > 0) {
      const schedulesArray = [];
      permissions.forEach((i) => {
        if (i.schedules.length > 0) {
          i.schedules.map((s) => schedulesArray.push(s));
        }
      });
      setSchedules(schedulesArray);
    }
  }, [permissions]);

  useEffect(() => {
    if ((saveSuccess || deleteSuccess) && !saveFail && !deleteFail) {
      dispatch(KeysActions.scheduleReset());
      setAddedSchedules([]);
      setRemovedIDs([]);
      handleClose();
    }
  }, [
    saveSuccess,
    saveFail,
    deleteSuccess,
    deleteFail,
    onClose,
    dispatch,
    handleClose,
  ]);
  useEffect(() => {
    setReplicateDays([idCurrentPermission]);
  }, [idCurrentPermission]);
  return (
    <Modal
      size={mobile ? "xl" : "lg"}
      open={open}
      onClose={() => handleClose()}
    >
      <Margin mb={2}>
        <Title as="3" level="6" levelDesktop="6">
          Configurar acesso
        </Title>
      </Margin>
      <Margin mb={4}>
        <ModalContentHolder>
          <TabsHolder
            container
            justifyContent={mobile ? "flex-start" : "space-evenly"}
          >
            {permissions &&
              permissions.length > 0 &&
              permissions.map((p) => (
                <WeekDayTab
                  item
                  key={`day${p.id}`}
                  selected={p.id === idCurrentPermission}
                  onClick={() => setIdPermission(p.id)}
                >
                  {formatWeekDayToBr(p.day_of_week)}
                </WeekDayTab>
              ))}
          </TabsHolder>
          <AccessSettingsHolder>
            {!idCurrentPermission ? (
              <SelectDayText>Selecione um dia da semana</SelectDayText>
            ) : (
              <>
                <Margin mb={1}>
                  <Title as="4" level="10" levelDesktop="10">
                    Horário de entrada e saída:
                  </Title>
                </Margin>
                <Margin mb={2}>
                  <FormDate
                    field1="entry"
                    field1label="Entrada"
                    field2="exit"
                    field2label="Saída"
                    action="Adicionar"
                    mask={hourMask}
                    schema={schema}
                    onSubmit={(values) => addSchedule(values)}
                  />
                </Margin>
                <Margin mb={2}>
                  <Title as="4" level="10" levelDesktop="10">
                    Horários liberados:
                  </Title>
                </Margin>
                <Margin mb={2}>
                  <SchedulesHolder
                    container
                    spacing={2}
                    justifyContent={mobile ? "center" : "flex-start"}
                  >
                    {schedules &&
                      schedules.length > 0 &&
                      schedules
                        .filter((s) => s.permission_id === idCurrentPermission)
                        .map((e) => (
                          <ScheduleItem key={e.id} item>
                            {e.entry && formatTimeToBr(e.entry)} -{" "}
                            {e.exit && formatTimeToBr(e.exit)}
                            <RemoveButton onClick={() => removeSchedule(e.id)}>
                              <IconRadius>
                                <MdDeleteForever />
                              </IconRadius>
                            </RemoveButton>
                          </ScheduleItem>
                        ))}
                  </SchedulesHolder>
                </Margin>
                <Margin mb={2}>
                  <Title as="4" level="10" levelDesktop="10">
                    Replicar horários:
                  </Title>
                </Margin>
                <Margin mb={2}>
                  <ReplicateHolder container>
                    {permissions &&
                      permissions.length > 0 &&
                      permissions.map((p) => (
                        <ReplicateDayElement
                          item
                          key={p.id}
                          onClick={() => handleReplicateDays(p.id)}
                        >
                          <ReplicateDayCheck
                            checked={
                              replicateDays.includes(p.id) ||
                              p.id === idCurrentPermission
                            }
                          >
                            {(replicateDays.includes(p.id) ||
                              p.id === idCurrentPermission) && <MdCheck />}
                          </ReplicateDayCheck>
                          <ReplicateDayName>
                            {formatWeekDayToBr(p.day_of_week)}
                          </ReplicateDayName>
                        </ReplicateDayElement>
                      ))}
                  </ReplicateHolder>
                </Margin>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Button
                      onClick={() => handleReplicate()}
                      size="large"
                      disabled={replicateDays.length === 1}
                      className={
                        replicateLoading
                          ? "button-chat animation-size"
                          : "button-chat"
                      }
                    >
                      {replicateLoading ? <Loading button /> : "Replicar"}
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </AccessSettingsHolder>
        </ModalContentHolder>
      </Margin>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Button
            onClick={() => handleSubmit()}
            size="large"
            disabled={addedSchedules.length === 0 && removedIDs.length === 0}
            className={
              keysLoading || saveLoading || deleteLoading
                ? "button-chat animation-size"
                : "button-chat"
            }
          >
            {keysLoading || saveLoading || deleteLoading ? (
              <Loading button />
            ) : (
              "Salvar"
            )}
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
