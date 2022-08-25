import { Validator } from "./validator";

export namespace CommonRules {
  export namespace StringMustBeURL {
    export const Error = "string-not-url" as const;
    export const Rule: Validator.Rule<string, typeof Error> = (str: string) => {
      try {
        new URL(str);
        return null;
      } catch (err) {
        return Error;
      }
    };
  }

  export namespace StringNotEmpty {
    export const Error = "string-empty" as const;
    export const Rule: Validator.Rule<string, typeof Error> = (str: string) => (str.length > 0 ? null : Error);
  }
}
