import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import joi from 'joi';
import { verifyJwtToken } from '../../config/jwt';
import { findCompanyByIdRepository } from '../../domain/company/repository/company.repository';

export const validateCompanyToken = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(StatusCodes.FORBIDDEN).send({ status: false, message: 'Authorization Token is required', data: null });
  }

  const { authorization } = req.headers;

  const schema = joi
    .object()
    .keys({
      authorization: joi
        .string()
        .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required()
        .label('authorization [header]'),
    })
    .unknown(true);
  try {
    await schema.validateAsync(req.headers);
    const [, token] = authorization.split('Bearer ');
    const company: any = verifyJwtToken(token);

    // Get company data from the token
    const companyData = await findCompanyByIdRepository(company.payload.createdBy);

    if (companyData) {
      req.currentCompany = companyData;
    }

    return next();
  } catch (error) {
    return res.status(StatusCodes.FORBIDDEN).send({
      status: false,
      message: 'Invalid or no Authorization Token was provided.',
      data: null,
    });
  }
};
