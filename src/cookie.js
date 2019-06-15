/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

listTable.innerHTML = '';

// Массив, содержащий элементы tr
let tableRows = [];

/*
 Функция добавления элемента в массив tableRows
*/
function addToTableRows(cookieName, cookieValue) {
    for (let i = 0; i < tableRows.length; i++) {
        const tr = tableRows[i];

        if (tr.hasAttribute('data-cookie-name') && (tr.dataset.cookieName === cookieName)) {
            // Заменяем содержимое
            tr.setAttribute('data-cookie-value', cookieValue);
            tr.innerHTML = `<td>${cookieName}</td><td>${cookieValue}</td><td><button>Удалить</button></td>`;

            return;
        }
    }
    // нет tr с такой кукой -> создаём
    const tr = document.createElement('tr');

    tr.setAttribute('data-cookie-name', cookieName);
    tr.setAttribute('data-cookie-value', cookieValue);
    tr.setAttribute('data-visible', 1);
    tr.innerHTML = `<td>${cookieName}</td><td>${cookieValue}</td><td><button>Удалить</button></td>`;
    tableRows.push(tr);
}

/*
 Фильтрация массива по условию (устанавливает у элементов атрибут data-visible)
*/
function filterTableRows(str) {
    if (str === '') {
        tableRows.forEach( tr => tr.setAttribute('data-visible', 1) );

        return;
    }

    tableRows.forEach( tr => {
        ((tr.hasAttribute('data-cookie-name') && isMatching(tr.dataset.cookieName, str)) ||
        (tr.hasAttribute('data-cookie-value') && isMatching(tr.dataset.cookieValue, str)) )
            ?
            tr.setAttribute('data-visible', 1) : tr.setAttribute('data-visible', 0);
    });
}

/*
 Функция отображения массива на странице
*/
function showTableRows() {
    // сначала добавляем в documentFragment
    const fragment = document.createDocumentFragment();

    tableRows.forEach( tr => {
        if (tr.hasAttribute('data-visible') && (tr.dataset.visible === '1')) {
            fragment.appendChild(tr);
        }
    });

    listTable.innerHTML = '';
    listTable.appendChild(fragment);
}

/*
 Функция удаления элемента из массива tableRows
*/
function removeFromTableRows(cookieName) {
    for (let i = 0; i < tableRows.length; i++) {
        const tr = tableRows[i];

        if (tr.hasAttribute('data-cookie-name') && (tr.dataset.cookieName === cookieName)) {
            tableRows.splice(i, 1);

            return;
        }
    }
}

/*
 Обработчик строки фильтра
*/
filterNameInput.addEventListener('keyup', () => {
    filterTableRows(filterNameInput.value.trim());
    showTableRows();
});

/*
 Обработчик кнопки "Добавить cookie"
*/
addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    const cookieName = addNameInput.value.trim();
    const cookieValue = addValueInput.value.trim();
    const filterStr = filterNameInput.value.trim();

    if (cookieName === '') {
        return;
    }

    // Добавляем в браузер
    setCookie(cookieName, cookieValue);

    // Добавляем в таблицу
    addToTableRows(cookieName, cookieValue);
    filterTableRows(filterStr);
    showTableRows();

    // Очищаем поля ввода (без таймаута тесты не проходят)
    setTimeout(() => {
        addNameInput.value = '';
        addValueInput.value = '';
    }, 100);
});

/*
 Обработчик кнопки "Удалить" - делегируем его элементу listTable, чтобы не вешать на каждую кнопку
*/
listTable.addEventListener('click', (e) => {
    if ((e.target.tagName ==='BUTTON')
        && e.target.parentNode // родитель существует (это td)
        && e.target.parentNode.parentNode // родитель родителя существует (это tr)
        && e.target.parentNode.parentNode.hasAttribute('data-cookie-name')
    ) {
        const tr = e.target.parentNode.parentNode;
        const cookieName = tr.dataset.cookieName;

        // Удаляем куку из браузера
        setCookie(cookieName, '', { expires: -1 });

        // Удаляем строку из таблицы
        removeFromTableRows(cookieName);
        tr.remove();
    }
});

/*
 Функция setCookie взята со странички:
 https://learn.javascript.ru/cookie#funktsiya-setcookie-name-value-options
 (слегка исправлена, чтобы eslint не ругался)
*/
function setCookie(name, value, options) {
    options = options || {};
    let expires = options.expires;

    if (typeof expires == 'number' && expires) {
        let d = new Date();

        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + '=' + value;

    for (let propName in options) {
        if ({}.hasOwnProperty.call(options, propName)) {
            updatedCookie += '; ' + propName;
            let propValue = options[propName];

            if (propValue !== true) {
                updatedCookie += '=' + propValue;
            }
        }
    }

    document.cookie = updatedCookie;
}

/*
 Функция из прошлого ДЗ :)
*/
function isMatching(full, chunk) {
    return full.toLowerCase().includes(chunk.toLowerCase());
}
