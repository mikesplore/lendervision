'use client'

import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface EligibilityGaugeProps {
  score: number;
  tier: string;
}

export function EligibilityGauge({ score, tier }: EligibilityGaugeProps) {
  const getColor = (value: number) => {
    if (value > 80) return '#2ECC71'; // accent
    if (value > 60) return '#3498DB'; // primary
    if (value > 40) return '#f1c40f'; // yellow
    return '#e74c3c'; // red
  };

  const data = [{ name: 'score', value: score, fill: getColor(score) }];

  return (
    <div className="w-48 h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
            data={data}
            startAngle={90}
            endAngle={-270}
            >
            <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
            />
            <RadialBar
                background={{ fill: 'hsl(var(--muted))' }}
                dataKey="value"
                cornerRadius={10}
            />
            </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: getColor(score) }}>{score}</span>
            <span className="text-sm font-semibold text-muted-foreground">{tier}</span>
            <span className="text-xs text-muted-foreground/70">Eligibility Score</span>
        </div>
    </div>
  );
}
