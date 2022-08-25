export type Validator<Val, Err> = {
  validate: (value: Val) => Err[];
};

export type Rule<Val, Err> = (value: Val) => Err | null;

export type ValidatorBuilder<Val, Err> = {
  addRule: <NewErr>(
    newRule: Rule<Val, NewErr>
  ) => ValidatorBuilder<Val, Err | NewErr>;
  build: () => Validator<Val, Err>;
};
