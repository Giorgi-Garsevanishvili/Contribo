import { Prisma } from "@prisma/client";
import { LogicError } from "./logicError";
import { ZodError } from "zod";

export function handleError(error: unknown): {
  status: number;
  message: string | object;
} {
  // Prisma known errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2025":
        return { status: 404, message: "Record not found." };
      case "P2002":
        return {
          status: 409,
          message: "Duplicate entry. Unique constraint failed.",
        };
      case "P2003":
        return { status: 400, message: "Foreign key constraint failed." };
      default:
        return { status: 500, message: `Database error: ${error.code}` };
    }
  }

  //zod errors
  if (error instanceof ZodError) {
    return {
      status: 400,
      message: {
        errors: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    };
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return { status: 400, message: "Validation error. Check your input." };
  }

  // Own Application Logic Error
  if (error instanceof LogicError) {
    return { status: error.statusCode, message: error.message };
  }

  // Native JS error
  if (error instanceof Error) {
    return { status: 500, message: error.message };
  }

  // Fallback for unknown types
  return { status: 500, message: "Unknown server error." };
}
