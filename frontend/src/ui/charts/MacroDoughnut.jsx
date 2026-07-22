import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ensureChartsRegistered } from './chartSetup';

ensureChartsRegistered();

/**
 * Macro/segment doughnut with an optional centered label. Shared by the
 * Nutrition summary and the Calculator's recommended split.
 *
 * segments: { label, value, color }[]
 */
export default function MacroDoughnut({ segments = [], centerValue, centerLabel, size = 200 }) {
  const data = useMemo(
    () => ({
      labels: segments.map((s) => s.label),
      datasets: [
        {
          data: segments.map((s) => s.value),
          backgroundColor: segments.map((s) => s.color),
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    }),
    [segments],
  );

  const options = {
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}g` },
        padding: 10,
        cornerRadius: 12,
        backgroundColor: '#202020',
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <Doughnut data={data} options={options} />
      {(centerValue || centerLabel) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="font-display text-2xl font-bold text-ink">{centerValue}</span>
          )}
          {centerLabel && <span className="text-xs text-muted">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
