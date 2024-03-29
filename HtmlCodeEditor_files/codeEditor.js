function insertCodeEdit(htmlCode, heightPercentage, widthPercentage) {
    var container = document.createElement('div');
    container.className = 'container';
    container.style.height = heightPercentage + 'vh';
    container.style.width = widthPercentage + 'vw';

    var column1 = document.createElement('div');
    column1.className = 'column';
    var toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = '<button class="run-btn">Run</button>';
    column1.appendChild(toolbar);

    var codeEditField = document.createElement('textarea');
    codeEditField.className = 'code-edit-field';
    codeEditField.placeholder = 'Write code here';
    codeEditField.value = htmlCode;
    column1.appendChild(codeEditField);

    var column2 = document.createElement('div');
    column2.className = 'column';
    var preview = document.createElement('iframe');
    preview.className = 'preview';
    preview.setAttribute('width', '100%');
    preview.setAttribute('height', '100%');
    preview.setAttribute('srcdoc', '<!DOCTYPE html><html><head><title>Preview</title></head><body></body></html>');
    column2.appendChild(preview);

    container.appendChild(column1);
    container.appendChild(column2);

    document.body.appendChild(container);
    bindRunButtonEvent(container);
}

function bindRunButtonEvent(container) {
    var runBtn = container.querySelector('.run-btn');
    var codeEditField = container.querySelector('.code-edit-field');
    var preview = container.querySelector('.preview');
    
    runBtn.addEventListener('click', function() {
        var code = codeEditField.value;
        var prefix = "<html><head></head><body>";
        var postfix = "</body></html>";
        var previewDocument = preview.contentDocument || preview.contentWindow.document;
        previewDocument.open();
        previewDocument.write(prefix + code + postfix);
        previewDocument.close();
    });
}
