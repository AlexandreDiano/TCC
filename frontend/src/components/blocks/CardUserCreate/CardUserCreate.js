import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FormUser } from "~/components/blocks";
import { ContentCard, Button, Margin } from "~/components/elements";

export default function CardUserCreate({ editId, setEditId }) {
  const [user, setUser] = useState(null);
  const usersList = useSelector((state) => state.users.list);

  useEffect(() => {
    if (usersList) {
      setUser(usersList.find((u) => u.id === editId));
    }
  }, [usersList, editId]);

  const handleRevertForm = () => {
    setUser(null);
    setEditId(null);
  };

  return (
    <ContentCard
      sm={10}
      md={10}
      lg={4}
      title={`${!!user ? "Editar" : "Cadastrar"} Usuário`}
    >
      <FormUser initial={user} />
      {!!user && (
        <Margin mt={2}>
          <Button size="full" onClick={() => handleRevertForm()}>
            Novo Usuário
          </Button>
        </Margin>
      )}
    </ContentCard>
  );
}
