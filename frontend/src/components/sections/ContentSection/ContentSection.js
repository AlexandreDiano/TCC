import React from "react";
import { GridNoWrap, MenuSpacer, Content } from "./styles";
import isMobile from "~/hooks/isMobile";

export default function ContentSection({ children }) {
  const mobile = isMobile();
  return (
    <GridNoWrap container direction={mobile ? "column" : "row"}>
      <MenuSpacer />
      <Content>{children}</Content>
    </GridNoWrap>
  );
}
