
// функция конвертера из байты в мегабайты
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
 }


function upload(selector, options = {}) {

    
    const input = document.querySelector(selector);

    // создаем блок который будет отображать preview
    const preview = document.createElement('div');
    preview.classList.add('preview');


    const open = document.createElement('button');
    open.classList.add('btn');
    open.textContent = 'Открыть';

    if (options.multi){
        input.setAttribute('multiple', true);
    }

    if (options.accept && Array.isArray(options.accept)){
        input.setAttribute('accept', options.accept.join(','));
    }

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', open);




    const triggerInput = () => {
        input.click();
    }

    const changeHandler = e => {
        if (!e.target.files.length){
            return;
        }

        const files  = Array.from(e.target.files);

        preview.innerHTML = '';
        files.forEach(file => {
            if (!file.type.match('image')){
                return;
            }
            // для возможности preview используем класс FileReader
            const reader = new FileReader();
            // т.к. readAsDataURL работает ассинхронно, мы используем слушатель события load
            reader.onload = ev => {
                // ev.target.result будет храниться наше закодированное изображение которое
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

            reader.readAsDataURL(file);
        })
    }

    const removeHandler = e => {
        if (!e.target.dataset.name){
            return;
        }
        const {name} = e.target.dataset;


    }

    open.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler)
}




upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gig']
})