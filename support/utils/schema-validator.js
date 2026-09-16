import { expect } from "@playwright/test";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({
  allErrors: true,
  verbose: true
});

addFormats(ajv);

export function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  const message = isValid ? '' : `Violações de contrato encontradas:\n${JSON.stringify(validate.errors, null, 2)}`;

  expect(isValid, message).toBeTruthy();
}