"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import {
  SignUpFormValues,
  signUpSchema,
} from "@/lib/validators/auth.validator";
import { ApiResponse } from "@/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const methods = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      setLoading(true);

      await api.post("/auth/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      toast.success("Account created successfully!");

      router.push("/login");
    } catch (error: unknown) {
      console.error(error);

      toast.error(
        (error as AxiosError<ApiResponse<{ data: unknown }>>)?.response?.data
          ?.message ?? "Unable to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
        </CardHeader>

        <FormProvider {...methods}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  {...register("name")}
                  placeholder="Enter your name"
                  disabled={loading}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  {...register("email")}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Create a password"
                  disabled={loading}
                />
                <FieldError>{errors.password?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <Input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <FieldError>{errors.confirmPassword?.message}</FieldError>
              </Field>

              <Button
                type="submit"
                className="h-10 w-full"
                size="lg"
                disabled={loading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
              <Link
                href={"/login"}
                className="text-sm w-full text-right cursor-pointer text-primary font-medium"
              >
                Already have account? login now.
              </Link>
            </form>
          </CardContent>
        </FormProvider>
      </Card>
    </div>
  );
}
