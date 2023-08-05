import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import engagementHelper from "../helper/EngagementHelper";
import channels from "../data/channels";
import messageCountList from "../data/MessageCountList";
const EngagementMessagesOverTime = () => {
  const options = engagementHelper.engagementMessageOverTimeChartOptions(
    messageCountList,
    channels
  );
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default EngagementMessagesOverTime;
