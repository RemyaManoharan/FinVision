import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const schemas = {
  // User registration schema
  registration: Joi.object({
    name: Joi.string().required().min(2).max(100).messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name cannot exceed 100 characters",
      "any.required": "Name is required",
    }),
    email: Joi.string().required().email().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])"))
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one letter and one number",
        "any.required": "Password is required",
      }),
    phone_number: Joi.string().allow("", null),
  }),

  // User login schema
  login: Joi.object({
    email: Joi.string().required().email().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),

  // Transaction schema
  transaction: Joi.object({
    amount: Joi.number().required().precision(2).messages({
      "number.base": "Amount must be a number",
      "number.precision": "Amount cannot have more than 2 decimal places",
      "any.required": "Amount is required",
    }),
    transaction_date: Joi.date().required().messages({
      "date.base": "Please provide a valid date",
      "any.required": "Transaction date is required",
    }),
    description: Joi.string().allow("", null),
    transaction_type: Joi.string()
      .required()
      .valid("income", "expense")
      .messages({
        "any.only": "Transaction type must be either 'income' or 'expense'",
        "any.required": "Transaction type is required",
      }),
    category_id: Joi.number().integer().required().messages({
      "number.base": "Category ID must be a number",
      "number.integer": "Category ID must be an integer",
      "any.required": "Category ID is required",
    }),
    is_recurring: Joi.boolean().default(false),
  }),

  // Asset schema
  asset: Joi.object({
    name: Joi.string().required().max(100).messages({
      "string.max": "Asset name cannot exceed 100 characters",
      "any.required": "Asset name is required",
    }),
    asset_type: Joi.string().required().max(50).messages({
      "string.max": "Asset type cannot exceed 50 characters",
      "any.required": "Asset type is required",
    }),
    current_value: Joi.number().required().precision(2).messages({
      "number.base": "Current value must be a number",
      "number.precision":
        "Current value cannot have more than 2 decimal places",
      "any.required": "Current value is required",
    }),
    acquisition_date: Joi.date().allow(null),
    notes: Joi.string().allow("", null),
  }),

  // Budget schema
  budget: Joi.object({
    expense_category_id: Joi.number().integer().required().messages({
      "number.base": "Expense category ID must be a number",
      "number.integer": "Expense category ID must be an integer",
      "any.required": "Expense category ID is required",
    }),
    amount: Joi.number().required().precision(2).positive().messages({
      "number.base": "Budget amount must be a number",
      "number.positive": "Budget amount must be positive",
      "number.precision":
        "Budget amount cannot have more than 2 decimal places",
      "any.required": "Budget amount is required",
    }),
    period: Joi.string().required().valid("monthly", "yearly").messages({
      "any.only": "Period must be either 'monthly' or 'yearly'",
      "any.required": "Period is required",
    }),
    start_date: Joi.date().required().messages({
      "date.base": "Please provide a valid start date",
      "any.required": "Start date is required",
    }),
    end_date: Joi.date().allow(null).min(Joi.ref("start_date")).messages({
      "date.min": "End date must be after start date",
    }),
  }),
};

// Generic validation middleware factory

const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      res.status(400).json({
        message: "Validation error",
        errors: errorMessages,
      });
      return;
    }

    next();
  };
};

// Export validation middleware functions
export const validateRegistration = validateRequest(schemas.registration);
export const validateLogin = validateRequest(schemas.login);
export const validateTransaction = validateRequest(schemas.transaction);
export const validateAsset = validateRequest(schemas.asset);
export const validateBudget = validateRequest(schemas.budget);
