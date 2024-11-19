import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { Modal, Margin, Title, Button } from "~/components/elements";
import { TextCenter } from "./styles";

export default function ModalDoorOpen({ open, onClose, openId, onOpen }) {
  const list = useSelector((state) => state.doors.list);
  const [door, setDoor] = useState(null);

  useEffect(() => {
    if (list) {
      setDoor(list.find((i) => i.id === openId));
    }
  }, [list, openId, door]);

  return (
    <Modal size="xs" open={open} onClose={() => onClose()}>
      <Margin mb={2}>
        <Title as="3" level="6" levelDesktop="6">
          Abrir porta?
        </Title>
      </Margin>
      {door && door.description && (
        <Margin mb={5}>
          <TextCenter as="p" level="3">
            {door.description}
          </TextCenter>
        </Margin>
      )}
      <Grid container justifyContent="space-evenly">
        <Grid item>
          <Button
            onClick={() => onClose()}
            variant="outlined"
            size="full"
            type="submit"
          >
            Voltar
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={() => onOpen(openId)} size="full" type="submit">
            Abrir
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
