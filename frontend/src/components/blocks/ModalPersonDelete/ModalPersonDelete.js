import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { Modal, Margin, Title, Button } from "~/components/elements";
import { TextCenter } from "./styles";

export default function ModalPersonDelete({
  open,
  onClose,
  deleteId,
  onDelete,
}) {
  const list = useSelector((state) => state.users.list);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (list) {
      setUser(list.find((i) => i.id === deleteId));
    }
  }, [list, deleteId, user]);

  return (
    <Modal size="xs" open={open} onClose={() => onClose()}>
      <Margin mb={2}>
        <Title as="3" level="6" levelDesktop="6">
          Excluir usuário?
        </Title>
      </Margin>
      {user && user.name && user.surname && (
        <Margin mb={5}>
          <TextCenter as="p" level="3">
            {user.name} {user.surname}
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
          <Button onClick={() => onDelete(deleteId)} size="full" type="submit">
            Excluir
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
