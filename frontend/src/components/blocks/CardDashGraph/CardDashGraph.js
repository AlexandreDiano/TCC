import React from "react";
import { useSelector } from "react-redux";
import { CanvasJSReact } from "~/components/elements";
import theme from "~/styles/theme";
import { Card, CardHeader, CardTitle, CardContent } from "./styles";

export default function CardDashGraph() {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const history = useSelector(
    (state) => state.dashboard.history.accessesHistory
  );

  const data = [];
  if (history && Object.keys(history).length > 0) {
    Object.keys(history).map((i) => {
      return data.push({ x: new Date(i), y: history[i] });
    });
  }

  const options = {
    animationEnabled: true,
    backgroundColor: "transparent",
    axisX: {
      valueFormatString: "DD/MM",
      labelFontColor: theme.palette.common.white,
      lineColor: theme.palette.common.lightGrey,
      lineThickness: 2,
      tickLength: 0,
    },
    axisY: {
      labelFontColor: theme.palette.common.white,
      lineColor: theme.palette.common.lightGrey,
      lineThickness: 2,
      tickLength: 0,
      interval: 1,
    },
    data: [
      {
        xValueFormatString: "DD/MM",
        type: "spline",
        dataPoints: data,
        color: theme.palette.common.green,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acessos por dia</CardTitle>
      </CardHeader>
      <CardContent>
        <CanvasJSChart options={options} />
      </CardContent>
    </Card>
  );
}
