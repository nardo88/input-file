
// функция конвертера из байты в мегабайты
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
 }


function upload(selector, options = {}) {
    // массив где будем хранить файлы
    let files = [];
    
    const input = document.querySelector(selector);

    // создаем блок который будет отображать preview
    const preview = document.createElement('div');
    preview.classList.add('preview');

    // создаем кнопку
    const open = document.createElement('button');
    open.classList.add('btn');
    open.textContent = 'Открыть';

    // если multi == true то input имеет возможность множественного выбора
    if (options.multi){
        input.setAttribute('multiple', true);
    }

    // accept - это массив с доступными расширениями
    if (options.accept && Array.isArray(options.accept)){
        input.setAttribute('accept', options.accept.join(','));
    }

    // добавляем input наш превью блок и кнопку
    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', open);

    // функция которая вызывает у инпута событие клик (не слушает, а сама вызывает событие)
    // эту функцию мы будем вызывать по нажатии на кнопку, т.е. жмем на кнопку а клик срабатывает у input
    const triggerInput = () => {
        input.click();
    }

    // функция которая будет вызываться при собитыы изменения у input 
    const changeHandler = e => {
        // если у target (т.е. input) атрибут files будет пустым, то ничего не делаем.
        // это на случай если мы нажали отмена.
        if (!e.target.files.length){
            return;
        }
        // создаем массив на основании массива выбранных файлов
        files  = Array.from(e.target.files);

        // очищаем превьюшку (будет срабатывать если мы второй раз вызвали input, вдруг надо другую картинку загрузить.)
        preview.innerHTML = '';

        // пробегаемся по массиву с файлами
        files.forEach(file => {
            // если тип файла не является картинкой, то выполняем return
            if (!file.type.match('image')){
                return;
            }
            // для возможности preview используем класс FileReader
            const reader = new FileReader();
            // т.к. readAsDataURL работает ассинхронно, мы используем слушатель события load
            reader.onload = ev => {
                // ev.target.result будет храниться наше закодированное изображение (base64) которое
                // можно передать тегу image
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                        <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${ev.target.result}" alt="${file.name}" />
                        <div class="preview-info">
                            <span>${file.name}</span>
                            ${bytesToSize(file.size)}
                        </div>
                    </div>
                `)
            }
            // readAsDataURL считывает файл и передает его содержимое как base64 строку
            reader.readAsDataURL(file);
        })
    }

    // функция клика по крестику на изображении
    const removeHandler = e => {
        // если у таргета нет дата атрибута - name, выолняем return
        if (!e.target.dataset.name){
            return;
        }
        // с помощью диструктуризации получаем название картинки
        const {name} = e.target.dataset;
        
        // отфильтровываем массив с файлами
        files = files.filter(item =>  item.name !== name);

        // ищем блок с дата атрибутом name
        const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image');

        // анимируем блок
        block.classList.add('removing');

        // удаляем блок
        setTimeout(() => {
            block.remove();

        }, 300)
     


    }

    open.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler)
}




upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gig']
})