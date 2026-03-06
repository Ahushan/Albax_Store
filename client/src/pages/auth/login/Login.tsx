import { useForm } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/provider/useAuth";
import api from "@/api/API";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogIn, ArrowRight, Sparkles } from "lucide-react";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data);
      setUser(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-30 blur-3xl" />
      </div>

      <Card className="relative max-w-md w-full mx-4 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-500" /> Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-indigo-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-500" /> Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-indigo-500"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-300"
            >
              {isSubmitting ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" /> Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition"
              >
                Create one <ArrowRight className="w-3 h-3 inline" />
              </Link>
            </p>

            <button
              onClick={() => navigate("/")}
              className="text-xs text-gray-400 hover:text-gray-600 transition"
            >
              Continue as Guest
            </button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
