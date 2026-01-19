import { ResponsiveBar } from "@nivo/bar";

export interface BarChartData {
  [key: string]: string | number;
}

interface NivoBarChartProps {
  data: BarChartData[];
  keys: string[];
  indexBy: string;
  colors?: any;
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: number;
  valueScale?: { type: "linear" | "symlog" };
  indexScale?: { type: "band"; round: boolean };
  axisBottom?: {
    tickSize?: number;
    tickPadding?: number;
    tickRotation?: number;
    legend?: string;
    legendPosition?: "start" | "middle" | "end";
    legendOffset?: number;
  } | null;
  axisLeft?: {
    tickSize?: number;
    tickPadding?: number;
    tickRotation?: number;
    legend?: string;
    legendPosition?: "start" | "middle" | "end";
    legendOffset?: number;
    format?: string | ((value: any) => string);
  } | null;
  enableLabel?: boolean;
  labelSkipWidth?: number;
  labelSkipHeight?: number;
  labelTextColor?: any;
  label?: (d: any) => string;
  enableGridY?: boolean;
  theme?: any;
  tooltip?: (bar: any) => React.ReactNode;
  animate?: boolean;
  motionConfig?: string;
}

const NivoBarChart: React.FC<NivoBarChartProps> = ({
  data,
  keys,
  indexBy,
  colors = { scheme: "nivo" },
  margin = { top: 50, right: 130, bottom: 50, left: 60 },
  padding = 0.3,
  valueScale = { type: "linear" },
  indexScale = { type: "band", round: true },
  axisBottom = {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "Category",
    legendPosition: "middle",
    legendOffset: 32,
  },
  axisLeft = {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "Amount",
    legendPosition: "middle",
    legendOffset: -40,
  },
  enableLabel = true,
  labelSkipWidth = 12,
  labelSkipHeight = 12,
  labelTextColor = { from: "color", modifiers: [["darker", 1.6]] },
  label,
  enableGridY = true,
  theme,
  tooltip,
  animate = true,
  motionConfig = "gentle",
}) => {
  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={margin}
      padding={padding}
      valueScale={valueScale}
      indexScale={indexScale}
      colors={colors}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottom}
      axisLeft={axisLeft}
      labelSkipWidth={labelSkipWidth}
      labelSkipHeight={labelSkipHeight}
      labelTextColor={labelTextColor}
      label={label}
      enableLabel={enableLabel}
      enableGridY={enableGridY}
      theme={theme}
      tooltip={tooltip}
      animate={animate}
      motionConfig={motionConfig}
      role="application"
      ariaLabel="Bar chart"
    />
  );
};

export default NivoBarChart;
