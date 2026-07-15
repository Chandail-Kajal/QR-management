import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Enter valid email").required("Email is required"),

  password: yup.string().required("Password is required"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const signUpSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export type SignUpFormValues = yup.InferType<typeof signUpSchema>;
