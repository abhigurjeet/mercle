const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const engagementHelper = {
  engagementMessageOverTimeChartOptions: (messageCountList, channels) => {
    let optionsArr = [];

    //filtering out the channels which have messages on more than 1 date
    messageCountList.sort((item1, item2) => item1.channelId - item2.channelId);
    for (let i = 0; i < messageCountList.length; i++) {
      if (messageCountList.length < 2) break;
      if (
        i === 0 &&
        messageCountList[i].channelId === messageCountList[i + 1].channelId
      ) {
        optionsArr.push(messageCountList[i]);
        continue;
      }
      if (i === messageCountList.length - 1) {
        if (messageCountList[i].channelId === messageCountList[i - 1].channelId)
          optionsArr.push(messageCountList[i]);
        continue;
      }
      if (
        messageCountList[i].channelId === messageCountList[i - 1].channelId ||
        messageCountList[i].channelId === messageCountList[i + 1].channelId
      )
        optionsArr.push(messageCountList[i]);
    }

    //sort the array on the basis of date and creating details array which contains the graph data
    optionsArr.sort((item1, item2) => item1.timeBucket - item2.timeBucket);
    const details = [],
      store = {};
    let prevDate = -1;
    for (let i = 0; i < optionsArr.length; i++) {
      const date = new Date(optionsArr[i].timeBucket);
      let channelName;
      if (store[optionsArr[i].channelId]) {
        channelName = store[optionsArr[i].channelId];
      } else {
        if (channels.find((item) => item.id === optionsArr[i].channelId))
          channelName = channels.find(
            (item) => item.id === optionsArr[i].channelId
          )["label"];
        else {
          continue;
        }
        store[optionsArr[i].channelId] = channelName;
      }
      if (optionsArr[i].timeBucket !== prevDate) {
        details.push({
          label: [channelName],
          count: [Number(optionsArr[i].count)],
          labelDate: [`${date.getDate()} ${monthNames[date.getMonth()]}`],
        });
        prevDate = optionsArr[i].timeBucket;
      } else {
        if (
          !details[details.length - 1]["label"].find((i) => i === channelName)
        ) {
          details[details.length - 1]["label"].push(channelName);
          details[details.length - 1]["count"].push(
            Number(optionsArr[i].count)
          );
          details[details.length - 1]["labelDate"].push(
            `${date.getDate()} ${monthNames[date.getMonth()]}`
          );
        } else {
          let ind = details[details.length - 1]["label"].findIndex(
            (i) => i === channelName
          );
          details[details.length - 1]["count"][ind] += Number(
            optionsArr[i].count
          );
        }
      }
    }
    //Setting up options for the chart

    const options = {
      plotOptions: {
        series: {
          color: "#008f8d",
        },
      },
      chart: {
        type: "spline",
        backgroundColor: "#22222c",
        style: {
          height: "600",
          width: "1200",
        },
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: details.map((item) => item["labelDate"][0]),
        title: {
          text: "",
        },
        crosshair: {
          color: "#008f8d",
          width: 1,
          dashStyle: "solid",
        },
        labels: {
          style: {
            color: "#008f8d", // Change title color
          },
        },
      },
      yAxis: {
        gridLineWidth: 0,
        title: {
          text: "",
        },
        labels: {
          style: {
            color: "#008f8d", // Change title color
          },
        },
      },
      events: {
        mouseMove: function (e) {
          this.xAxis[0].drawCrosshair(e);
        },
      },
      tooltip: {
        formatter: (e) => {
          let customText = "";
          for (
            let i = 0;
            i < details[e.chart.hoverPoint.index]["label"].length;
            i++
          ) {
            customText += `<b>${
              details[e.chart.hoverPoint.index]["label"][i]
            }</b>`;
            customText += "<br>";
            customText += `${
              details[e.chart.hoverPoint.index]["count"][i]
            } messages on ${details[e.chart.hoverPoint.index]["labelDate"][i]}`;
            customText += "<br>";
          }
          return customText;
        },
        backgroundColor: "black",
        style: {
          color: "white",
        },
      },
      series: [
        {
          data: details.map((item) => {
            let sum = 0;
            for (let i = 0; i < item["count"].length; i++) {
              sum += item["count"][i];
            }
            return sum;
          }),
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500, // Max width at which the rules apply
            },
            chartOptions: {
              chart: {
                style: {
                  height: "60vh",
                  width: "80vw",
                },
              },
            },
          },
        ],
      },
    };
    return options;
  },
};
export default engagementHelper;
