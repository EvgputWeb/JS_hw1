/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    const el = document.createElement('div');

    el.classList.add('draggable-div');
    el.style.position = 'absolute';
    el.style.width = getRandomInt(50, 500) + 'px';
    el.style.height = getRandomInt(50, 500) + 'px';

    let r = getRandomInt(0, 255),
        g = getRandomInt(0, 255),
        b = getRandomInt(0, 255);

    el.style.backgroundColor = `RGB(${r},${g},${b})`;
    el.style.top = getRandomInt(0, 400) + 'px';
    el.style.left = getRandomInt(0, 1000) + 'px';
    el.style.cursor = 'move';
    el.setAttribute('draggable', 'true');

    return el;
}

// Возвращает случайное целое между min и max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {

    document.addEventListener('dragstart', e => {
        if (e.target.classList.contains('draggable-div')) {
            e.target.style.opacity = '0.4';
            e.target.mouseDragStartCoords = { x: e.pageX, y: e.pageY };
        }
    });

    document.addEventListener('dragend', e => {
        if (e.target.classList.contains('draggable-div')) {
            e.target.style.opacity = '1.0';
            if (e.target.mouseDragStartCoords) {
                let deltaX = e.pageX - e.target.mouseDragStartCoords.x;
                let deltaY = e.pageY - e.target.mouseDragStartCoords.y;

                e.target.style.left = parseInt(e.target.style.left) + deltaX + 'px';
                e.target.style.top = parseInt(e.target.style.top) + deltaY + 'px';

                e.target.mouseDragStartCoords = null;
            }
        }
    });

    // homeworkContainer.addEventListener('dragover', e => {
    //     e.stopPropagation();
    //     e.preventDefault();
    // });

}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
