import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MainMenu, ContentSection } from "~/components/sections";
import { PageHeader, CardAccesses } from "~/components/blocks";
import { Margin } from "~/components/elements";
import { Background, PadGrid } from "./styles";
import { Creators as AccessesActions } from "~/store/modules/accesses/actions";
import {
  scrollTop,
  formatDateStringToSend,
  removeMaskString,
} from "~/utils/tools";

export default function Accesses() {
  const dispatch = useDispatch();

  const filteredAccesses = (values) => {
    const payload = {
      initialDate: values.initialDate
        ? formatDateStringToSend(values.initialDate)
        : "",
      finalDate: values.finalDate
        ? formatDateStringToSend(values.finalDate)
        : "",
      cpf: values.cpf ? removeMaskString(values.cpf) : "",
      door: values.door || "",
    };
    dispatch(AccessesActions.getFilteredAccesses(payload));
  };

  const reloadAllAccesses = () => {
    dispatch(AccessesActions.getAccesses());
  };

  useEffect(() => {
    scrollTop();
    dispatch(AccessesActions.getAccesses());
  }, [dispatch]);

  return (
    <>
      <MainMenu />
      <ContentSection>
        <Background>
          <Margin mb={3}>
            <PageHeader title="Acessos" />
          </Margin>
          <PadGrid container spacing={2} justifyContent="space-evenly">
            <CardAccesses
              filteredAccesses={filteredAccesses}
              reloadAllAccesses={reloadAllAccesses}
            />
          </PadGrid>
        </Background>
      </ContentSection>
    </>
  );
}
