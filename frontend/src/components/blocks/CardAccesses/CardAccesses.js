import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import {
  ContentCard,
  Loading,
  Table,
  Margin,
  Button,
} from "~/components/elements";
import { FormDate } from "~/components/blocks";
import { TableCell, GridButton } from "./styles";
import { schema } from "./validation";
import {
  formatDateTimeToBr,
  formatCPF,
  dateMask,
  cpfMask,
} from "~/utils/tools";
import isMobile from "~/hooks/isMobile";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "../../elements/PDF/PDF";

export default function CardAccesses({ filteredAccesses, reloadAllAccesses }) {
  const loading = useSelector((state) => state.accesses.loading);
  const accessesList = useSelector((state) => state.accesses.list);
  const mobile = isMobile();

  const TableHeaders = [];
  const AllTableHeaders = [];

  TableHeaders.push("Nome");
  AllTableHeaders.push("Nome");
  if (!mobile) {
    TableHeaders.push("CPF");
  }
  AllTableHeaders.push("CPF");
  TableHeaders.push("Porta");
  AllTableHeaders.push("Porta");
  TableHeaders.push("Acesso");
  AllTableHeaders.push("Acesso");
  if (!mobile) {
    TableHeaders.push("Tipo");
  }
  AllTableHeaders.push("Tipo");

  return (
    <ContentCard sm={12} md={12} lg={12} title="Acessos">
      <Margin mb={mobile ? 2 : 4}>
        <FormDate
          field1="initialDate"
          field1label="Data inicial"
          field2="finalDate"
          field2label="Data final"
          field3="cpf"
          field3label="CPF"
          field4="door"
          field4label="Porta"
          action="Filtrar"
          mask={dateMask}
          mask2={cpfMask}
          schema={schema}
          onSubmit={filteredAccesses}
        />
      </Margin>
      {loading ? (
        <Loading />
      ) : (
        <Margin mb={mobile ? 2 : 4}>
          <Margin mb={mobile ? 2 : 4}>
            <Table th={TableHeaders}>
              {accessesList &&
                accessesList.map((i) => {
                  return (
                    <tr key={i.id}>
                      <TableCell>
                        {i.user_id && `${i.user.name} ${i.user.surname}`}
                      </TableCell>
                      {!mobile && (
                        <TableCell>
                          {i.user_id && formatCPF(i.user.cpf)}
                        </TableCell>
                      )}
                      <TableCell>{i.door.description}</TableCell>
                      <TableCell>{formatDateTimeToBr(i.created_at)}</TableCell>
                      {!mobile && <TableCell>{i.type_access}</TableCell>}
                    </tr>
                  );
                })}
            </Table>
          </Margin>
          <Grid
            container
            spacing={2}
            justifyContent={mobile ? "space-evenly" : "flex-end"}
          >
            <GridButton item>
              <Button
                className="button-chat"
                size="large"
                onClick={reloadAllAccesses}
              >
                Limpar filtro
              </Button>
            </GridButton>
            <GridButton item>
              <PDFDownloadLink
                document={<PDF headers={AllTableHeaders} data={accessesList} />}
                filename="relatório.pdf"
              >
                <Button className="button-chat" size="large">
                  Extrair relatório
                </Button>
              </PDFDownloadLink>
            </GridButton>
          </Grid>
        </Margin>
      )}
    </ContentCard>
  );
}
