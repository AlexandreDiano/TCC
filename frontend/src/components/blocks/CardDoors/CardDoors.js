import React from "react";
import { useSelector } from "react-redux";
import { MdModeEdit, MdDeleteForever } from "react-icons/md";
import { FaDoorOpen } from "react-icons/fa";
import { ContentCard, Loading, Table } from "~/components/elements";
import { IconHolder, TableCell } from "./styles";
import { userRole } from "~/utils/tools";
import isMobile from "~/hooks/isMobile";

export default function CardDoors({
  openModalDelete,
  openModalOpen,
  setDeleteId,
  setEditId,
  setOpenId,
}) {
  const loading = useSelector((state) => state.doors.loading);
  const doorsList = useSelector((state) => state.doors.list);
  const roleType = useSelector((state) => state.authentication.user.roletype);
  const mobile = isMobile();

  const handleDeleteClick = (id) => {
    openModalDelete();
    setDeleteId(id);
  };
  const handleOpenClick = (id) => {
    openModalOpen();
    setOpenId(id);
  };

  const TableHeaders = [];
  if (mobile) {
    TableHeaders.push("Desc.");
  } else {
    TableHeaders.push("Descrição");
    TableHeaders.push("Serial");
  }
  if (userRole(roleType) === 1) {
    TableHeaders.push("Abrir");
  }
  if (mobile) {
    TableHeaders.push("Edit.");
  } else {
    TableHeaders.push("Editar");
  }

  if (userRole(roleType) === 0) {
    TableHeaders.push("Excluir");
  } else {
    if (mobile) {
      TableHeaders.push("Desv.");
    } else {
      TableHeaders.push("Desvincular");
    }
  }

  return (
    <ContentCard sm={10} md={10} lg={8} title="Portas" mb={mobile ? 3 : 0}>
      {loading ? (
        <Loading />
      ) : (
        <Table th={TableHeaders}>
          {doorsList &&
            doorsList.map((i) => {
              return (
                <tr key={i.id}>
                  <TableCell>{i.description}</TableCell>
                  {!mobile && (
                    <TableCell restrict>{i.identification}</TableCell>
                  )}
                  {userRole(roleType) === 1 && (
                    <TableCell>
                      <IconHolder onClick={() => handleOpenClick(i.id)}>
                        <FaDoorOpen />
                      </IconHolder>
                    </TableCell>
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
