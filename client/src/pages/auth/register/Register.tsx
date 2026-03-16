import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/provider/useAuth";
import api from "@/api/API";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { User, Mail, Lock, ArrowRight } from "lucide-react";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await api.post("/auth/register", data);
      setUser(res.data.user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/dnlejaujc/image/upload/v1773636351/register_bg_xywyxg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-xl">

        {/* LEFT IMAGE */}
        <div className="hidden md:flex w-1/2 relative">

          <img
            src="https://res.cloudinary.com/dnlejaujc/image/upload/v1773637768/login_side_image_zrgr9v.jpg"
            alt="Register"
            className="w-full h-full object-cover"
          />

          {/* TEXT OVER IMAGE */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">

            <h2 className="text-3xl font-bold mb-2">
              Create Account
            </h2>

            <p className="text-sm text-white/80 max-w-xs">
              Welcome to Albax. Discover premium products and enjoy
              a seamless shopping experience.
            </p>

          </div>
        </div>

        {/* FORM SIDE */}
        <div className="w-full md:w-1/2 p-8 text-white">

          <div className="text-center mb-6 uppercase">
            <h2 className="text-2xl font-semibold">
              Register
            </h2>

            <p className="text-white/70 text-sm  tracking-widest">
              Join Albax today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="text-sm flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                Full Name
              </label>

              <Input
                placeholder="John Doe"
                className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                {...register("name", { required: "Name is required" })}
              />

              {errors.name && (
                <p className="text-red-400 text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                Email
              </label>

              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                {...register("email", { required: "Email is required" })}
              />

              {errors.email && (
                <p className="text-red-400 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4" />
                Password
              </label>

              <Input
                type="password"
                placeholder="••••••••"
                className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                {...register("password", { required: "Password is required" })}
              />

              {errors.password && (
                <p className="text-red-400 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>

          </form>

          <p className="text-sm text-white/70 mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 font-semibold"
            >
              Sign in <ArrowRight className="inline w-3 h-3" />
            </Link>
          </p>

        </div>
      </div>
    </section>
  );
};

export default Register;