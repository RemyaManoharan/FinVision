import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { LoginFormValues } from "../type/user";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useState } from "react";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [loginError, setLoginError] = useState(false);

  const { mutate, isError } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.token) {
        signIn({
          auth: {
            token: data.token,
            type: "Bearer",
          },
          userState: data.user,
        });
        navigate("/dashboard");
      } else {
        console.error("Login failed:", data.message);
      }
    },
    onError: (error) => {
      setLoginError(
        (error as any)?.response?.data?.message || "Login failed. Try again."
      );
    },
  });

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
    
  });
  const handleSubmit = (values: LoginFormValues) => {
    mutate(values);
  };
  return (
    <div className="mt-10 flex flex-col justify-center items-center">
      {/* Geometric Shapes for Background Effect */}
      <div className="geometric-shape geometric-triangle w-64 h-64 top-16 -left-32 rotate-12"></div>
      <div className="geometric-shape geometric-diamond w-80 h-80 bottom-16 -right-40"></div>

      <div className="card w-full max-w-md z-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          Login to Your Account
        </h1>
        {loginError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {loginError}
          </div>
        )}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-6">
            <div className="space-y-4">
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="form-input"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="form-error"
                />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="form-input"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="form-error"
                />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-[rgb(var(--color-muted))]">
                Don't have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-dark))] font-medium"
              >
                Log in
              </Link>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
