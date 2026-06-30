"use client";

import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Import Base UI shadcn field primitives instead of Radix form wrappers
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { LoginFormValues, loginSchema } from "@/lib/validators/auth.validator";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/axios";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const methods = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", values);
      setAuth(response.data.data);
      router.push("/admin/qr-codes");
    } catch (error) {
      console.error("Login failed:", error);
      setError("root", {
        message: "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>QR Platform Login</CardTitle>
        </CardHeader>

        <FormProvider {...methods}>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit, (errors) =>
                console.log("errors", errors),
              )}
              className="space-y-5"
            >
              {/* Global/Root Error Alert */}
              {errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {errors.root.message}
                </p>
              )}

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  {...register("email")}
                  placeholder="admin@example.com"
                  disabled={loading}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  {...register("password")}
                  disabled={loading}
                />
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>

              <Button
                type="submit"
                className="w-full h-10"
                size={"lg"}
                disabled={loading}
              >
                <LogIn />
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </FormProvider>
      </Card>
    </div>
  );
}
