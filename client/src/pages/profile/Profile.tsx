import { useState } from "react";
import { useAuth } from "@/context/provider/useAuth";
import { useForm } from "react-hook-form";
import api from "@/api/API";
import toast from "react-hot-toast";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Mail, Shield, Save, KeyRound } from "lucide-react";

interface ProfileForm {
  name: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user, setUser } = useAuth();

  const profileForm = useForm<ProfileForm>({
    defaultValues: { name: user?.name || "", email: user?.email || "" },
  });

  const passwordForm = useForm<PasswordForm>();

  const onUpdateProfile = async (data: ProfileForm) => {
    try {
      const res = await api.put("/users/me", data);
      setUser(res.data.user);
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await api.put("/users/me/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      passwordForm.reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Profile card */}
        <Card className="border-0 shadow-lg bg-linear-to-r from-indigo-500 to-purple-600 text-white mb-8 overflow-hidden">
          <CardContent className="flex items-center gap-5 p-6 relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-white/75 text-sm flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </p>
              <span className="inline-flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full mt-2 capitalize">
                <Shield className="w-3 h-3" />
                {user?.role}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <User className="w-4 h-4" /> Profile
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Lock className="w-4 h-4" /> Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" /> Personal
                  Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={profileForm.handleSubmit(onUpdateProfile)}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      className="h-11 bg-gray-50/50"
                      {...profileForm.register("name", {
                        required: "Name is required",
                      })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-indigo-500" /> Email
                    </label>
                    <Input
                      type="email"
                      className="h-11 bg-gray-50/50"
                      {...profileForm.register("email", {
                        required: "Email is required",
                      })}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={profileForm.formState.isSubmitting}
                    className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg"
                  >
                    {profileForm.formState.isSubmitting ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-indigo-500" /> Change
                  Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={passwordForm.handleSubmit(onChangePassword)}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      className="h-11 bg-gray-50/50"
                      {...passwordForm.register("currentPassword", {
                        required: "Required",
                      })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <Input
                      type="password"
                      className="h-11 bg-gray-50/50"
                      {...passwordForm.register("newPassword", {
                        required: "Required",
                        minLength: { value: 6, message: "Min 6 characters" },
                      })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      className="h-11 bg-gray-50/50"
                      {...passwordForm.register("confirmPassword", {
                        required: "Required",
                      })}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={passwordForm.formState.isSubmitting}
                    className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg"
                  >
                    {passwordForm.formState.isSubmitting ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
