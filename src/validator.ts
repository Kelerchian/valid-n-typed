/**
 * Namespaced for convenienced
 */
export namespace Validator {
  // =======================================
  // Type Definition
  // =======================================

  /**
   * Validator is an object that has the method validate
   * It also contains the type information of the value it
   * should be validating and the error type that it can
   * return
   */
  export type Validator<Val, Err> = {
    validate: (value: Val) => Err[];
  };

  /**
   * To build a Validator, we need a Builder
   * ValidatorBuilder is an object that has addRule method and build method.
   */
  export type ValidatorBuilder<Val, Err> = {
    /**
     * adds a validation rule to the builder
     * In addition, it also insert a new error type into the builder
     * This allows chaining of rules, for example:
     *  builder.
     *    addRule(StringNotEmpty)
     *    addRule(StringMustBeURL)
     */
    addRule: <NewErr>(newRule: Rule<Val, NewErr>) => ValidatorBuilder<Val, Err | NewErr>;
    /**
     * build the validator object. All inserted error types will be
     * inherited into the validator object
     */
    build: () => Validator<Val, Err>;
  };

  /**
   * Rule is a function that receives a value and return either an error or null
   * Null here indicates that the value passed this particular validation rule
   */
  export type Rule<Val, Err> = (value: Val) => Err | null;

  // =======================================
  // Constructors
  // =======================================

  /**
   * Constructor of ValidatorBuilder
   */
  export const makeBuilder = <Val extends unknown, Err extends unknown = never>(
    /**
     * It receives rules a variable containing a collection of validation rules
     * It is assigned with Rule<Val, never>[] empty array, which semantically means
     * a list of rules which NEVER return an error
     * (technically an empty array is still a list)
     */
    rules: Rule<Val, Err>[] = []
  ): ValidatorBuilder<Val, Err> => {
    /**
     * Self referencing type. A convenience
     */
    type Self = ValidatorBuilder<Val, Err>;

    /**
     * addRule function receives a new Rule. Here a new error type "NewError" is introduced
     * A new builder is created and returned. The twist is, this new builder has a new rule,
     * and a new error type embedded in it
     * <Err | NewError> indicates that OldError types are unionized with the NewError type.
     */
    const addRule: Self["addRule"] = <NewError>(newRule: Rule<Val, NewError>) =>
      makeBuilder<Val, Err | NewError>([...rules, newRule]);

    /**
     * Converts the builder into the validator.
     */
    const build: Self["build"] = () => makeValidator<Val, Err>(rules);

    // Construct and return self

    const self: Self = {
      addRule,
      build,
    };

    return self;
  };

  /**
   * The constructor of validator
   */
  const makeValidator = <Val extends any, Err extends any>(
    /**
     * Just like ValidatorBuilder, it receives rules parameter with a default
     * It contains a collection of validation rules the validator is going to use
     */
    rules: Rule<Val, Err>[] = [] as Rule<Val, never>[]
  ): Validator<Val, Err> => {
    // Self referencing type. A convenience
    type Self = Validator<Val, Err>;

    /**
     * The validate function here receives a value. And then it iterates
     */
    const validate: Self["validate"] = (value) => {
      const errors: Err[] = [];

      rules.forEach((rule) => {
        const error = rule(value);
        if (error !== null) {
          errors.push(error);
        }
      });

      return errors;
    };

    // Construct self and return
    return {
      validate,
    };
  };
}
