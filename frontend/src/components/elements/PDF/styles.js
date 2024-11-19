import { StyleSheet } from "@react-pdf/renderer";
import theme from "~/styles/theme";

// PTable, PRow, PHead, PCell,

export const tstyles = StyleSheet.create({
  page: {
    paddingVertical: 50,
    paddingHorizontal: 30,
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "75vw",
  },
  tableCol: {
    width: "25%",
  },
  headRow: {
    textAlign: "left",
    margin: "auto",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `${theme.palette.common.lightGrey}`,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: `${theme.palette.common.lightGrey}`,
    color: `${theme.palette.common.lightGrey}`,
    background: `${theme.palette.background.greenish}`,
  },
  headCell: {
    margin: "auto",
    marginTop: 5,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: "uppercase",
    fontSize: 14,
    verticalAlign: "middle",
  },
  row: {
    textAlign: "left",
    margin: "auto",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `${theme.palette.common.lightGrey}`,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: `${theme.palette.common.lightGrey}`,
    color: `${theme.palette.common.lightGrey}`,
    background: `${theme.palette.background.greenish}`,
  },
  cell: {
    margin: "auto",
    marginTop: 5,
    color: `${theme.palette.common.black}`,
    fontSize: 12,
    textAlign: "left",
    verticalAlign: "middle",
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
});
