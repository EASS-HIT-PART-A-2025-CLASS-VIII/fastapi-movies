import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUpRight, Hash, TrendingUp, Wallet } from 'lucide-react';
import apiClient from '../api/client';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/transactions')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const total = data.reduce((acc, curr) => acc + curr.amount, 0);
  const avg = data.length > 0 ? total / data.length : 0;

  const chartData = Object.values(
    data.reduce((acc: any, curr) => {
      if (!acc[curr.category]) acc[curr.category] = { name: curr.category, value: 0 };
      acc[curr.category].value += curr.amount;
      return acc;
    }, {})
  );

  const COLORS = ['#58a6ff', '#238636', '#f85149', '#d29922', '#8b949e'];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Financial Overview</h1>
          <p className="text-[#8b949e] mt-1">Summary of your account activity.</p>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Balance"
          value={`$${total.toFixed(2)}`}
          icon={<Wallet className="text-[#58a6ff]" />}
          color="blue"
        />
        <StatCard
          title="Average Entry"
          value={`$${avg.toFixed(2)}`}
          icon={<TrendingUp className="text-[#238636]" />}
          color="green"
        />

        <StatCard
          title="Total Logs"
          value={data.length.toString()}
          icon={<Hash className="text-[#d29922]" />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART SECTION */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Spending Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT TABLE SECTION */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-[#30363d]">
            <h3 className="text-lg font-semibold text-white">Latest Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0d1117] text-[#8b949e] text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {data.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-[#21262d] transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{t.category}</td>
                    <td className="px-6 py-4 text-right font-mono text-[#58a6ff]">
                      ${t.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 hover:border-[#444c56] transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-[#0d1117] rounded-lg">{icon}</div>
      <ArrowUpRight size={16} className="text-[#8b949e]" />
    </div>
    <p className="text-sm font-medium text-[#8b949e] uppercase tracking-wider">{title}</p>
    <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
  </div>
);
