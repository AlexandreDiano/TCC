import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MainMenu, ContentSection } from "~/components/sections";
import {
  PageHeader,
  CardKeys,
  ModalKeyBind,
  ModalKeyAccess,
} from "~/components/blocks";
import { Margin } from "~/components/elements";
import { Background, PadGrid } from "./styles";
import { Creators as KeysActions } from "~/store/modules/keys/actions";
import { scrollTop } from "~/utils/tools";

function Keys() {
  const dispatch = useDispatch();
  const [modalBindOpen, openModalBind] = useState(false);
  const [modalAccessOpen, openModalAccess] = useState(false);
  const [bindId, setBindId] = useState(null);
  const [accessId, setAccessId] = useState(null);

  const closeModalBind = () => {
    openModalBind(false);
    setBindId(null);
  };
  const closeModalAccess = () => {
    openModalAccess(false);
    setAccessId(null);
  };

  useEffect(() => {
    scrollTop();
    dispatch(KeysActions.getKeys());
  }, [dispatch]);

  return (
    <>
      <MainMenu />
      <ContentSection>
        <Background>
          <Margin mb={3}>
            <PageHeader title="Chaves" />
          </Margin>
          <PadGrid container spacing={2} justifyContent="space-evenly">
            <CardKeys
              openModalBind={() => openModalBind(true)}
              openModalAccess={() => openModalAccess(true)}
              setBindId={(id) => setBindId(id)}
              setAccessId={(id) => setAccessId(id)}
            />
          </PadGrid>
        </Background>
      </ContentSection>
      <ModalKeyBind
        open={modalBindOpen}
        onClose={closeModalBind}
        bindId={bindId}
      />
      <ModalKeyAccess
        open={modalAccessOpen}
        onClose={closeModalAccess}
        accessId={accessId}
      />
    </>
  );
}

export default Keys;
