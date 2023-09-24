import { JwtPayload } from 'jsonwebtoken';

export type GenerateJwtToken = (payload: string | object) => Promise<string>;
export type HashPassword = (password: string) => Promise<string>;
export type ComparePassword = (hashPassword: string, password: string) => Promise<boolean>;
export type VerifyJwtToken = (token: string) => string | JwtPayload;
