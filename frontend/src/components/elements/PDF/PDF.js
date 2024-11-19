import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { tstyles } from "./styles";
import { formatDateTimeToBr, formatCPF } from "~/utils/tools";

export default function PDF({ headers, data }) {
  return (
    <Document>
      <Page>
        <View style={tstyles.page}>
          <Text>Relatório de Acessos</Text>

          <View style={tstyles.table}>
            <View style={tstyles.headRow}>
              {headers &&
                headers.length > 0 &&
                headers.map((h, i) => (
                  <View style={tstyles.tableCol}>
                    <View style={tstyles.headCell} key={i}>
                      <Text>{h}</Text>
                    </View>
                  </View>
                ))}
            </View>
            {data &&
              data.map((i) => {
                return (
                  <View style={tstyles.row} key={i.id}>
                    <View style={tstyles.tableCol}>
                      <View style={tstyles.cell}>
                        <Text>
                          {i.user_id && `${i.user.name} ${i.user.surname}`}
                        </Text>
                      </View>
                    </View>

                    <View style={tstyles.tableCol}>
                      <View style={tstyles.cell}>
                        <Text>{i.user_id && formatCPF(i.user.cpf)}</Text>
                      </View>
                    </View>

                    <View style={tstyles.tableCol}>
                      <View style={tstyles.cell}>
                        <Text>{i.door.description}</Text>
                      </View>
                    </View>
                    <View style={tstyles.tableCol}>
                      <View style={tstyles.cell}>
                        <Text>{formatDateTimeToBr(i.created_at)}</Text>
                      </View>
                    </View>
                    <View style={tstyles.tableCol}>
                      <View style={tstyles.cell}>
                        <Text>{i.type_access}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
