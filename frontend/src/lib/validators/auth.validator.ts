import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Enter valid email")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const signUpSchema = yup.object({
  email: yup
    .string()
    .email("Enter valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export type SignUpFormValues = yup.InferType<typeof signUpSchema>;

function submit({ email, password }: SignUpFormValues) {
  console.log("Email:", email);
  console.log("Password:", password);

  // TODO: Call your signup API here
}