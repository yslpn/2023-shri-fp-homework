/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
  __,
  allPass,
  size,
  pipe,
  gte,
  lt,
  prop,
  tap,
  toNumber,
  round,
  curry,
  partial,
  cond,
  stubTrue,
  gt,
} from "lodash/fp";
import Api from "../tools/api";

// API
const api = new Api();
const API_NUMBERS = "https://api.tech/numbers/base";
const API_ANIMALS = "https://animals.tech/";
const getBinaryNumber = (number) =>
  api.get(API_NUMBERS, {
    from: 10,
    to: 2,
    number,
  });
const getAnimalNameById = (id) => api.get(`${API_ANIMALS}${id}`, {});

// Predicates
const isLengthLessThanTen = pipe(size, lt(__, 10));
const isLengthGreaterThanTwo = pipe(size, gt(__, 2));
const isOnlyNumbersAndPositive = pipe(toNumber, gte(__, 0));

// Math
const pow = (a, b) => Math.pow(a, b);
const square = partial(pow, [2]);
const mod3 = (number) => number % 3;

// Common helpers
const andThen = curry((f, p) => p.then((r) => f(r)));
const otherwise = curry((f, p) => p.catch(f));
const ifElse = curry((p, t, f) =>
  cond([
    [p, t],
    [stubTrue, f],
  ])
);

const processSequence = async ({
  value,
  writeLog,
  handleSuccess,
  handleError,
}) => {
  // Helpers for processSequence
  const getResult = prop("result");
  const handleValidationError = partial(handleError, ["ValidationError"]);
  const log = tap(writeLog);

  const validateInput = allPass([
    isLengthLessThanTen,
    isLengthGreaterThanTwo,
    isOnlyNumbersAndPositive,
  ]);

  const handleInput = pipe(
    toNumber,
    round,
    log,
    getBinaryNumber,
    andThen(getResult),
    andThen(log),
    andThen(size),
    andThen(log),
    andThen(square),
    andThen(log),
    andThen(mod3),
    andThen(log),
    andThen(getAnimalNameById),
    andThen(getResult),
    andThen(handleSuccess),
    otherwise(handleError)
  );

  const handleInputWithValidation = ifElse(
    validateInput,
    handleInput,
    handleValidationError
  );

  const runHandleInputWithValidation = pipe(log, handleInputWithValidation);

  runHandleInputWithValidation(value);
};

export default processSequence;
