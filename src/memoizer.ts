import { Validator } from "./validator";

export namespace Memoizer {
  export type Memoizer<Val, Err> = {
    validate: (val: Val) => Err[];
    getLastValidation: () => Err[] | null;
  };

  /**
   * Function that determine if old value and new value is different
   */
  type DiffFn<Val extends unknown> = (prevVal: Val, nextVal: Val) => boolean;

  /**
   * Configuration of memoizer.
   */
  type Config<Val extends unknown = unknown> = { diffFn: DiffFn<Val> };

  /**
   * Default value for diff, which uses simple boolean comparison
   */
  const defaultDiffFn: DiffFn<unknown> = (prevVal, nextVal) => prevVal !== nextVal;

  /**
   * A Symbol to set the internal memoized value as Uninitialized
   * We cannot use undefined
   */
  export type LastCalculation<Val, Err> =
    | undefined
    | {
        value: Val;
        errors: Err[];
      };

  /**
   * Memoizer constructor
   */
  export const make = <Val, Err>(
    validator: Validator.Validator<Val, Err>,
    options?: Partial<Config<Val>>
  ): Memoizer<Val, Err> => {
    // Easy way to make self type reference
    type Self = Memoizer<Val, Err>;

    // Determine the
    const diffFn = options?.diffFn || defaultDiffFn;
    let lastCalculation: LastCalculation<Val, Err> = undefined;

    const generateValidationResultAndApply = (newValue: Val) => {
      const newResult = validator.validate(newValue);
      lastCalculation = {
        value: newValue,
        errors: newResult,
      };
      return newResult;
    };

    // Self's method
    const validate: Self["validate"] = (newValue) => {
      const boundLastCalc = lastCalculation;
      if (!boundLastCalc) {
        return generateValidationResultAndApply(newValue);
      }

      if (diffFn(boundLastCalc.value, newValue)) {
        return generateValidationResultAndApply(newValue);
      }

      return boundLastCalc.errors;
    };

    const getLastValidation: Self["getLastValidation"] = () => lastCalculation?.errors || null;

    return {
      validate,
      getLastValidation,
    };
  };
}
