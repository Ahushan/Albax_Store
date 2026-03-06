import { useEffect, useState } from "react";
import api from "@/api/API";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Shield, Mail } from "lucide-react";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users");
      setUsers(data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id: string) => {
    try {
      const { data } = await api.patch(`/users/${id}/status`);
      toast.success(data.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u)),
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Users</h1>
        <span className="text-sm text-gray-500 flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          {users.length} total
        </span>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <Card
            key={user._id}
            className="bg-gray-900 border-gray-800 hover:border-gray-700 transition"
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    user.isActive
                      ? "bg-linear-to-br from-indigo-500 to-purple-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{user.name}</p>
                    <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full capitalize flex items-center gap-1 border border-gray-700">
                      <Shield className="w-2.5 h-2.5" />
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-600 hidden sm:inline">
                  {new Date(user.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleStatus(user._id)}
                  className={`text-xs rounded-lg ${
                    user.isActive
                      ? "bg-green-900/30 text-green-400 hover:bg-green-900/50 hover:text-green-300"
                      : "bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300"
                  }`}
                >
                  {user.isActive ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 mr-1" /> Active
                    </>
                  ) : (
                    <>
                      <UserX className="w-3.5 h-3.5 mr-1" /> Inactive
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
