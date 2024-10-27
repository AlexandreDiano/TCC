import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainMenu, ContentSection } from "~/components/sections";
import {
  PageHeader,
  CardUsers,
  CardUserCreate,
  ModalPersonDelete,
} from "~/components/blocks";
import { Margin } from "~/components/elements";
import { Background, PadGrid } from "./styles";
import { Creators as UsersActions } from "~/store/modules/users/actions";
import { scrollTop } from "~/utils/tools";

function Users() {
  const dispatch = useDispatch();
  const [modalDeleteOpen, openModalDelete] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const id = useSelector((state) => state.authentication.user.id);

  const closeModalDelete = () => {
    openModalDelete(false);
    setDeleteId(null);
  };

  const userDelete = () => {
    const payload = {
      user: {
        active: false,
        userId: deleteId,
      },
    };
    dispatch(UsersActions.deleteUser(payload));
    closeModalDelete();
    setDeleteId(null);
  };

  useEffect(() => {
    scrollTop();
    dispatch(UsersActions.getUsers(id));
  }, [dispatch, id]);

  return (
    <>
      <MainMenu />
      <ContentSection>
        <Background>
          <Margin mb={3}>
            <PageHeader title="Usuários" />
          </Margin>
          <PadGrid container spacing={2} justifyContent="space-evenly">
            <CardUsers
              openModalDelete={() => openModalDelete(true)}
              setDeleteId={(id) => setDeleteId(id)}
              setEditId={(id) => setEditId(id)}
            />
            <CardUserCreate editId={editId} setEditId={(id) => setEditId(id)} />
          </PadGrid>
        </Background>
      </ContentSection>
      <ModalPersonDelete
        open={modalDeleteOpen}
        onClose={closeModalDelete}
        deleteId={deleteId}
        onDelete={userDelete}
      />
    </>
  );
}

export default Users;
