/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    let resultArr = [];

    for (let i = 0; i < array.length; i++) {
        resultArr.push(fn(array[i], i, array));
    }

    return resultArr;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    let curResult = initial || array[0];
    let i = initial ? 0 : 1;

    for (i; i < array.length; i++) {
        curResult = fn(curResult, array[i], i, array);
    }

    return curResult;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    let resultArr = [];

    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            resultArr.push(prop.toUpperCase());
        }
    }

    return resultArr;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from, to) {
    if (((from === 0) && (to === 0 )) || (array.length === 0)) {
        return [];
    }
    let resultArr = [];
    let start = ~~from;
    let end = ~~to;

    start = (start >= 0) ? (start) : (array.length + start);
    end = (end > 0) ? (end) : (array.length + end);

    start = Math.min(Math.max(start, 0), array.length);
    end = (end <= array.length) ? (end) : (array.length);

    for (let i = start; i < end; i++) {
        resultArr.push(array[i]);
    }

    return resultArr;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    return new Proxy(obj, {
        set(target, prop, value) {
            target[prop] = value**2;

            return true;
        }
    });
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
