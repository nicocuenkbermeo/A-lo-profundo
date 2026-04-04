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
  color = "#C41E3A",
  height = 250,
}: StatChartProps) {
  const axisStyle = { fontSize: 11, fill: "#3D2B1F", fontFamily: "var(--font-display)" }
  const gridStyle = { stroke: "#8B7355", strokeOpacity: 0.2, strokeDasharray: "3 3" }

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "#0D2240",
      border: "2px solid #8B7355",
      borderRadius: 2,
      fontSize: 12,
      color: "#FDF6E3",
      fontFamily: "var(--font-mono)",
    },
    labelStyle: { color: "#F5C842", fontFamily: "var(--font-display)" },
  }

  const common = (
    <>
      <CartesianGrid {...gridStyle} />
      <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: "#8B7355" }} tickLine={false} />
      <YAxis tick={axisStyle} axisLine={{ stroke: "#8B7355" }} tickLine={false} width={40} />
      <Tooltip {...tooltipStyle} />
    </>
  )

  return (
    <div className="bg-[#FDF6E3] border-2 border-[#8B7355] rounded-sm p-4 shadow-[2px_2px_0px_#5C4A32]">
      <ResponsiveContainer width="100%" height={height}>
        {type === "bar" ? (
          <BarChart data={data}>
            {common}
            <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
          </BarChart>
        ) : type === "area" ? (
          <AreaChart data={data}>
            {common}
            <defs>
              <linearGradient id="vintageAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.1} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill="url(#vintageAreaGrad)"
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
              dot={{ fill: color, r: 3, stroke: "#FDF6E3", strokeWidth: 1 }}
              activeDot={{ r: 5, fill: "#F5C842", stroke: color }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
