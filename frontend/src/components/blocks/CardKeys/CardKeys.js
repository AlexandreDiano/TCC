import React from "react";
import { useSelector } from "react-redux";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdSettings } from "react-icons/md";
import { ContentCard, Loading, Table } from "~/components/elements";
import { IconHolder, TableCell } from "./styles";
import { formatDateToBr } from "~/utils/tools";
import isMobile from "~/hooks/isMobile";

export default function CardKeys({
  openModalBind,
  setBindId,
  openModalAccess,
  setAccessId,
}) {
  const loading = useSelector((state) => state.keys.loading);
  const keysList = useSelector((state) => state.keys.list);
  const mobile = isMobile();

  const handleBindClick = (id) => {
    openModalBind();
    setBindId(id);
  };

  const handleAccessClick = (id) => {
    openModalAccess();
    setAccessId(id);
  };

  const TableHeaders = [];
  if (!mobile) {
    TableHeaders.push("Código");
    TableHeaders.push("Data de Criação");
  }
  if (mobile) {
    TableHeaders.push("Desc.");
    TableHeaders.push("Cred.");
    TableHeaders.push("Add");
  } else {
    TableHeaders.push("Descrição");
    TableHeaders.push("Credenciado");
    TableHeaders.push("Associar");
  }
  TableHeaders.push("Acesso");

  return (
    <ContentCard sm={12} md={12} lg={12} title="Chaves">
      {loading ? (
        <Loading />
      ) : (
        <Table th={TableHeaders}>
          {keysList &&
            keysList.map((i) => {
              return (
                <tr key={i.id}>
                  {!mobile && (
                    <>
                      <TableCell>{i.code}</TableCell>
                      <TableCell>{formatDateToBr(i.created_at)}</TableCell>
                    </>
                  )}
                  <TableCell restrict>{i.description}</TableCell>
                  <TableCell>
                    {i.user_id && `${i.user.name} ${i.user.surname}`}
                  </TableCell>
                  <TableCell>
                    <IconHolder onClick={() => handleBindClick(i.id)}>
                      <AiOutlineUserAdd />
                    </IconHolder>
                  </TableCell>
                  <TableCell>
                    <IconHolder onClick={() => handleAccessClick(i.id)}>
                      <MdSettings />
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
