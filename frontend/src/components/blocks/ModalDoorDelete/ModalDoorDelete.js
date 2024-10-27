import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { Modal, Margin, Title, Button } from "~/components/elements";
import { TextCenter } from "./styles";
import { userRole } from "~/utils/tools";

export default function ModalDoorDelete({ open, onClose, deleteId, onDelete }) {
  const list = useSelector((state) => state.doors.list);
  const roleType = useSelector((state) => state.authentication.user.roletype);
  const [door, setDoor] = useState(null);

  useEffect(() => {
    if (list) {
      setDoor(list.find((i) => i.id === deleteId));
    }
  }, [list, deleteId]);

  return (
    <Modal size="xs" open={open} onClose={() => onClose()}>
      <Margin mb={2}>
        <Title as="3" level="6" levelDesktop="6">
          {`${userRole(roleType) === 0 ? "Excluir" : "Desvincular"} porta?`}
        </Title>
      </Margin>
      {door && door.description && (
        <Margin mb={5}>
          <TextCenter as="p" level="3">
            {door.description}
          </TextCenter>
        </Margin>
      )}
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={6}>
          <Button
            onClick={() => onClose()}
            variant="outlined"
            size="full"
            type="submit"
          >
            Voltar
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button onClick={() => onDelete(deleteId)} size="full" type="submit">
            {`${userRole(roleType) === 0 ? "Excluir" : "Desvincular"}`}
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
