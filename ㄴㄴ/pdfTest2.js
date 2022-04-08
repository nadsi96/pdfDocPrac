let docState = {
    pdf: null,
    pageNum: 1,
    pageRendering: false,
    pageNumPending: null,
    scale: 1.2,
    canvas: null,
    context: null,
};

let docUrl = '../docs/Document.pdf';
// let docUrl = '../docs/example.pdf';

var iframe;
function onInit(){

    iframe=  document.getElementsByTagName('iframe')[0];
    console.log('onInit Start');
    // 모듈
    var pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";

    // pdf 비동기로 불러옴
    var loadingTask = pdfjsLib.getDocument(docUrl);
    loadingTask.promise.then(function(pdf){
        console.log('pdf loaded');

        docState.pdf = pdf;
        // 화면 상단 pdf 페이지 수, input elem의 최소, 최대값 설정
        $('#pdfTotalPageNum').text(docState.pdf.numPages);
        $('#pdfCurrentPageNum').attr({
            max: docState.pdf.numPages,
            min: 1,
        })

        // 페이지 수만큼 컨트롤 입력할 공간 생성
        for(let idx = 0; idx < docState.pdf.numPages; idx++){
            let div = document.createElement('div');
            div.classList.add('ctrlArea');

            // $('.pdfContentArea').append(div);
            $('.contentArea').contents().find('.pdfContentArea').append(div);
        }
        // 해당 공간 클릭시 이벤트 설정
        setCtrlAreaClickEvent();

        docState.canvas = iframe.contentWindow.document.getElementById('pdfArea');
        docState.context = docState.canvas.getContext('2d');

        renderPage(docState.pageNum);
    });

    // 페이지 변경 이벤트
    $('#btn_prev').on('click', previousPage);
    $('#btn_next').on('click', nextPage);
    $('#pdfCurrentPageNum').on('change', function(){
        let pageNum = parseInt($('#pdfCurrentPageNum').val());
        console.log('pdfCurrentPageNum Changed');
        console.log(pageNum);
        docState.pageNum = pageNum;
        if(pageNum < 1){
            $('#pdfCurrentPageNum').val(1);
            docState.pageNum = 1;
        }
        else if(pageNum > docState.pdf.numPages){
            $('#pdfCurrentPageNum').val(docState.pdf.numPages);
            docState.pageNum = docState.pdf.numPages;
        }
        renderPage(docState.pageNum);
    });
}

// pageNum 페이지 띄워주기
function renderPage(pageNum){
    docState.pageRendering = true;
    
    docState.pdf.getPage(pageNum).then(function(page){
        var viewPort = page.getViewport({scale: docState.scale});
        docState.canvas.height = viewPort.height;
        docState.canvas.width = viewPort.width;

        // 페이지에 해당하는 컨트롤 그려넣을 div elem block
        // width, height 해당 pdf  페이지랑 똑같이 설정
        let ctrlArea = $('.contentArea').contents().find('.ctrlArea');
        ctrlArea.css('display', 'none');
        ctrlArea[pageNum-1].style.display = "block";
        ctrlArea[pageNum-1].style.width = viewPort.width + "px";
        ctrlArea[pageNum-1].style.height = viewPort.height + "px";

        var renderContext = {
            canvasContext: docState.context,
            viewport: viewPort,
        };
        var renderTask = page.render(renderContext);

        // page render after
        renderTask.promise.then(function(){
            docState.pageRendering = false;
            if(docState.pageNumPending != null){
                renderPage(docState.pageNumPending);
                docState.pageNumPending = null;
            }
        });
    });

    $('#pdfCurrentPageNum').val(pageNum);
}

function qRenderPage(pageNum){
    if(docState.pageRendering){
        // 페이지 그려지는 중이면
        // 보류했다가 끝나면 rendering
        docState.pageNumPending = pageNum;
    }
    else{
        renderPage(pageNum);
    }
}

function previousPage(){
    console.log('previousPage clicked');
    if(docState.pageNum <= 1){
        return;
    }
    qRenderPage(--docState.pageNum);
}


function nextPage(){
    console.log('nextPage clicked');
    if(docState.pageNum >= docState.pdf.numPages){
        return;
    }
    qRenderPage(++docState.pageNum);
}


let g_CreateControl = 0;
var g_selectedControl = null;

function setCtrlAreaClickEvent(){
    $('.ctrlArea').on('click', function(e){
        if(g_CreateControl){
            // 컨트롤 마우스 클릭 위치에 생성
            g_CreateControl(e);
        }
        else{
            if(g_selectedControl){
                // 선택된 컨트롤 선택 해제
                deselectCtrl();
            }

            // 클릭된 곳에 파란 점 찍
            let blueDot = document.createElement('div');
            blueDot.style.top = e.offsetY + "px";
            blueDot.style.left = e.offsetX + "px";
            blueDot.classList.add("blueDot");
            $('.ctrlArea')[docState.pageNum-1].append(blueDot);
        }
    });
}
function cancelCreaetControl(){
    g_CreateControl = false;
    changeMousePointer(g_CreateControl);
}

function creaetControl(){
    g_CreateControl = function(e){
        let ctrl = document.createElement('input');
        ctrl.style.top = e.offsetY + "px";
        ctrl.style.left = e.offsetX + "px";
        ctrl.classList.add("ctrl");
        
        ctrl.addEventListener("click", function(e){
            e.stopPropagation();
            ctrlClicked(this);
        });
        $('.ctrlArea')[docState.pageNum-1].append(ctrl);
        cancelCreaetControl();
        ctrlClicked(ctrl);
    };
    changeMousePointer(g_CreateControl);
}

function changeMousePointer(flag){
    let body = document.getElementsByTagName("body")[0];
    if(flag){
        body.style.cursor = "crosshair";
    }
    else{
        body.style.cursor = "default";

    }
}

function ctrlClicked(elem){
    console.log('ctrlClicked check g_selected exist');
    if(g_selectedControl){
        deselectCtrl();
    }

    g_selectedControl = elem;
    ctrl_setAttrInfo(g_selectedControl);
    elem.classList.add('selected');
    // 선택한 컨트롤 드래그로 이동가능
    ctrlDragController.setCtrlDraggable(elem);
}
function deselectCtrl(){
    g_selectedControl.classList.remove('selected');
    ctrlDragController.clear();
    g_selectedControl = null;

    clearAttrInput();
}

var ctrlDragController = {
    ctrl: null,
    container: null,
    dragPrePos: [0,0],
    dragPos: [0,0],
    setCtrlDraggable: function(elem){
        this.ctrl = elem;
        this.setContainerWH();

        this.dragPrePos = [0,0];
        this.dragPos = [0,0];
        this.ctrl.onmousedown = this.ctrlDragStart;
    },
    setContainerWH: function(){
        this.container = {
            width: this.ctrl.parentElement.offsetWidth - this.ctrl.offsetWidth,
            height: this.ctrl.parentElement.offsetHeight - this.ctrl.offsetHeight,
        };
    },
    ctrlDragStart: function(e){
        e.stopPropagation();

        ctrlDragController.dragPrePos[0] = e.clientX;
        ctrlDragController.dragPrePos[1] = e.clientY;

        document.onmouseup = ctrlDragController.ctrlDragEnd;
        document.onmousemove = ctrlDragController.ctrlDragging;
    },
    ctrlDragging: function(e){
        e.stopPropagation();

        ctrlDragController.dragPos[0] = ctrlDragController.dragPrePos[0] - e.clientX;
        ctrlDragController.dragPos[1] = ctrlDragController.dragPrePos[1] - e.clientY;

        ctrlDragController.dragPrePos[0] = e.clientX;
        ctrlDragController.dragPrePos[1] = e.clientY;

        let left = (ctrlDragController.ctrl.offsetLeft - ctrlDragController.dragPos[0]);
        let top = (ctrlDragController.ctrl.offsetTop - ctrlDragController.dragPos[1]);
        
        // 범위 안에서만 이동
        if(0 < left && left < ctrlDragController.container.width && 0 < top && top < ctrlDragController.container.height){
            ctrlDragController.ctrl.style.left = left + "px";
            ctrlDragController.ctrl.style.top = top + "px";
        }
    },
    ctrlDragEnd: function(e){
        document.onmouseup = null;
        document.onmousemove = null;
    },
    clear: function(){
        this.ctrl.onmousedown = null;
        this.ctrl = null,
        this.container = null,
        this.dragPrePos = [0,0];
        this.dragPos = [0,0];
    }
}








function includeHTML() {
    console.log('start including HTML');
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
                elmnt.innerHTML = this.responseText;

                onInit();
                initCtrlProperty();
            }
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("w3-include-html");
            // includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        console.log('end includeing HTML');
        return;
      }
    }
  }






function savePage(){

}