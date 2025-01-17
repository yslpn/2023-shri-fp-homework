import {
  __,
  allPass,
  equals,
  pipe,
  where,
  anyPass,
  values,
  all,
  negate,
  filter,
  size,
  gte,
  juxt,
  apply,
  max,
  countBy,
  identity,
  prop,
} from "lodash/fp";

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const green = "green";
const red = "red";
const white = "white";
const blue = "blue";
const orange = "orange";

const count = (f) => pipe(filter(f), size);
const isRed = (s) => equals(s, red);
const isWhite = (s) => equals(s, white);
const isGreen = (s) => equals(s, green);
const isBlue = (s) => equals(s, blue);
const isOrange = (s) => equals(s, orange);
const isNotWhite = negate(isWhite);
const isNotRed = negate(isRed);
const isNotWhiteAndNotRed = allPass([isNotWhite, isNotRed]);
const isAnyColor = anyPass([isRed, isWhite, isGreen, isBlue, isOrange]);
const isGreenTwoOrMore = pipe(values, count(isGreen), gte(__, 2));
const isGreenTwice = pipe(values, count(isGreen), equals(__, 2));
const isRedOnce = pipe(values, count(isRed), equals(__, 1));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = where({
  star: isRed,
  square: isGreen,
  triangle: isWhite,
  circle: isWhite,
});

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = isGreenTwoOrMore;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = pipe(
  values,
  juxt([count(isRed), count(isBlue)]),
  apply(equals)
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = where({
  star: isRed,
  square: isOrange,
  triangle: isAnyColor,
  circle: isBlue,
});

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(
  values,
  filter(isNotWhite),
  countBy(identity),
  values,
  max,
  gte(__, 3)
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  isGreenTwice,
  where({
    triangle: isGreen,
  }),
  isRedOnce,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(values, all(isOrange));

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = where({
  star: isNotWhiteAndNotRed,
  square: isAnyColor,
  triangle: isAnyColor,
  circle: isAnyColor,
});

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(values, all(isGreen));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = pipe(
  juxt([prop("triangle"), prop("square")]),
  allPass([apply(equals), all(isNotWhite)])
);
