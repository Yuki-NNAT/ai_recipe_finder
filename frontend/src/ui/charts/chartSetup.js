/**
 * Central Chart.js registration. Imported once (via the chart components) so we
 * register elements a single time instead of per-chart.
 */
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

let registered = false;

export function ensureChartsRegistered() {
  if (registered) return;
  ChartJS.register(
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler,
  );
  ChartJS.defaults.font.family = 'Poppins, sans-serif';
  ChartJS.defaults.color = '#777777';
  registered = true;
}
