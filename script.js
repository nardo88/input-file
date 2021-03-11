function upload(selector, options = {}) {
    const input = document.querySelector(selector);
    const open = document.createElement('button');
    open.classList.add('btn');
    open.textContent = 'Открыть';

    if (options.multi){
        input.setAttribute('multiple', true);
    }

    if (options.accept && Array.isArray(options.accept)){
        input.setAttribute('accept', options.accept.join(','));
    }

    input.insertAdjacentElement('afterend', open)







    const triggerInput = () => {
        input.click();
    }

    const changeHandler = e => {
        if (!e.target.files.length){
            return;
        }

        const files  = Array.from(e.target.files);
        files.forEach(file => {
            if (!file.type.match('image')){
                return;
            }

            const reader = new FileReader();

            reader.readAsBinaryString(file);
        })
    }


    open.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
}




upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gig']
})