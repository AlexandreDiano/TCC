import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MainMenu, ContentSection } from "~/components/sections";
import {
  PageHeader,
  CardDoors,
  CardDoorCreate,
  ModalDoorDelete,
  ModalDoorOpen,
} from "~/components/blocks";
import { Margin } from "~/components/elements";
import { Background, PadGrid } from "./styles";
import { Creators as DoorsActions } from "~/store/modules/doors/actions";
import { scrollTop } from "~/utils/tools";

function Doors() {
  const dispatch = useDispatch();
  const [modalDeleteOpen, openModalDelete] = useState(false);
  const [modalOpenOpen, openModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openId, setOpenId] = useState(null);

  const closeModalDelete = () => {
    openModalDelete(false);
    setDeleteId(null);
  };
  const closeModalOpen = () => {
    openModalOpen(false);
    setOpenId(null);
  };

  const doorDelete = () => {
    dispatch(DoorsActions.deleteDoor(deleteId));
    closeModalDelete();
  };
  const doorOpen = () => {
    dispatch(DoorsActions.openDoor(openId));
    closeModalOpen();
  };

  useEffect(() => {
    scrollTop();
    dispatch(DoorsActions.getDoors());
  }, [dispatch]);

  return (
    <>
      <MainMenu />
      <ContentSection>
        <Background>
          <Margin mb={3}>
            <PageHeader title="Portas" />
          </Margin>
          <PadGrid container spacing={2} justifyContent="space-evenly">
            <CardDoors
              openModalDelete={() => openModalDelete(true)}
              openModalOpen={() => openModalOpen(true)}
              setDeleteId={(id) => setDeleteId(id)}
              setEditId={(id) => setEditId(id)}
              setOpenId={(id) => setOpenId(id)}
            />
            <CardDoorCreate editId={editId} setEditId={(id) => setEditId(id)} />
          </PadGrid>
        </Background>
      </ContentSection>
      <ModalDoorDelete
        open={modalDeleteOpen}
        onClose={closeModalDelete}
        deleteId={deleteId}
        onDelete={doorDelete}
      />
      <ModalDoorOpen
        open={modalOpenOpen}
        onClose={closeModalOpen}
        openId={openId}
        onOpen={doorOpen}
      />
    </>
  );
}

export default Doors;
