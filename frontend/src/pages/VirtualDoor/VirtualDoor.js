import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, TextField } from "@material-ui/core";
import doorOpened from "~/assets/img/porta-aberta.jpg";
import doorClosed from "~/assets/img/porta-fechada.jpg";
import * as S from "./styles";
import { Creators as VirtualDoorActions } from "~/store/modules/virtualDoor/actions";
import isMobile from "~/hooks/isMobile";

export default function VirtualDoor() {
  const dispatch = useDispatch();
  const mobile = isMobile();
  const doorState = useSelector((state) => state.virtualDoor.status);
  const loadingDoor = useSelector((state) => state.virtualDoor.loadingDoor);
  const loadingTag = useSelector((state) => state.virtualDoor.loadingTag);
  const [doorValue, setDoorValue] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [formType, setFormType] = useState(true);

  const handleSubmit = () => {
    if (formType) {
      dispatch(VirtualDoorActions.sendOpenDoor({ doorValue, tagValue }));
    } else {
      dispatch(VirtualDoorActions.sendRegisterTag({ doorValue, tagValue }));
    }
  };

  const handleCloseDoor = () => {
    dispatch(VirtualDoorActions.closeDoor());
  };

  const checkDoor = useCallback(() => {
    dispatch(VirtualDoorActions.checkOpenDoor({ doorValue }));
  }, [dispatch, doorValue]);

  useEffect(() => {
    if (doorValue) {
      checkDoor();
    }
    const interval = setInterval(() => {
      checkDoor();
    }, 5000);
    if (doorState === "opened" || !doorValue) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [doorValue, checkDoor, doorState]);

  return (
    <S.container>
      <Grid container justifyContent={mobile ? "center" : "space-evenly"}>
        <S.heightGrid
          container
          item
          xs={12}
          md={6}
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <img
            src={doorState === "opened" ? doorOpened : doorClosed}
            alt="Porta"
          />
        </S.heightGrid>
        <S.heightGrid
          container
          item
          xs={12}
          md={6}
          direction={"column"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
        >
          <S.widthForm>
            <S.widthMargin mb={2}>
              <TextField
                id="door-id"
                label="ID da Porta"
                InputLabelProps={{
                  shrink: true,
                }}
                size="small"
                value={doorValue}
                onChange={(e) => setDoorValue(e.target.value)}
              />
            </S.widthMargin>
            <S.widthMargin mb={2}>
              <TextField
                id="tag-id"
                label="ID do Token"
                InputLabelProps={{
                  shrink: true,
                }}
                size="small"
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
              />
            </S.widthMargin>

            <S.widthMargin mb={2}>
              {doorState === "closed" ? (
                <S.widthButton
                  variant="contained"
                  color="secondary"
                  onClick={() => handleSubmit()}
                  disabled={formType ? loadingDoor : loadingTag}
                >
                  {formType ? "Abrir Porta" : "Cadastrar Token"}
                </S.widthButton>
              ) : (
                <S.widthButton
                  variant="contained"
                  color="primary"
                  onClick={handleCloseDoor}
                >
                  Fechar Porta
                </S.widthButton>
              )}
            </S.widthMargin>

            <S.widthMargin mb={2}>
              {doorState === "closed" && (
                <S.widthButton
                  variant="contained"
                  color="primary"
                  onClick={() => setFormType(!formType)}
                >
                  {formType ? "Cadastrar Token" : "Solicitar Abrir Porta"}
                </S.widthButton>
              )}
            </S.widthMargin>
          </S.widthForm>
        </S.heightGrid>
      </Grid>
    </S.container>
  );
}
