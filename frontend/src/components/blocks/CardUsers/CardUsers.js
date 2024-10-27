import React from "react";
import { useSelector } from "react-redux";
import { MdModeEdit, MdDeleteForever } from "react-icons/md";
import { ContentCard, Loading, Table, Toast } from "~/components/elements";
import { IconHolder, TableCell } from "./styles";
import { formatCPF, formatDateToBr } from "~/utils/tools";
import MESSAGE from "~/utils/messages";
import isMobile from "~/hooks/isMobile";

export default function CardUsers({ openModalDelete, setDeleteId, setEditId }) {
  const loading = useSelector((state) => state.users.loading);
  const usersList = useSelector((state) => state.users.list);
  const userId = useSelector((state) => state.authentication.user.id);
  const mobile = isMobile();

  const handleDeleteClick = (id) => {
    if (id === userId) {
      Toast("error", MESSAGE.deleteSelf);
    } else {
      openModalDelete();
      setDeleteId(id);
    }
  };

  return (
    <ContentCard sm={10} md={10} lg={8} title="Usuários" mb={mobile ? 3 : 0}>
      {loading ? (
        <Loading />
      ) : (
        <Table
          th={
            mobile
              ? ["Nome", "Editar", "Excluir"]
              : ["Nome", "CPF", "Data de Criação", "Editar", "Excluir"]
          }
        >
          {usersList &&
            usersList.map((i) => {
              return (
                <tr key={i.id}>
                  <TableCell>
                    {i.name} {i.surname}
                  </TableCell>
                  {!mobile && <TableCell>{formatCPF(i.cpf)}</TableCell>}
                  {!mobile && (
                    <TableCell>{formatDateToBr(i.created_at)}</TableCell>
                  )}
                  <TableCell>
                    <IconHolder onClick={() => setEditId(i.id)}>
                      <MdModeEdit />
                    </IconHolder>
                  </TableCell>
                  <TableCell>
                    <IconHolder onClick={() => handleDeleteClick(i.id)}>
                      <MdDeleteForever />
                    </IconHolder>
                  </TableCell>
                </tr>
              );
            })}
        </Table>
      )}
    </ContentCard>
  );
}
