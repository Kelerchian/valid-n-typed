import { Validator, CommonRules } from "valid-n-typed";
import type { TypeUtils } from "valid-n-typed";

const someURLString = "some://url";
const nonURLString = "not-some-url";
const emptyString = "";

const validator = Validator.makeBuilder<string>()
  // the string must be a URL
  .addRule(CommonRules.StringMustBeURL.Rule)
  // the string must not be empty
  .addRule(CommonRules.StringNotEmpty.Rule)
  .build();

const urlStringErrors = validator.validate(someURLString);
const nonURLStringErrors = validator.validate(nonURLString);
const emptyStringErrors = validator.validate(emptyString);

console.log(urlStringErrors.length === 0);
// true

console.log(nonURLStringErrors.includes(CommonRules.StringMustBeURL.Error));
// true

console.log(emptyStringErrors.includes(CommonRules.StringNotEmpty.Error));
// true

export type ErrorUnionType = TypeUtils.ErrOf<typeof validator>;
// "string-not-url" | "string-empty"

export type ValType = TypeUtils.ValOf<typeof Validator>;
// string
