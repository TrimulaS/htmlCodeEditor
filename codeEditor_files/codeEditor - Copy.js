// Add styles

const styleCodeEditor = document.createElement('style');
styleCodeEditor.textContent = `
    

        .main-div-ce{
            position: relative;
            border: solid 1px black;
            flex-direction : 'row';
            min-width: 0; /* Предотвращает переполнение по ширине */
            min-height: 0; /* Предотвращает переполнение по высоте */
        }

        .area-ce{
            display: flex;
            flex-grow:1;
            flex-direction: column; /* Расположим toolbar сверху, а editor ниже */
            min-width: 0; /* Предотвращает переполнение по ширине */
            min-height: 0; /* Предотвращает переполнение по высоте */
        }
        .splitter-ce{
            /* background-color : #f0f0f0; */

            box-sizing: border-box;

            overflow: auto;
            flex-grow: 0;
            flex-shrink: 0;
        }



        .toolbar-ce{
            background-color : #f0f0f0;
            display: flex;
            flex-grow: 0;
            flex-shrink: 0; /* toolbar занимает фиксированную высоту */
            /* dfisplay: flex; */
            flex-direction: row; /* Расположим toolbar сверху, а editor ниже */
            flex-wrap: wrap;
        }
        .button-ce{
            flex-grow: 0;
            flex-shrink: 1;
            display: inline;

        }

        .container-ce {
            /* position: relative; */
            width: 100%; /* Занимает всю ширину родителя */
            height: 100%; /* Занимает всю высоту родителя */
            flex-grow: 0;
            flex-shrink: 1; /* toolbar занимает фиксированную высоту */
            overflow: auto;            
            background-color: beige;
        }
        .code-editor-container-ce{
            
            /* background-color: beige; */
            font-family: monospace;
        }
        .code-input-ce{

            /* Убираем рамки и outline */
            outline: none;
            border: none;

            

            white-space: pre-wrap; /* Сохраняем пробелы и перенос строк */
            word-wrap: break-word; /* Перенос длинных слов */
            word-break: break-all; /* Перенос длинных строк на новую строку */
            box-sizing: border-box; /* Включаем отступы и границы в размеры */

           
 
        }


        .code-viewer-container-ce{
            overflow: auto; /* Автоматическая прокрутка при переполнении */
            /* background-color: rgb(200, 130, 37); */
        }
        /* .code-viewer-ce{
            background-color: rgb(50, 198, 112);
        } */



        /* Code input and output*/
        .code-input-ce , .code-viewer-ce{
            padding : 5px;
        }




        /* Resize button */
        .corner-ce {
            width: 10px;
            height: 10px;
            /* background-color: black; */
            border-style: solid ;
            position: absolute;
        }
        .bottom-right-ce {
            position: absolute;
            bottom: 0;
            right: 0;
            cursor: se-resize;
        }


        /* Decoration */

        .splitter-ce , .corner-ce, .button-ce {
            transition: background-color 0.3s ease;
        }

        .splitter-ce:hover , .corner-ce:hover, .button-ce:hover  {
            background-color: #ddd;
        }


        .embossed1, .toolbar-ce, .splitter-ce {
            background-color:        #eee;
            border-left:   1px solid #fff;
            border-top:    1px solid #fff;
            border-right:  1px solid #ddd;
            border-bottom: 1px solid #ddd;
        }
        .embossed2, .button-ce, .corner-ce{
            background-color:        #eee;
            border-left:   2px solid #fff;
            border-top:    2px solid #fff;
            border-right:  2px solid #ddd;
            border-bottom: 2px solid #ddd;
        } 


`;
document.head.appendChild(styleCodeEditor);


class CodeEditor {
    constructor(parent, htmlCode) {
        this.parent = parent;
        this.htmlCode = htmlCode;
        this.isDragging = false;
        this.splitter = null;
        this.minimumSize = 20;
        this.splitterSize = 8;

        

        this.init();
    }

    init() {
        this.parent.style.display = 'flex';
        this.parent.style.flexDirection = 'row';
        this.parent.classList.add('main-div-ce');

        // Создание левой области
        this.areaLeft = document.createElement('div');
        this.areaLeft.classList = 'area-ce';

        const toolbar = document.createElement('div');
        toolbar.classList = 'area-ce toolbar-ce';
        toolbar.innerHTML = `
            <button id="button-run-code" class="button-ce">Run</button>
            <button id="button-clear-code" class="button-ce">Clear</button>
            <label>
                <input type="radio" name="layout-${this.parent.id}" value="horizontal" checked> Horizontal
            </label>
            <label>
                <input type="radio" name="layout-${this.parent.id}" value="vertical"> Vertical
            </label>
        `;

        const codeEditorContainer = document.createElement('div');
        codeEditorContainer.classList = 'container-ce code-editor-container-ce';

        this.codeInput = document.createElement('div');
        this.codeInput.classList = 'code-input-ce';
        this.codeInput.contentEditable = "true";
        this.codeInput.textContent = this.htmlCode;

        codeEditorContainer.appendChild(this.codeInput);
        this.areaLeft.append(toolbar, codeEditorContainer);

        // Создание правой области
        this.areaRight = document.createElement('div');
        this.areaRight.classList = 'area-ce';

        const codeViewerContainer = document.createElement('div');
        codeViewerContainer.classList = 'container-ce code-viewer-container-ce';

        this.codeViewer = document.createElement('div');
        this.codeViewer.classList = 'code-viewer-ce';
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
            this.codeViewer.innerHTML = this.codeInput.textContent;
        });
        toolbar.querySelector('#button-clear-code').addEventListener('click', () => {
            this.codeInput.textContent = "";
        });
    }

    insertSplitter(parent, areaLeft, areaRight) {
        parent.innerHTML = '';
        parent.style.display = 'flex';

        areaLeft.style.flex = `0 0 calc(50% - ${this.splitterSize / 2}px)`;
        areaRight.style.flex = `0 0 calc(50% - ${this.splitterSize / 2}px)`;

        const splitter = document.createElement('div');
        splitter.classList.add('splitter-ce');
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
        bottomRight.classList.add('corner-ce', 'bottom-right-ce');
        component.appendChild(bottomRight);

        bottomRight.addEventListener('mousedown', (e) => {
            const startWidth = component.offsetWidth;
            const startHeight = component.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            const onMouseMove = (event) => {
                const newWidth = startWidth/2 + (event.clientX - startX);          // no horizontal central positioning:  ( startWidth +event.clientX - startX );  //startWidth/2 + (event.clientX - startX);  // Here / 2 due to auto center positioning
                const newHeight = startHeight + (event.clientY - startY);

                if (newWidth > 160) component.style.width = `${newWidth * 2}px`;   // no horizontal central positioning: `${newWidth }px`;    //`${newWidth * 2 }px`;           // Here * 2 due to auto center positioning 
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

