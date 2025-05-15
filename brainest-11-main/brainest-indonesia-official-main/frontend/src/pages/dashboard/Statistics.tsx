import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "TPS Batch 1", value: 120 },
  { name: "TKA Saintek", value: 95 },
  { name: "TKA Soshum", value: 80 },
  { name: "UTBK Lengkap", value: 140 },
  { name: "Kebumian", value: 40 },
];

const CustomTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-900/90 text-white rounded-lg px-4 py-2 shadow-lg border border-cyan-400">
        <div className="font-bold">{label}</div>
        <div className="text-lg font-extrabold">{payload[0].value} Pengguna</div>
      </div>
    );
  }
  return null;
};

export default function Statistics() {
  return (
    <Card className="bg-blue-3d/80 rounded-2xl shadow-3d p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white mb-2">Statistik Penggunaan Paket</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} barCategoryGap={30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#cbd5e1" fontWeight={600} />
            <YAxis stroke="#cbd5e1" fontWeight={600} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[12, 12, 0, 0]}
              isAnimationActive={true}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.7} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 