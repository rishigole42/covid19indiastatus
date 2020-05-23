import React, { useState, useEffect } from "react";
import { Line, defaults } from "react-chartjs-2";

import {
  getCountryDailyChanges,
  getStateDailyChanges,
} from "../../apiUtils/Totals";
import { formatNumbersWithComma } from "../../utils/formatNumbersWithComma";
import tableHeader from "../constantvalues/tableHeaders";
import cssConstants from "../constantvalues/cssconstants";
import mapConstants from "../constantvalues/mapConstants";
import cssconstants from "../constantvalues/cssconstants";

function DailyChangeGraph(props) {
  const [dailyChanges, setDailyChanges] = useState([]);
  const criteria =
    (props.mapType === mapConstants.MAP_TYPE_COUNTRY
      ? mapConstants.GRAPH_PREFIX
      : "") +
    (props.criteria === tableHeader.DEATHS
      ? tableHeader.DECEASED.toLowerCase()
      : props.criteria.toLowerCase());

  let numbers = [];
  let labels = [];

  const graphColor =
    criteria ===
      mapConstants.GRAPH_PREFIX + tableHeader.CONFIRMED.toLowerCase() ||
    criteria === tableHeader.CONFIRMED.toLowerCase()
      ? {
          bgColor: cssConstants.GRAPH_CONFIRMED_BG_COLOR,
          borderColor: cssConstants.GRAPH_CONFIRMED_BORDER_COLOR,
          pointBgColor: cssConstants.GRAPH_CONFIRMED_POINT_BG_COLOR,
          pointBorderColor: cssConstants.GRAPH_CONFIRMED_POINT_BORDER_COLOR,
          pointHoverBackgroundColor:
            cssConstants.GRAPH_CONFIRMED_POINT_HOVER_BG_COLOR,
          legendFontColor: cssConstants.GRAPH_CONFIRMED_LEGEND_FONT_COLOR,
          legendFontStyle: cssConstants.GRAPH_CONFIRMED_LEGEND_FONT_STYLE,
          axesFontColor: cssConstants.GRAPH_CONFIRMED_SCALE_FONT_COLOR,
        }
      : criteria ===
          mapConstants.GRAPH_PREFIX + tableHeader.RECOVERED.toLowerCase() ||
        criteria === tableHeader.RECOVERED.toLowerCase()
      ? {
          bgColor: cssConstants.GRAPH_RECOVERED_BG_COLOR,
          borderColor: cssConstants.GRAPH_RECOVERED_BORDER_COLOR,
          pointBgColor: cssConstants.GRAPH_RECOVERED_POINT_BG_COLOR,
          pointBorderColor: cssConstants.GRAPH_RECOVERED_POINT_BORDER_COLOR,
          pointHoverBackgroundColor:
            cssconstants.GRAPH_RECOVERED_POINT_HOVER_BG_COLOR,
          legendFontColor: cssConstants.GRAPH_RECOVERED_LEGEND_FONT_COLOR,
          legendFontStyle: cssConstants.GRAPH_RECOVERED_LEGEND_FONT_STYLE,
          axesFontColor: cssConstants.GRAPH_RECOVERED_SCALE_FONT_COLOR,
        }
      : {
          bgColor: cssConstants.GRAPH_DEATH_BG_COLOR,
          borderColor: cssConstants.GRAPH_DEATH_BORDER_COLOR,
          pointBgColor: cssConstants.GRAPH_DEATH_POINT_BG_COLOR,
          pointBorderColor: cssConstants.GRAPH_DEATH_POINT_BORDER_COLOR,
          pointHoverBackgroundColor:
            cssConstants.GRAPH_DEATH_POINT_HOVER_BG_COLOR,
          legendFontColor: cssConstants.GRAPH_DEATH_LEGEND_FONT_COLOR,
          legendFontStyle: cssConstants.GRAPH_DEATH_LEGEND_FONT_STYLE,
          axesFontColor: cssConstants.GRAPH_DEATH_SCALE_FONT_COLOR,
        };

  defaults.global.defaultFontFamily = cssConstants.GRAPH_DEFAULT_FONT_FAMILY;
  defaults.global.defaultFontSize = cssConstants.GRAPH_DEFAULT_FONT_SIZE;

  //get daily updates for graph, nationwide
  useEffect(() => {
    props.mapType === mapConstants.MAP_TYPE_COUNTRY
      ? getCountryDailyChanges().then((data) => setDailyChanges(data))
      : getStateDailyChanges().then((data) => setDailyChanges(data));
  }, [props.mapType]);

  if (props.mapType === mapConstants.MAP_TYPE_COUNTRY) {
    labels = dailyChanges.map((selectedDay) => selectedDay.date);
    numbers = dailyChanges.map((selectedDay) => selectedDay[criteria]);
  } else {
    const _interm = dailyChanges.filter(
      (selectedDay) => selectedDay.status.toLowerCase() === criteria
    );
    labels = _interm.map((selectedDay) => selectedDay.date);
    numbers = _interm.map(
      (selectedDay) => selectedDay[props.statecode.toLowerCase()]
    );
  }

  //to mark -ve numbers as zero
  numbers = numbers.map((numberOfCases) =>
    numberOfCases > 0 ? numberOfCases : 0
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: `${cssConstants.GRAPH_TITLE_PREFIX} ${props.criteria}`,
        data: numbers,
        backgroundColor: graphColor.bgColor,
        borderColor: graphColor.borderColor,
        borderWidth: cssConstants.GRAPH_ALL_BORDER_WIDTH,
        pointRadius: cssConstants.GRAPH_ALL_POINT_RADIUS,
        pointHoverRadius: cssConstants.GRAPH_ALL_POINT_HOVER_RADIUS,
        pointBackgroundColor: graphColor.pointBgColor,
        pointBorderColor: graphColor.pointBorderColor,
        pointHoverBackgroundColor: graphColor.pointHoverBackgroundColor,
      },
    ],
  };

  const options = {
    maintainAspectRatio: true,
    responsive: true,
    legend: {
      labels: {
        fontColor: graphColor.legendFontColor,
        fontStyle: graphColor.legendFontStyle,
        fontSize: cssConstants.GRAPH_DEFAULT_LEGEND_FONT_SIZE,
      },
      align: cssConstants.GRAPH_DEFAULT_LEGEND_ALIGN,
    },
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: cssConstants.GRAPH_DEFAULT_TICK_FONT_COLOR,
            fontStyle: cssConstants.GRAPH_DEFAULT_TICK_FONT_STYLE,
            beginAtZero: true,
          },
          gridLines: {
            //drawOnChartArea: false,
            zeroLineColor: cssConstants.GRAPH_DEFAULT_AXES_LINE_COLOR,
            zeroLineWidth: cssConstants.GRAPH_DEFAULT_XAXIS_WIDTH,
          },
          scaleLabel: {
            display: true,
            labelString: cssConstants.GRAPH_DEFAULT_XAXIS_LEGEND,
            fontColor: graphColor.axesFontColor,
            fontStyle: cssconstants.GRAPH_DEFAULT_SCALE_FONT_STYLE,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: cssConstants.GRAPH_DEFAULT_TICK_FONT_COLOR,
            fontStyle: cssConstants.GRAPH_DEFAULT_TICK_FONT_STYLE,
            beginAtZero: true,
            userCallback: function (label, index, labels) {
              // remove decimal values from scales and format numbers to Indian system
              if (Math.floor(label) === label) {
                return formatNumbersWithComma(label);
              }
            },
          },
          gridLines: {
            //drawOnChartArea: false,
            zeroLineColor: cssConstants.GRAPH_DEFAULT_AXES_LINE_COLOR,
            zeroLineWidth: cssConstants.GRAPH_DEFAULT_YAXIS_WIDTH,
          },
          scaleLabel: {
            display: true,
            labelString: cssConstants.GRAPH_DEFAULT_YAXIS_LEGEND,
            fontColor: graphColor.axesFontColor,
            fontStyle: cssconstants.GRAPH_DEFAULT_SCALE_FONT_STYLE,
          },
        },
      ],
    },
  };

  //stucture array to use raw data
  return (
    <div>
      <Line data={data} height={300} width={400} options={options} />
    </div>
  );
}

export default DailyChangeGraph;
