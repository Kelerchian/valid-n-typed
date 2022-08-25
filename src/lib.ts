import { Validator } from "./validator";

export { Validator };
export { CommonRules } from "./common-validations";
export namespace TypeUtils {
  export type ValOf<MaybeValidator> = MaybeValidator extends Validator.Validator<infer Val, infer _Err> ? Val : never;
  export type ErrOf<MaybeValidator> = MaybeValidator extends Validator.Validator<infer _Val, infer Err> ? Err : never;
}
