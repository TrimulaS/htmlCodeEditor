// codeEditor.js


//document.addEventListener('DOMContentLoaded', () => {
    const splitterSize = 10;    //10 pixels width or height of splitters
    let direction = 'horizontal';
    
    function insertCodeEditor(parent, htmlCode) {

    parent.style.display = flex;

    const areaLeft = document.createElement('div');
    areaLeft.flexGrow = 1;
	areaLeft.classList = 'area'


    const areaRight = document.createElement('div');
    areaRight.flexGrow = 1;
	areaRight.classList = 'area'
    const toolbar = document.createElement('div');
    toolbar.classList = 'area'
	

    // Добавляем кнопку и радиокнопки в toolbar
    toolbar.innerHTML = `
        <button class="run-btn">Run</button>
        <label>
            <input type="radio" name="layout" value="horizontal" checked> Horizontal
        </label>
        <label>
            <input type="radio" name="layout" value="vertical"> Vertical
        </label>
    `;





    const codeEditor = document.createElement('div');
	codeEditor.classList = 'area'
    codeEditor.contentEditable = "true"; // Правильное использование свойства

    codeEditor.textContent = '<b>bold</b> not bold'

	areaLeft.append(toolbar, codeEditor);


    // area2 
	const codeViewer = document.createElement('div');
	codeViewer.classList = 'area'
    codeViewer.className = 'preview';

    codeViewer.innerHTML = htmlCode;
	
    areaRight.append(codeViewer);

    insertSplitter(parent, areaLeft,areaRight, direction);    
       
    
    }
    
//--------------------------------------Splitter
function insertSplitter(parent, areaLeft, areaRight, direction){
    
 const rect = parent.getBoundingClientRect();
    
    // Очищаем родительский div
    parent.innerHTML = '';
    parent.style.display = 'flex';

    //const area1 = document.createElement('div');
    areaLeft.classList.add('area');
    areaLeft.style.backgroundColor = 'rgba(' + (255 * Math.random()) + ',' +  (255 * Math.random()) + ',' +  (255 * Math.random()) + ', 0.5)'; 
    areaLeft.style.flexGrow = 1;
    
    //const area2 = document.createElement('div');
    areaRight.classList.add('area');
    areaRight.style.backgroundColor = 'rgba(' + (255 * Math.random()) + ',' +  (255 * Math.random()) + ',' +  (255 * Math.random()) + ', 0.5)'; 
    areaRight.style.flexGrow = 1;

    const splitter = document.createElement('div');
    splitter.classList.add('splitter');
    
 
    splitter.style.backgroundColor = 'rgba(' + (255 * Math.random()) + ',' +  (255 * Math.random()) + ',' +  (255 * Math.random()) + ', 0.5)'; 

    
    if (direction === 'horizontal') {
        parent.style.flexDirection = 'row'
        splitter.classList = 'splitter' + ' ' + 'horizontal-splitter'
        splitter.style.width = splitterSize + 'px';
        splitter.style.cursor = 'ew-resize'
        
    } else {

        parent.style.flexDirection = 'column'
        splitter.classList = 'splitter' + ' ' + 'vertical-splitter'
        splitter.style.height = splitterSize + 'px';
        splitter.style.cursor = 'ns-resize'

    }
    parent.append(areaLeft, splitter, areaRight);
    makeResizableDiv(splitter);
         

}



    function makeResizableDiv(splitter) {
    const element = splitter.previousElementSibling; //document.querySelector(div);
    const element2 = splitter.nextElementSibling;

    const minimum_size = 20;                    //Minimal size to stop resize

    splitter.addEventListener('mousedown', function(e) {
    e.preventDefault()
    original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
    original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
    original_x = element.getBoundingClientRect().left;
    original_y = element.getBoundingClientRect().top;
    original_width2 = parseFloat(getComputedStyle(element2, null).getPropertyValue('width').replace('px', ''));
    original_height2 = parseFloat(getComputedStyle(element2, null).getPropertyValue('height').replace('px', ''));
    original_x2 = element2.getBoundingClientRect().left;
    original_y2 = element2.getBoundingClientRect().top;

    original_widthS = parseFloat(getComputedStyle(splitter, null).getPropertyValue('width').replace('px', ''));
    original_heightS = parseFloat(getComputedStyle(splitter, null).getPropertyValue('height').replace('px', ''));
    original_xS = splitter.getBoundingClientRect().left;
    original_yS = splitter.getBoundingClientRect().top;

    original_mouse_x = e.pageX;
    original_mouse_y = e.pageY;
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResize)
    })
    

    //'horizontal-splitter' : 'vertical-splitter');
    function resize(e) {
        const parent = splitter.parentElement;
        if (splitter.classList.contains('horizontal-splitter')) {   
            const deltaX = e.pageX - original_mouse_x;                  //bottom-right
            const width = original_width + deltaX;
            const width2 = original_width2 - deltaX;

            const rect = parent.getBoundingClientRect();
            const localX = event.clientX - rect.left; // Координаты мыши по X в пределах div
            const localY = event.clientY - rect.top;  // Координаты мыши по Y в пределах div
            console.log('Локальные координаты мыши:', localX, localY, '           Координаты div:', rect.left, rect.top);


            if (width > minimum_size && width2 > minimum_size) {
            element.style.width = width + 'px'
            element2.style.width = width2 + 'px'
            element2.style.left = original_x2 + (e.pageX - original_mouse_x) + 'px'
            splitter.style.left = original_xS + (e.pageX - original_mouse_x) + 'px'
            console.log
            }
    
        }
        else if (splitter.classList.contains('vertical-splitter')) {
            const height = original_height + (e.pageY - original_mouse_y)
            const height2 = original_height2 - (e.pageY - original_mouse_y)
    
            if (height > minimum_size && height2 > minimum_size) {
            element.style.height = height + 'px'
            element2.style.height = height2 + 'px'
            element2.style.top = original_y2 + (e.pageY - original_mouse_y) + 'px'
            splitter.style.top = original_yS + (e.pageY - original_mouse_y) + 'px'
            }
        }
    
    


    }
    function stopResize() {
        window.removeEventListener('mousemove', resize)
        window.removeEventListener('mouseup', stopResize)
    }
    
}

    
//});

