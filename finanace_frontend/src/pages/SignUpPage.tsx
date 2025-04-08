import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React from "react";
import { SignUpFormValues } from "../type/user";
import { Link } from "react-router-dom";

const SignUpSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name cannot exceed 100 characters"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Please provide a valid 10-digit phone number"),

  email: Yup.string()
    .required("Email is required")
    .email("Please provide a valid email address")
    .max(255, "Email cannot exceed 255 characters"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const SignUpPage: React.FC = () => {
  const initialValues: SignUpFormValues = {
    full_name: "",
    email: "",
    password: "",
    phone: "",
  };
  const handleSubmit = (values: SignUpFormValues) => {
    console.log(values);
  };

  return (
    <div className="mt-10 flex flex-col justify-center items-center">
      {/* Geometric Shapes for Background Effect */}
      <div className="geometric-shape geometric-triangle w-64 h-64 top-16 -left-32 rotate-12"></div>
      <div className="geometric-shape geometric-diamond w-80 h-80 bottom-16 -right-40"></div>
      
      <div className="card w-full max-w-md z-10">
        <h1 className="text-3xl font-bold text-center mb-8">Sign up with email</h1>
        
        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-6">
            <div className="space-y-4">
              <div>
                <Field
                  name="full_name"
                  type="text"
                  placeholder="Full Name"
                  className="form-input"
                />
                <ErrorMessage
                  name="full_name"
                  component="div"
                  className="form-error"
                />
              </div>
              
              <div>
                <Field
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  className="form-input"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="form-error"
                />
              </div>
              
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
                <p className="form-helper-text">
                  Password must include at least 8 characters with uppercase, lowercase, number, and special character.
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                Create Account
              </button>
            </div>
            
            <div className="text-center text-sm">
              <span className="text-[rgb(var(--color-muted))]">Already have an account? </span>
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

export default SignUpPage;
   