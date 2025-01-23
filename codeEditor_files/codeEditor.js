class CodeEditor {
    constructor(parent, htmlCode) {
        this.parent = parent;
        this.htmlCode = htmlCode;
        this.isDragging = false;
        this.splitter = null;
        this.minimumSize = 20;
        this.splitterSize = 10;

        this.init();
    }

    init() {
        this.parent.style.display = 'flex';
        this.parent.style.flexDirection = 'row';

        // Создание левой области
        this.areaLeft = document.createElement('div');
        this.areaLeft.classList = 'area';

        const toolbar = document.createElement('div');
        toolbar.classList = 'area toolbar';
        toolbar.innerHTML = `
            <button id="button-run-code" class="button">Run</button>
            <button id="button-clear-code" class="button">Clear</button>
            <label>
                <input type="radio" name="layout-${this.parent.id}" value="horizontal" checked> Horizontal
            </label>
            <label>
                <input type="radio" name="layout-${this.parent.id}" value="vertical"> Vertical
            </label>
        `;

        const codeEditorContainer = document.createElement('div');
        codeEditorContainer.classList = 'container code-editor-container';

        this.codeEditor = document.createElement('div');
        this.codeEditor.classList = 'code-editor';
        this.codeEditor.contentEditable = "true";
        this.codeEditor.textContent = this.htmlCode;

        codeEditorContainer.appendChild(this.codeEditor);
        this.areaLeft.append(toolbar, codeEditorContainer);

        // Создание правой области
        this.areaRight = document.createElement('div');
        this.areaRight.classList = 'area';

        const codeViewerContainer = document.createElement('div');
        codeViewerContainer.classList = 'container code-viewer-container';

        this.codeViewer = document.createElement('div');
        this.codeViewer.classList = 'code-viewer';
        this.codeViewer.innerHTML = this.htmlCode;

        codeViewerContainer.appendChild(this.codeViewer);
        this.areaRight.append(codeViewerContainer);

        // Создание разделителя
        this.splitter = this.insertSplitter(this.parent, this.areaLeft, this.areaRight);

        // Добавление resize-контроля
        this.divResizeHV(this.parent);

        // Обработчики событий
        this.initListeners(toolbar);
    }

    initListeners(toolbar) {
        // Смена ориентации
        const radioButtons = toolbar.querySelectorAll(`input[name="layout-${this.parent.id}"]`);
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (event) => {
                if (event.target.checked) {
                    this.parent.style.flexDirection = event.target.value === 'horizontal' ? 'row' : 'column';
                    this.setSplitterDirection(this.splitter);
                }
            });
        });

        // Обработчики кнопок
        toolbar.querySelector('#button-run-code').addEventListener('click', () => {
            this.codeViewer.innerHTML = this.codeEditor.textContent;
        });
        toolbar.querySelector('#button-clear-code').addEventListener('click', () => {
            this.codeEditor.textContent = "";
        });
    }

    insertSplitter(parent, areaLeft, areaRight) {
        parent.innerHTML = '';
        parent.style.display = 'flex';

        areaLeft.style.flex = `0 0 calc(50% - ${this.splitterSize / 2}px)`;
        areaRight.style.flex = `0 0 calc(50% - ${this.splitterSize / 2}px)`;

        const splitter = document.createElement('div');
        splitter.classList.add('splitter');
        splitter.style.flexGrow = 0;
        splitter.style.flexShrink = 0;

        parent.append(areaLeft, splitter, areaRight);
        this.setSplitterDirection(splitter);
        this.makeResizableDiv(splitter);

        return splitter;
    }

    setSplitterDirection(splitter) {
        if (!splitter) return;
        const parent = splitter.parentElement;
        if (parent.style.flexDirection === 'row') {
            splitter.className = 'splitter horizontal-splitter';
            splitter.style.width = `${this.splitterSize}px`;
            splitter.style.height = '100%';
            splitter.style.cursor = 'ew-resize';
        } else if (parent.style.flexDirection === 'column') {
            splitter.className = 'splitter vertical-splitter';
            splitter.style.width = '100%';
            splitter.style.height = `${this.splitterSize}px`;
            splitter.style.cursor = 'ns-resize';
        }
    }

    makeResizableDiv(splitter) {
        const areaPrevious = splitter.previousElementSibling;
        const areaNext = splitter.nextElementSibling;

        splitter.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDragging = true;

            const onDrag = (e) => {
                if (!this.isDragging) return;

                const parentRect = splitter.parentNode.getBoundingClientRect();

                if (this.parent.style.flexDirection === 'row') {
                    const newLeft = e.clientX - parentRect.left;
                    const parentWidth = parentRect.width;

                    if (newLeft > this.minimumSize && newLeft < parentWidth - this.minimumSize) {
                        const leftFlex = (newLeft / parentWidth) * 100;
                        areaPrevious.style.flex = `0 0 ${leftFlex}%`;
                        areaNext.style.flex = `1 1 auto`;
                    }
                } else if (this.parent.style.flexDirection === 'column') {
                    const newTop = e.clientY - parentRect.top;
                    const parentHeight = parentRect.height;

                    if (newTop > this.minimumSize && newTop < parentHeight - this.minimumSize) {
                        const topFlex = (newTop / parentHeight) * 100;
                        areaPrevious.style.flex = `0 0 ${topFlex}%`;
                        areaNext.style.flex = `1 1 auto`;
                    }
                }
            };

            const stopDrag = () => {
                this.isDragging = false;
                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('mouseup', stopDrag);
            };

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
        });
    }

    divResizeHV(component) {
        const bottomRight = document.createElement('div');
        bottomRight.classList.add('corner', 'bottom-right');
        component.appendChild(bottomRight);

        bottomRight.addEventListener('mousedown', (e) => {
            const startWidth = component.offsetWidth;
            const startHeight = component.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            const onMouseMove = (event) => {
                const newWidth = startWidth + (event.clientX - startX);
                const newHeight = startHeight + (event.clientY - startY);

                if (newWidth > 160) component.style.width = `${newWidth}px`;
                if (newHeight > 100) component.style.height = `${newHeight}px`;
            };

            const stopResize = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', stopResize);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', stopResize);
        });
    }
}

