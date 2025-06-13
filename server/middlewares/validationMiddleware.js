import { body, param, validationResult } from "express-validator";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import Quiz from "../models/Quiz.js";
import mongoose from "mongoose";

export const withValidationErrors = (validateValues) => {
  return [
    ...validateValues,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateQuiz = withValidationErrors([
  body("title").notEmpty().withMessage("title is required"),

  body("description").notEmpty().withMessage("description is required"),

  body("questions")
    .isArray({ min: 1 })
    .withMessage("at least one question is required"),

  body("questions.*.questionText")
    .notEmpty()
    .withMessage("question text is required"),

  body("questions.*.answers")
    .isArray({ min: 2 })
    .withMessage("each question must have at least 2 answers"),

  body("questions.*.answers.*.text")
    .notEmpty()
    .withMessage("answer text is required"),

  body("questions.*.answers.*.isCorrect")
    .isBoolean()
    .withMessage("isCorrect must be a boolean"),

  body("questions.*.answers").custom((answers) => {
    const hasCorrect = answers.some((a) => a.isCorrect === true);
    if (!hasCorrect) {
      throw new Error("each question must have at least one correct answer");
    }
    return true;
  }),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid mongodb id");

    const quiz = await Quiz.findById(value);
    if (!quiz) throw new NotFoundError(`no quiz with is ${value}`);
  }),
]);
