import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  FolderTree,
  PlusCircle,
  List,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navGroups = [
  {
    label: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Commerce",
    items: [
      { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { to: "/admin/product-list", label: "Products", icon: List },
      { to: "/admin/category", label: "Categories", icon: FolderTree },
    ],
  },
  {
    label: "Create",
    items: [
      { to: "/admin/product", label: "Add Product (V1)", icon: PlusCircle },
      {
        to: "/admin/create-product",
        label: "Add Product (V2)",
        icon: Sparkles,
      },
    ],
  },
  {
    label: "Management",
    items: [
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen bg-gray-950">
        {/* Sidebar */}
        <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
          <div className="p-5">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-500 hover:text-white text-xs transition mb-4 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />{" "}
              Back to Store
            </Link>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              Admin
            </h1>
          </div>

          <nav className="flex-1 px-3 pb-4 space-y-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[11px] text-gray-600 uppercase tracking-wider font-semibold px-3 mb-2">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;
                    return (
                      <Tooltip key={item.to}>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.to}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isActive
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
};

export default AdminLayout;
