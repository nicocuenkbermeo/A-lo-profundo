"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

interface StatChartProps {
  data: { name: string; value: number }[]
  type?: "line" | "bar" | "area"
  color?: string
  height?: number
}

export function StatChart({
  data,
  type = "line",
  color = "#f59e0b",
  height = 250,
}: StatChartProps) {
  const axisStyle = { fontSize: 11, fill: "hsl(var(--muted-foreground))" }
  const gridStyle = { stroke: "hsl(var(--border))", strokeDasharray: "3 3" }

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "#13131a",
      border: "1px solid hsl(var(--border))",
      borderRadius: 8,
      fontSize: 12,
    },
    labelStyle: { color: "hsl(var(--muted-foreground))" },
  }

  const common = (
    <>
      <CartesianGrid {...gridStyle} />
      <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
      <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
      <Tooltip {...tooltipStyle} />
    </>
  )

  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === "bar" ? (
        <BarChart data={data}>
          {common}
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : type === "area" ? (
        <AreaChart data={data}>
          {common}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#areaGrad)"
          />
        </AreaChart>
      ) : (
        <LineChart data={data}>
          {common}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}
