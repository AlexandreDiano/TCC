import React from "react";
import { Tab, TabHead, HeadCell } from "./styles";

export default function Table({ th, children }) {
  return (
    <Tab>
      {th && (
        <TabHead>
          <tr>
            {th.map((i) => (
              <HeadCell key={i}>{i}</HeadCell>
            ))}
          </tr>
        </TabHead>
      )}
      <tbody>{children}</tbody>
    </Tab>
  );
}
