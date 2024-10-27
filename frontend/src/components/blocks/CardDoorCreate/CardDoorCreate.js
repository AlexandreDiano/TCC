import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FormDoor } from "~/components/blocks";
import { ContentCard, Button, Margin } from "~/components/elements";
import { userRole } from "~/utils/tools";

export default function CardDoorCreate({ editId, setEditId }) {
  const [door, setDoor] = useState(null);
  const doorsList = useSelector((state) => state.doors.list);
  const roleType = useSelector((state) => state.authentication.user.roletype);

  useEffect(() => {
    if (doorsList) {
      setDoor(doorsList.find((u) => u.id === editId));
    }
  }, [doorsList, editId]);

  const handleRevertForm = () => {
    setDoor(null);
    setEditId(null);
  };
  const actionText = () => {
    if (door) {
      return "Editar";
    }
    if (userRole(roleType)) {
      return "Vincular";
    }
    return "Cadastrar";
  };

  return (
    <ContentCard sm={10} md={10} lg={4} title={`${actionText()} Porta`}>
      <FormDoor initial={door} />
      {!!door && (
        <Margin mt={2}>
          <Button size="full" onClick={() => handleRevertForm()}>
            Nova Porta
          </Button>
        </Margin>
      )}
    </ContentCard>
  );
}
