// codeEditor.js
//document.addEventListener('DOMContentLoaded', () => {
const splitterSize = 10;    //10 pixels width or height of splitters
const minimum_size = 20;                    //Minimal size to stop resize
let isDragging = false;
let splitter = null;
// let direction = 'horizontal';




function insertCodeEditor(parent, htmlCode) {

    parent.style.display = 'flex';
    parent.style.flexDirection = 'row';
    

    const areaLeft = document.createElement('div');
	areaLeft.classList = 'area'

    const areaRight = document.createElement('div');
	areaRight.classList = 'area'
    const toolbar = document.createElement('div');
    toolbar.classList = 'area toolbar'
	

    //---------------------RadioButtons to switch horizonta / verlical
    toolbar.innerHTML = `
        <button id="button-run-code">Run</button>
        <label>
            <input type="radio" name="layout" value="horizontal" checked> Horizontal
        </label>
        <label>
            <input type="radio" name="layout" value="vertical"> Vertical
        </label>
    `;



    const codeEditorContainer = document.createElement('div');
    codeEditorContainer.classList = 'container code-editor-container';

    const codeEditor = document.createElement('div');
	codeEditor.classList = 'code-editor'
    codeEditor.contentEditable = "true"; // Правильное использование свойства
    codeEditor.textContent = '<b>bold</b> not bold'

    codeEditorContainer.appendChild(codeEditor);
	areaLeft.append(toolbar, codeEditorContainer);




    // area2 
    const codeViewerContainer = document.createElement('div');
    codeViewerContainer.classList = 'container code-viewer-container';

	const codeViewer = document.createElement('div');
	codeViewer.classList = 'area'
    codeViewer.className = 'preview';

    codeViewer.innerHTML = htmlCode;
	codeViewerContainer.appendChild(codeViewer);

    areaRight.append(codeViewerContainer);

    splitter = insertSplitter(parent, areaLeft, areaRight);    
    divResizeHV(parent)

    
    // After DOM updated, assign listeners:

    //RadioButtons to switch horizonta / verlical
    // Находим радиокнопки
    const radioButtons = document.querySelectorAll('input[name="layout"]');

    // Функция для изменения расположения
    function reassign(layout) {
        console.log(`Layout changed to: ${layout}`);
        // Здесь будет ваша логика изменения, например:
        parent.style.flexDirection = layout === 'horizontal' ? 'row' : 'column';
        setSplitterDirection(splitter);
    }

    // Добавляем обработчики событий для каждого радиобатона
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.checked) {
                reassign(event.target.value);
            }
        });
    });

    document.getElementById('button-run-code').addEventListener('click', function() {
        codeViewer.innerHTML = codeEditor.textContent
    });

    // //Arrange when resize to adjust containers
    // const resizeObserver = new ResizeObserver(() => {
    //     onResize();
    // });
    
    // resizeObserver.observe(parent);
    
    // function onResize(){


    //     // Рассчитываем ширину и высоту элементов через getBoundingClientRect()
    //     const areaLeftRect = areaLeft.getBoundingClientRect();
    //     const toolbarRect = toolbar.getBoundingClientRect();
    //     const areaRightRect = areaRight.getBoundingClientRect();
    //     if(parent.style.flexDirection === 'row'){
            
    //         // Устанавливаем flex-параметры для left и right
    //         const widthMidle = 50% - splitterSize / 2 + 'px';
    //         areaLeft.style.flex = `0 0 ${widthMidle}`;
            
    //         areaRight.style.flex = `0 0 ${widthMidle}`;
        
    //         // Рассчитываем размеры для контейнеров
    //         const codeEditorContainerHeight = areaLeftRect.height - toolbarRect.height;
    //         const codeEditorContainerWidth = areaLeftRect.width;
        
    //         const codeViewerContainerHeight = areaRightRect.height;
    //         const codeViewerContainerWidth = areaRightRect.width;
        
    //         // Устанавливаем размеры
    //         codeEditorContainer.style.height = `${codeEditorContainerHeight}px`;
    //         codeEditorContainer.style.width = `${codeEditorContainerWidth}px`;
        
    //         codeViewerContainer.style.height = `${codeViewerContainerHeight}px`;
    //         codeViewerContainer.style.width = `${codeViewerContainerWidth}px`;
    //     }
    //     else if(parent.style.flexDirection === 'column'){

    //     }
    


    // }
    
}





//-------------------------------------------------------------------------------- Splitter
function insertSplitter(parent, areaLeft, areaRight){
    
 const rect = parent.getBoundingClientRect();
    
    // Очищаем родительский div
    parent.innerHTML = '';
    parent.style.display = 'flex';

    //const area1 = document.createElement('div');
    areaLeft.classList.add('area');
    // areaLeft.style.backgroundColor = 'rgba(' + (255 * Math.random()) + ',' +  (255 * Math.random()) + ',' +  (255 * Math.random()) + ', 0.5)'; 
    areaLeft.style.flex = `0 0 calc(50% - ${splitterSize/2}px)`;
    
    //const area2 = document.createElement('div');
    areaRight.classList.add('area');
    // areaRight.style.backgroundColor = 'rgba(' + (255 * Math.random()) + ',' +  (255 * Math.random()) + ',' +  (255 * Math.random()) + ', 0.5)'; 
    areaRight.style.flex = `0 0 calc(50% - ${splitterSize/2}px)`;

    const splitter = document.createElement('div');
    splitter.classList.add('splitter');
	splitter.style.flexGrow = 0;
	splitter.style.flexShrink = 0;
    // splitter.style.backgroundColor = 'rgba(' + (255 * Math.random()) + ',' +  (255 * Math.random()) + ',' +  (255 * Math.random()) + ', 0.5)'; 

    

    parent.append(areaLeft, splitter, areaRight);
	    setSplitterDirection(splitter);
    makeResizableDiv(splitter);


	return splitter;
}

function setSplitterDirection(splitter){
	if(!splitter)return;
    const parent = splitter.parentElement;
    if (parent.style.flexDirection === 'row') {
        //parent.style.flexDirection = 'row'
        splitter.classList = 'splitter' + ' ' + 'horizontal-splitter'
        splitter.style.width = splitterSize + 'px';
        splitter.style.height = '100%';
        splitter.style.cursor = 'ew-resize'
        
    } else if (parent.style.flexDirection === 'column') {

        //parent.style.flexDirection = 'column'
        splitter.classList = 'splitter' + ' ' + 'vertical-splitter'
        splitter.style.width = '100%'; 
        splitter.style.height = splitterSize + 'px';
        splitter.style.cursor = 'ns-resize'

    }
    else{
        console.log(`(!) Wrong direction type: ${parent.style.flexDirection}`);
    }
 }



function makeResizableDiv(splitter) {
    const element = splitter.previousElementSibling; //document.querySelector(div);
    const element2 = splitter.nextElementSibling;

    const parent = splitter.parentElement;



    splitter.addEventListener('mousedown', function(e) {
    e.preventDefault()
    isDragging = true;

    // original_mouse_x = e.pageX;
    // original_mouse_y = e.pageY;
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', stopDrag)
    })
    

    //'horizontal-splitter' : 'vertical-splitter');
    function onDrag(e) {
        if (!isDragging) return;
        const parentRect = splitter.parentNode.getBoundingClientRect();
        const areaPrevious = splitter.previousElementSibling;
        const areaNext = splitter.nextElementSibling;

        if (parent.style.flexDirection === 'row') {   
            const newLeft = e.clientX - parentRect.left;
            const parentWidth = parentRect.width;

            // If new postion is not exceed minimal area size requiremnt
            if(newLeft > minimum_size && newLeft < parentWidth - minimum_size){
                // Устанавливаем ширину первого блока
                const leftFlex = (newLeft / parentWidth) * 100;
                areaPrevious.style.flex = `0 0 ${leftFlex}%`;
                // console.log(`newLeft: ${newLeft}   leftFlex ${leftFlex}`)

                // Устанавливаем ширину второго блока

                //const rightFlex = 100 - leftFlex;
                //areaNext.style.flex = `0 0 ${rightFlex}%`;
                
            }

    
        }
        else if (parent.style.flexDirection === 'column') {
            const newTop = e.clientY - parentRect.top;
            const parentHeight = parentRect.height;

            // If new postion is not exceed minimal area size requiremnt
            if(newTop > minimum_size && newTop < parentHeight - minimum_size){
                // Устанавливаем ширину первого блока
                const topFlex = (newTop / parentHeight) * 100;
                areaPrevious.style.flex = `0 0 ${topFlex}%`;


            }
        }
    
    


    }
    function stopDrag() {
        isDragging = false;
        // areaNext.style.flex = 'auto';
        //splitter.style.left = areaPrevious.width
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
    }
    
}
function fixFlexSize(component){

}
//---------------------------------------------------------------------Resizer for whole Container
// Adds resize control to bootom right
function divResizeHV(component){
    // add resize control at bottom right
    const bottomRight = document.createElement('div');
    bottomRight.classList.add('corner', 'bottom-right');
    component.appendChild(bottomRight);

    bottomRight.addEventListener('mousedown', startResizing);

    function startResizing(e) {
        const component = e.target.parentElement;
        let startWidth = component.offsetWidth;
        let startHeight = component.offsetHeight;
        let startX = e.clientX;
        let startY = e.clientY;


        function onMouseMove(event) {


            let newWidth = startWidth/2 + (event.clientX - startX); // ( startWidth +event.clientX - startX );  //startWidth/2 + (event.clientX - startX);  // Here / 2 due to auto center positioning
            let newHeight = startHeight + (event.clientY - startY);

            if(newWidth >  160) component.style.width =`${newWidth * 2 }px`; //`${newWidth }px`;    //`${newWidth * 2 }px`;           // Here * 2 due to auto center positioning 
            if(newHeight > 100) component.style.height = `${newHeight}px`;

            
        }

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', function mouseUpHandler() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', mouseUpHandler);
        });
    }

}