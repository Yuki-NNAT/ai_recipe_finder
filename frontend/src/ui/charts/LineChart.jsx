import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { colors } from '@/theme/tokens';
import { ensureChartsRegistered } from './chartSetup';

ensureChartsRegistered();

/** Smooth area line chart for trends (e.g. user signups over time). */
export default function LineChart({ labels = [], values = [], height = 260, color = colors.primary }) {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          borderColor: color,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: color,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          backgroundColor: (ctx) => {
            const { ctx: c, chartArea } = ctx.chart;
            if (!chartArea) return 'transparent';
            const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            g.addColorStop(0, 'rgba(255,79,135,0.22)');
            g.addColorStop(1, 'rgba(255,79,135,0)');
            return g;
          },
        },
      ],
    }),
    [labels, values, color],
  );

  const options = {
    plugins: { legend: { display: false }, tooltip: { padding: 10, cornerRadius: 12, backgroundColor: '#202020' } },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { beginAtZero: true, border: { display: false }, grid: { color: 'rgba(255,79,135,0.08)' }, ticks: { maxTicksLimit: 5 } },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}
