// // src/middleware/validationMiddleware.ts

// import { plainToInstance } from 'class-transformer';
// import { validate, ValidationError } from 'class-validator';
// import { Request, Response, NextFunction, Handler } from 'express';

// interface CombinedError {
//   dto: string;
//   errors: ValidationError[];
// }

// export function validationMiddleware(types: any[], skipMissingProperties = false): any {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const validations = types.map((type) => plainToInstance(type, req.body));
//     const errors = await Promise.all(validations.map((dto, index) => validate(dto, { skipMissingProperties })));

//     const hasErrors = errors.some((errorArray) => errorArray.length > 0);

//     if (hasErrors) {
//       const combinedErrors: CombinedError[] = errors.reduce((acc, errorArray, index) => {
//         if (errorArray.length > 0) {
//           // Extract the class name from the target property
//           const className = types[index].name;

//           acc.push({ dto: className, errors: errorArray });
//         }
//         return acc;
//       }, [] as CombinedError[]);

//       return res.status(400).json({ errors: combinedErrors });
//     }

//     req.body = validations;
//     next();
//   };
// }


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