import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import { MdCheck } from "react-icons/md";
import {
  Modal,
  Margin,
  Title,
  Button,
  Textarea,
  Loading,
} from "~/components/elements";
import {
  UsersTitle,
  UsersSelectionList,
  UserSelectionCard,
  IconHolder,
} from "./styles";
import { Creators as UsersActions } from "~/store/modules/users/actions";
import { Creators as KeysActions } from "~/store/modules/keys/actions";
import { formatCPF } from "~/utils/tools";

export default function ModalKeyBind({ open, onClose, bindId }) {
  const dispatch = useDispatch();
  const [accessDescription, setAccessDescription] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const usersList = useSelector((state) => state.users.list);
  const keysList = useSelector((state) => state.keys.list);
  const usersLoading = useSelector((state) => state.users.loading);
  const keysLoading = useSelector((state) => state.keys.loading);
  const userId = useSelector((state) => state.authentication.user.id);

  const handleSubmit = () => {
    const payload = {
      user_id: selectedUserId,
      key_id: selectedKey.id,
      description: accessDescription,
    };
    dispatch(KeysActions.bindKey(payload));
    onClose();
  };

  useEffect(() => {
    if (open && !usersList) {
      dispatch(UsersActions.getUsers(userId));
    }
  }, [open, usersList, dispatch, userId]);

  useEffect(() => {
    if (keysList) {
      setSelectedKey(keysList.find((i) => i.id === bindId));
      if (selectedKey) {
        if (selectedKey.description) {
          setAccessDescription(selectedKey.description);
        }
        if (selectedKey.user_id) {
          setSelectedUserId(selectedKey.user_id);
        }
      }
    }
  }, [keysList, bindId, selectedKey]);
  return (
    <Modal size="md" open={open} onClose={() => onClose()}>
      <Margin mb={2}>
        <Title as="3" level="6" levelDesktop="6">
          Associar Credenciado
        </Title>
      </Margin>
      <Margin mb={2}>
        <div>
          <UsersTitle>Selecione um credenciado</UsersTitle>
          <UsersSelectionList>
            {usersLoading ? (
              <Loading />
            ) : (
              <>
                {usersList &&
                  usersList.length > 0 &&
                  usersList.map((u) => (
                    <UserSelectionCard
                      key={u.id}
                      selected={selectedUserId === u.id}
                      onClick={() => setSelectedUserId(u.id)}
                    >
                      <Margin mb={1}>
                        <p>{`NOME: ${u.name && u.name} ${u.surname &&
                          u.surname}`}</p>
                      </Margin>
                      <p>{`CPF: ${u.cpf && formatCPF(u.cpf)}`}</p>
                      {selectedUserId === u.id && (
                        <IconHolder>
                          <MdCheck />
                        </IconHolder>
                      )}
                    </UserSelectionCard>
                  ))}
              </>
            )}
          </UsersSelectionList>
        </div>
      </Margin>
      <Margin mb={2}>
        <Margin mb={1}>
          <Title as="4" level="8" levelDesktop="8">
            Descrição do acesso
          </Title>
        </Margin>
        <Textarea
          name="accessDescription"
          value={accessDescription}
          onChange={(event) => setAccessDescription(event.target.value)}
        />
      </Margin>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Button
            onClick={() => handleSubmit()}
            size="large"
            disabled={!selectedUserId || !selectedKey || keysLoading}
          >
            {keysLoading ? <Loading button /> : "Salvar"}
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
}
