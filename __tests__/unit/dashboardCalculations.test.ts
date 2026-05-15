import { getDashboardMetrics, getGoalProgress } from '@/features/dashboard/model/calculations';
import { getDemoDashboardSummary } from '@/shared/testing/demoData';

describe('dashboard calculations', () => {
  it('calculates goal progress with a capped percentage', () => {
    expect(getGoalProgress(50, 100)).toBe(50);
    expect(getGoalProgress(150, 100)).toBe(100);
    expect(getGoalProgress(10, 0)).toBe(0);
  });

  it('builds financial metrics from dashboard summary', () => {
    const metrics = getDashboardMetrics(getDemoDashboardSummary());

    expect(metrics.totalBalance).toBe(12250);
    expect(metrics.monthExpenses).toBe(624);
    expect(metrics.monthBalance).toBe(5176);
    expect(metrics.totalUsage).toBe(33);
    expect(metrics.pulseLabel).toBe('Pod kontrolą');
  });
});
