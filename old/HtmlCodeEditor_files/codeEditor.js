// codeEditor.js

function insertCodeEditor(parent, htmlCode) {
    let container = document.createElement('div');
    container.className = 'container';
    container.style.display = 'flex';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.border = 'solid 1px blue';

    let column1 = document.createElement('div');
    column1.className = 'column';
    column1.style.flex = '1';
    column1.style.height = '100%';
    column1.style.overflow = 'auto';



    let toolbar = document.createElement('div');
    
    toolbar.style.backgroundColor = '#f0f0f0';
    toolbar.style.padding = '10px';

    toolbar.innerHTML = '<button class="run-btn">Run</button>';

    column1.appendChild(toolbar);

    let codeEditField = document.createElement('textarea');
    codeEditField.style.width = '100%';
    codeEditField.style.height = `calc(100% - ${toolbar.clientHeight}px)`;
    codeEditField.style.padding = '10px';
    codeEditField.style.boxSizing = 'border-box';

    codeEditField.style.resize = 'none';

    codeEditField.className = 'code-edit-field';
    codeEditField.placeholder = 'Write code here';
    codeEditField.value = htmlCode;
    column1.appendChild(codeEditField);


    let preview = document.createElement('iframe');
    preview.className = 'preview';
    preview.style.flex = '1';


    preview.setAttribute('srcdoc', '<!DOCTYPE html><html><head><title>Preview</title></head><body></body></html>');


    container.appendChild(column1);

    container.appendChild(preview);


    parent.appendChild(container);
    bindRunButtonEvent(container);

    container.querySelector('.run-btn').click();
}

function bindRunButtonEvent(container) {
    let runBtn = container.querySelector('.run-btn');
    let codeEditField = container.querySelector('.code-edit-field');
    let preview = container.querySelector('.preview');
    
    runBtn.addEventListener('click', function() {
        let code = codeEditField.value;
        let prefix = "<html><head></head><body>";
        let postfix = "</body></html>";
        let previewDocument = preview.contentDocument || preview.contentWindow.document;
        previewDocument.open();
        previewDocument.write(prefix + code + postfix);
        previewDocument.close();
    });
}
