import { useEffect, useState } from "react";
import api from "@/api/API";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  byStatus: Array<{
    _id: string;
    count: number;
    totalRevenue: number;
  }>;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-blue-500",
  processing: "bg-indigo-500",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  const cards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: Package,
      gradient: "from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-500/20",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-600",
      shadow: "shadow-green-500/20",
    },
    {
      title: "Delivered",
      value: stats?.byStatus?.find((s) => s._id === "delivered")?.count || 0,
      icon: TrendingUp,
      gradient: "from-purple-500 to-violet-600",
      shadow: "shadow-purple-500/20",
    },
    {
      title: "Pending",
      value: stats?.byStatus?.find((s) => s._id === "pending")?.count || 0,
      icon: ShoppingCart,
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className={`bg-linear-to-br ${card.gradient} border-0 text-white shadow-xl ${card.shadow}`}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white/80" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders by Status */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-5 text-white">
            Orders by Status
          </h2>
          <div className="space-y-3">
            {stats?.byStatus?.map((item) => {
              const total = stats.totalOrders || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item._id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="capitalize text-gray-300 flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          statusColors[item._id] || "bg-gray-500"
                        }`}
                      />
                      {item._id}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-white">
                        {item.count}
                      </span>
                      <span className="text-xs text-gray-500 w-24 text-right">
                        ₹{item.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        statusColors[item._id] || "bg-gray-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
