import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { colors } from '@/theme/tokens';
import { ensureChartsRegistered } from './chartSetup';

ensureChartsRegistered();

/**
 * Rounded bar chart for time-series values (e.g. weekly calorie intake).
 * labels + values arrays, with an optional goal reference line via `goal`.
 */
export default function BarChart({ labels = [], values = [], goal, height = 240, color = colors.primary }) {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: values.map((v) => (goal && v > goal ? colors.danger : color)),
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 34,
        },
      ],
    }),
    [labels, values, goal, color],
  );

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { padding: 10, cornerRadius: 12, backgroundColor: '#202020' },
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: 'rgba(255,79,135,0.08)' },
        ticks: { maxTicksLimit: 5 },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}
