import NivoBarChart, { BarChartData } from "./NivoBarChart";
import BarChartTooltip from "./BarChartTooltip";

export interface CategorySpendData {
  category_name: string;
  total: number;
}

interface SpendByCategoryChartProps {
  data: CategorySpendData[];
  currency?: string;
  height?: string | number;
}

const SpendByCategoryChart: React.FC<SpendByCategoryChartProps> = ({
  data,
  currency = "DKK",
  height = 400,
}) => {
  // Transform data for Nivo bar chart
  const chartData: BarChartData[] = data.map((item) => ({
    category: item.category_name,
    amount: item.total,
  }));

  // Custom theme for the chart
  const theme = {
    axis: {
      ticks: {
        text: {
          fill: "#e5e7eb",
          fontSize: 12,
        },
      },
      legend: {
        text: {
          fill: "#f3f4f6",
          fontSize: 14,
          fontWeight: 600,
        },
      },
    },
    grid: {
      line: {
        stroke: "rgb(var(--color-border))",
        strokeWidth: 1,
      },
    },
    labels: {
      text: {
        fill: "#f9fafb",
        fontSize: 11,
        fontWeight: 600,
      },
    },
    tooltip: {
      container: {
        background: "rgb(var(--color-card))",
        color: "rgb(var(--color-text))",
        fontSize: 12,
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "8px 12px",
      },
    },
  };

  // Return empty state if no data
  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-[rgb(var(--color-muted))]"
      >
        No spending data available
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <NivoBarChart
        data={chartData}
        keys={["amount"]}
        indexBy="category"
        colors={["#60a5fa"]}
        margin={{ top: 20, right: 20, bottom: 60, left: 70 }}
        padding={0.3}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: `Spending (${currency})`,
          legendPosition: "middle",
          legendOffset: -55,
          format: (value) => `${value.toLocaleString()}`,
        }}
        enableLabel={false}
        theme={theme}
        tooltip={(bar: any) => (
          <BarChartTooltip
            id={bar.id}
            value={bar.value}
            color={bar.color}
            currency={currency}
          />
        )}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
};

export default SpendByCategoryChart;