import React from "react";
import { Card, TitleHolder, CardTitle, ContentHolder } from "./styles";

export default function ContentCard({ sm, md, lg, title, children, mb }) {
  const hasTitle = !!title;
  return (
    <Card item sm={sm} md={md} lg={lg} mb={mb}>
      {title && (
        <TitleHolder>
          <CardTitle>{title}</CardTitle>
        </TitleHolder>
      )}
      <ContentHolder round={hasTitle}>{children}</ContentHolder>
    </Card>
  );
}
