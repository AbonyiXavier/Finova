import * as Joi from 'joi';
import { validate as validateUuid } from 'uuid';

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
export const selectKeys = (object:  Record<string, any>, keys: any[]): Record<string, any> => {
    return keys.reduce((obj, key) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        obj[key] = object[key];
      }
      return obj;
    }, {});
  };

  export const uuidValidator = (value: string, helpers: Joi.CustomHelpers<any>) => {
    if (!validateUuid(value)) {
      return helpers.error('Invalid ID');
    }
    return value;
  };
  