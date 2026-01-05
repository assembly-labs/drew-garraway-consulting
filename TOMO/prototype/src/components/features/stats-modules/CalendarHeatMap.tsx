/**
 * Calendar Heat Map - White Belt Stats Module
 *
 * GitHub-style contribution graph showing training consistency.
 * Critical for habit formation during the white belt dropout phase.
 *
 * Design: Grid of cells colored by training intensity
 * Data: Array of session dates or sessionsByDate map
 */

import { useMemo } from 'react';

interface CalendarHeatMapProps {
  /** Map of date strings (YYYY-MM-DD) to session counts */
  sessionsByDate: Record<string, number>;
  /** Number of weeks to display (default 13 = ~3 months) */
  weeks?: number;
  /** Total sessions count to display */
  totalSessions?: number;
  /** Average sessions per week */
  avgPerWeek?: number;
}

export function CalendarHeatMap({
  sessionsByDate,
  weeks = 13,
  totalSessions,
  avgPerWeek,
}: CalendarHeatMapProps) {
  // Generate the grid data
  const gridData = useMemo(() => {
    const today = new Date();
    const grid: { date: Date; level: number; dateStr: string }[][] = [];

    // Calculate start date (weeks ago, aligned to Monday)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (weeks * 7) + 1);
    // Align to Monday
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToMonday);

    // Generate weeks
    const currentDate = new Date(startDate);
    for (let w = 0; w < weeks; w++) {
      const week: { date: Date; level: number; dateStr: string }[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const sessionCount = sessionsByDate[dateStr] || 0;

        // Determine intensity level (0-4)
        let level = 0;
        if (sessionCount >= 3) level = 4;
        else if (sessionCount === 2) level = 3;
        else if (sessionCount === 1) level = 2;
        else if (sessionCount > 0) level = 1;

        week.push({
          date: new Date(currentDate),
          level,
          dateStr,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      grid.push(week);
    }

    return grid;
  }, [sessionsByDate, weeks]);

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; position: number }[] = [];
    let lastMonth = -1;

    gridData.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0].date;
      const month = firstDayOfWeek.getMonth();

      if (month !== lastMonth) {
        labels.push({
          month: firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' }),
          position: weekIndex,
        });
        lastMonth = month;
      }
    });

    return labels;
  }, [gridData]);

  // Calculate stats if not provided
  const stats = useMemo(() => {
    if (totalSessions !== undefined && avgPerWeek !== undefined) {
      return { total: totalSessions, avg: avgPerWeek };
    }

    let total = 0;
    Object.values(sessionsByDate).forEach((count) => {
      total += count;
    });

    return {
      total,
      avg: Math.round((total / weeks) * 10) / 10,
    };
  }, [sessionsByDate, weeks, totalSessions, avgPerWeek]);

  const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

  return (
    <section style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>{stats.total} Sessions</div>
          <div style={styles.subtitle}>Avg {stats.avg} per week</div>
        </div>
      </div>

      {/* Month labels */}
      <div style={styles.monthLabels}>
        <div style={{ width: 28 }} /> {/* Spacer for day labels */}
        {monthLabels.map((label, i) => (
          <div
            key={i}
            style={{
              ...styles.monthLabel,
              marginLeft: i === 0 ? 0 : `${(label.position - (monthLabels[i - 1]?.position || 0) - 1) * 16}px`,
            }}
          >
            {label.month}
          </div>
        ))}
      </div>

      {/* Grid container */}
      <div style={styles.gridContainer}>
        {/* Day labels */}
        <div style={styles.dayLabels}>
          {dayLabels.map((label, i) => (
            <div key={i} style={styles.dayLabel}>
              {label}
            </div>
          ))}
        </div>

        {/* Heat map grid */}
        <div style={styles.grid}>
          {gridData.map((week, weekIndex) => (
            <div key={weekIndex} style={styles.week}>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  style={{
                    ...styles.cell,
                    ...getCellStyle(day.level),
                  }}
                  title={`${day.dateStr}: ${sessionsByDate[day.dateStr] || 0} session(s)`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <span style={styles.legendLabel}>Less</span>
        <div style={styles.legendCells}>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              style={{
                ...styles.legendCell,
                ...getCellStyle(level),
              }}
            />
          ))}
        </div>
        <span style={styles.legendLabel}>More</span>
      </div>
    </section>
  );
}

// Get cell background color based on level
function getCellStyle(level: number): React.CSSProperties {
  switch (level) {
    case 0:
      return { background: 'var(--color-gray-800)' };
    case 1:
      return { background: 'rgba(34, 197, 94, 0.25)' };
    case 2:
      return { background: 'rgba(34, 197, 94, 0.5)' };
    case 3:
      return { background: 'rgba(34, 197, 94, 0.75)' };
    case 4:
      return { background: 'var(--color-positive)' };
    default:
      return { background: 'var(--color-gray-800)' };
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'var(--color-gray-900)',
    padding: 'var(--space-lg)',
    marginBottom: '1px',
    overflowX: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-lg)',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--color-white)',
  },
  subtitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-400)',
    marginTop: '2px',
  },
  monthLabels: {
    display: 'flex',
    marginBottom: 'var(--space-xs)',
    paddingLeft: '4px',
  },
  monthLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-gray-500)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    minWidth: '52px',
  },
  gridContainer: {
    display: 'flex',
    gap: '4px',
  },
  dayLabels: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    marginRight: '4px',
  },
  dayLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: 'var(--color-gray-600)',
    height: '12px',
    lineHeight: '12px',
    width: '24px',
  },
  grid: {
    display: 'flex',
    gap: '4px',
  },
  week: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  cell: {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'transform 0.1s',
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: 'var(--space-md)',
    justifyContent: 'flex-end',
  },
  legendLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--color-gray-500)',
  },
  legendCells: {
    display: 'flex',
    gap: '3px',
  },
  legendCell: {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
  },
};

export default CalendarHeatMap;
