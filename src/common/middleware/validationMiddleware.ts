
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { selectKeys } from "../modifier";

export const validationMiddleware =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = selectKeys(schema, ["params", "query", "body"]);
    const object = selectKeys(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(object);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      return res.status(StatusCodes.BAD_REQUEST).send({ success: false, message: errorMessage });
    }

    Object.assign(req, value);
    
    return next();
  };
