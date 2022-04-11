// setPDF.js // test
// let docState = {
//     pdf: null,
//     pageNum: 1,
//     pageRendering: false,
//     pageNumPending: null,
//     scale: 1.2,
//     canvas: null,
//     context: null,
//     clear: function(pageNum){
//         if(pageNum){
//             pageNum = parseInt(pageNum);
//         }
//         else{
//             pageNum = 1;
//         }

//         this.pdf = null;
//         this.pageNum = pageNum;
//         this.pageRendering = false;
//         this.pageNumPending = null;
//         this.scale = 1.2;
//         this.canvas = null;
//         this.context = null;
//     }
// };


// setPDF.js // test
// let g_docPath = '';
let docUrl = '../docs/Document.pdf';
// let docUrl = '../docs/example.pdf';

var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";

function onInit(fileName, saveFileLoadFlag){

    console.log('onInit Start');

    if(fileName){
        callPDF(fileName, saveFileLoadFlag);
    }

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

    
    $('.btn_cmd').on('click', function(){
        deselectCtrl();
    });


    $('#btn_callPdf').on('click', function(){
        $('#btn_callPdf_hidden').click();
    });
    $('#btn_callPdf_hidden').on('change', function(){
        // C:\fakepath\example.pdf
        let path = this.value;
        path = path.split('\\');
        if(path[path.length - 1].substr(-3) == "pdf"){
            path.splice(0, 2);
            let url = '';
            for(let p of path){
                url += '/' + p;
            }
            console.log('pdf file selected');
            
            // pdf는 항상 docs 폴더 안에 있기로
            let docPath = 'docs' + url;
            docState.clear();
            callPDF(docPath);
        }
        else{
            console.log('wrong file');
        }

        $('#btn_callEdit_hidden').val('');
    });

    $('#btn_callEdit').on('click', function(){
        $('#btn_callEdit_hidden').click();
    });
    $('#btn_callEdit_hidden').on('change', function(){
        // C:\fakepath\example.pdf
        let path = this.value;
        path = path.split('\\');
        if(path[path.length -1].substr(-4) == 'html'){
            path.splice(0, 2);
            let url = '';
            for(let p of path){
                url += '/' + p;
            }

            // 저장한 화면은 항상 savedScreen에 있기로
            let docPath = 'savedScreen' + url;
            checkSaveFile(docPath);
        }
        else{
            console.log('wrong file');
        }

        $('#btn_callPdf_hidden').val('');
    });

    // 컨트롤 속성 지정
    // initCtrlProperty();
}

// setPDF.js // test
// // pageNum 페이지 띄워주기
// function renderPage(pageNum){
//     docState.pageRendering = true;
    
//     docState.pdf.getPage(pageNum).then(function(page){
//         var viewPort = page.getViewport({scale: docState.scale});
//         docState.canvas.height = viewPort.height;
//         docState.canvas.width = viewPort.width;

//         // 페이지에 해당하는 컨트롤 그려넣을 div elem block
//         // width, height 해당 pdf  페이지랑 똑같이 설정
//         $('.ctrlArea').css('display', 'none');
//         $('.ctrlArea')[pageNum-1].style.display = "block";
//         $('.ctrlArea')[pageNum-1].style.width = viewPort.width + "px";
//         $('.ctrlArea')[pageNum-1].style.height = viewPort.height + "px";

//         var renderContext = {
//             canvasContext: docState.context,
//             viewport: viewPort,
//         };
//         var renderTask = page.render(renderContext);

//         // page render after
//         renderTask.promise.then(function(){
//             docState.pageRendering = false;
//             if(docState.pageNumPending != null){
//                 renderPage(docState.pageNumPending);
//                 docState.pageNumPending = null;
//             }

//             // 선택한 미리보기 화면 테두리
//             $('#sideView .sidePdfPage.selected').removeClass('selected');
//             $('#sideView .sidePdfPage')[docState.pageNum - 1].classList.add('selected');

//             // 선택된 미리보기 화면으로 스크롤
//             // $('#sideView').scrollTop($('#sideView .sidePdfPage.selected').offset().top - 200);
//             $('#sideView').scrollTop($('#sideView .sidePdfPage.selected')[0].offsetTop - 200);
//         });
//     });

//     $('#pdfCurrentPageNum').val(pageNum);
// }

// function qRenderPage(pageNum){
//     if(docState.pageRendering){
//         // 페이지 그려지는 중이면
//         // 보류했다가 끝나면 rendering
//         docState.pageNumPending = pageNum;
//     }
//     else{
//         renderPage(pageNum);
//     }
// }

// function previousPage(){
//     console.log('previousPage clicked');
//     if(docState.pageNum <= 1){
//         return;
//     }
//     qRenderPage(--docState.pageNum);
// }


// function nextPage(){
//     console.log('nextPage clicked');
//     if(docState.pageNum >= docState.pdf.numPages){
//         return;
//     }
//     qRenderPage(++docState.pageNum);
// }


let g_CreateControl = false;
var g_selectedControl = null;

function setCtrlAreaClickEvent(){
    $('.ctrlArea').on('click', function(e){
        if(g_CreateControl){
            // 컨트롤 마우스 클릭 위치에 생성
            g_CreateControl(e);
        }
        else{
            // 선택된 컨트롤 선택 해제
            deselectCtrl();

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

function createControl(tag){
    function _createControl(tag){
        return function(e){
            let ctrl;
            switch(tag){
                case 'input':
                    ctrl = document.createElement('input');
                    ctrl.dataset['ctrlType'] = "text";
                    break;
                case 'chkBox':
                    ctrl = document.createElement('div');
                    ctrl.classList.add('chkBox');
    
                    let chkbox = document.createElement('input');
                    chkbox.type = "checkbox";
                    let span = document.createElement('span');
                    

                    chkbox.addEventListener('change', function(e){
                        ctrl.dataset['checked'] = chkbox.checked;
                    });

                    ctrl.dataset['ctrlType'] = "chkBox";
                    ctrl.append(chkbox);
                    ctrl.append(span);
                    break;
                case 'cmbBox':
                    // ctrl = document.createElement('select');
                    // ctrl.classList.add('cmbBox');
                    // ctrl.dataset['ctrlType'] = 'cmbBox';
                    ctrl = combo();
                    ctrl.dataset['ctrlType'] = "cmbBox";
                    break;
                case 'canvas':
                    ctrl = canvas.createCanvas();
                    ctrl.dataset['ctrlType'] = 'canvas';
                    break;
                case 'radio':
                    // ctrl = radio();
                    ctrl = radio.create();
                    ctrl.dataset['ctrlType'] = 'radio';
                    break;
                default:
                    return;
            }
            if(ctrl){
                ctrl.classList.add("ctrl");
                $('.ctrlArea')[docState.pageNum-1].append(ctrl);
                setCtrlEvent(ctrl);
                setCreatingCtrlPosition(ctrl, [e.offsetX, e.offsetY]);
                cancelCreaetControl();
                ctrlClicked(ctrl);

                if(tag == 'canvas'){
                    canvas.setSize(ctrl);
                }
            }
            else{
                console.log('control Create error');
                console.log('pdfTest.js  func createControl');
            }
        }
    }
    g_CreateControl = _createControl(tag);

    changeMousePointer(g_CreateControl);
}

// 생성 위치가 영역 안인지 확인, 위치 초기화
// pos = [e.offsetX, e.offsetY]
function setCreatingCtrlPosition(ctrl, pos){
    let container = ctrl.parentElement;
    
    if(pos[0] > container.offsetWidth - ctrl.offsetWidth){
        ctrl.style.left = (container.offsetWidth - ctrl.offsetWidth) + 'px';
    }
    else if(pos[0] < 0){
        ctrl.style.left = '0px';
    }
    else{
        ctrl.style.left = pos[0] + "px";
    }

    if(pos[1] > container.offsetHeight - ctrl.offsetHeight){
        ctrl.style.top = (container.offsetHeight - ctrl.offsetHeight) + 'px';
    }
    else if(pos[1] < 0){
        ctrl.style.top = '0px';
    }else{
        ctrl.style.top = pos[1] + "px";
    }
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
    
    deselectCtrl();

    g_selectedControl = elem;
    ctrl_setAttrInfo(g_selectedControl);
    elem.classList.add('selected');
    $('.btn_delete_control').prop('disabled', false);
    // 선택한 컨트롤 드래그로 이동가능
    ctrlDragController.setCtrlDraggable(elem);
}

function deselectCtrl(){
    if(g_selectedControl){
        g_selectedControl.classList.remove('selected');
        ctrlDragController.clear();
        g_selectedControl = null;
    
        clearAttrInput();
        $('.btn_delete_control').prop('disabled', true);
    }
}

function deleteCtrl(){
    if(g_selectedControl){
        let elem = g_selectedControl;
        deselectCtrl();
        $(elem).remove();
    }
}
// 컨트롤에 기본 이벤트 지정
function setCtrlEvent(ctrl){

    ctrl.addEventListener('click', function(e){
        e.stopPropagation();
        ctrlClicked(this);
    });

    switch(ctrl.dataset['ctrlType']){
        case 'text':
            ctrl.addEventListener('input', function(e){
                ctrl.dataset['text'] = ctrl.value;
            })
            break;
        case 'chkBox':
            break;
        case 'cmbBox':
            // ctrl.addEventListener('change', function(e){
            //     ctrl.dataset['selectedValue'] = ctrl.value;
            // })
            break;
        // case 'canvas':
        //     canvas.setEvent(ctrl);
        //     break;
        default:
            break;
    }

}
// 파일 불러왔을 때
// 컨트롤 기본 이벤트 다시 입력
function resetCtrlEvent(){
    $('.ctrl').each(function(idx, ctrl){
        ctrl.addEventListener('click', function(e){
            e.stopPropagation();
            ctrlClicked(this);
        });

        if(ctrl.dataset['ctrlType'] == "text"){
            ctrl.value = ctrl.dataset['text'] || '';
            ctrl.addEventListener('input', function(e){
                ctrl.dataset['text'] = ctrl.value;
            });

            ctrl.addEventListener('input', maxLenChk);
        }
        else if(ctrl.dataset['ctrlType'] == 'cmbBox'){
            // let selected = ctrl.dataset['selectedValue'] || ctrl.value;
            // ctrl.value = selected;

            // ctrl.addEventListener('change', function(e){
            //     ctrl.dataset['selectedValue'] = ctrl.value;
            // })

            resetCombo(ctrl);
        }
        else if(ctrl.dataset['ctrlType'] == 'chkBox'){
            $(ctrl).find('input').prop('checked', ctrl.dataset['checked']);
            $(ctrl).find('input').on('onChange', function(e){
                ctrl.dataset['checked'] = this.checked;
            })
        }
        // else if(ctrl.dataset['ctrlType'] == 'canvas'){
        //     canvas.setEvent(ctrl);
        // }
        else if(ctrl.dataset['ctrlType'] == 'radio'){
            radio.reset(ctrl);
        }
    });
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
        if(0 < left && left < ctrlDragController.container.width){
            ctrlDragController.ctrl.style.left = left + "px";
        }
        else{
            if(left < 0){
                ctrlDragController.ctrl.style.left = '0px';
            }
            else if(ctrlDragController.container.width < left){
                ctrlDragController.ctrl.style.left = ctrlDragController.container.width + 'px';
            }
        }
        if( 0 < top && top < ctrlDragController.container.height){
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







let testFileName = 'test.html';
function checkSaveFile(fileName){
    // fileName = testFileName;
    if(fileName){
        $.ajax({
            url: fileName,
            // url: window.location.origin + '/esign/pdfTest/' + 'test.html',
            type: 'HEAD',
            error: function(){
                console.log('file not exists');
                alert(fileName + '없어용');
                // setEmptyScreen();
                // includeHTML();
            },
            success: function(){
                console.log('file exists');
                includeHTML(fileName);
            }
        })
    }
    else{
        // <div w3-include-html="innerFrame.html" class="contentArea htmlContainer"></div>
        // setEmptyScreen();
    }
    
}
function includeHTML(fileName) {
    console.log('start including HTML');
    
    if(fileName){
        $('.htmlContainer').attr('w3-include-html', fileName);
    }


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

                let docPath = elmnt.querySelector('.pdfContentArea').dataset.docPath;
                docState.clear(elmnt.querySelector('.pdfContentArea').dataset.docPageNum);
                callPDF(docPath, 'edit');
                
                // onInit(fileName, true);
                // initCtrlProperty();
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

// pdf 공간 빈 칸으로
function setEmptyScreen(){
    let div = document.createElement('div');
    div.classList.add('pdfContentArea');

    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'pdfArea');

    div.append(canvas);
    $('.htmlContainer').append(div);

    g_docPath = '';
}



function savePage(){
    deselectCtrl();

    // 나중에 불러올 pdf, 현재 페이지 정보 저장
    $('.pdfContentArea')[0].dataset.docPath = g_docPath;
    $('.pdfContentArea')[0].dataset.docPageNum = docState.pageNum;

    let text = $('.pdfContentArea').parent().html();
    
    console.log(text);
    let html = `
    <html>
        ${text}
    </html>`;
    let save = document.createElement('a');
    save.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(html));
    save.setAttribute('download', testFileName);
    save.click();
    URL.revokeObjectURL(save.href);

    saveAsJson();
}

// setPDF.js // test
// function callPDF(docPath, saveFileLoadFlag){

//     // sideView 초기화
//     $('#sideView').empty();

//     if($('.pdfContentArea').length){
//         if(!saveFileLoadFlag){
//             // 편집화면 불러오기 아닌 경우
//             // 컨트롤 그리는 공간 초기화시켜줘야

//             // $('.pdfContentArea').empty();
//             $('.pdfContentArea').remove();
//             setEmptyScreen();
//         }
//     }
//     else{
//         // 혹시라도 없는 경우
//         setEmptyScreen();
//     }

//     // setEmptyScreen()에서 g_docPath를 ''으로 초기화시킴
//     g_docPath = docPath;


//     // pdf 비동기로 불러옴
//     var loadingTask = pdfjsLib.getDocument(docPath);
//     loadingTask.promise.then(function(pdf){
//         console.log('pdf loaded');

//         docState.pdf = pdf;
//         // 화면 상단 pdf 페이지 수, input elem의 최소, 최대값 설정
//         $('#pdfTotalPageNum').text(docState.pdf.numPages);
//         $('#pdfCurrentPageNum').attr({
//             max: docState.pdf.numPages,
//             min: 1,
//         });

//         if(saveFileLoadFlag){
//             resetCtrlEvent();
//         }
//         else{
//             // 페이지 수만큼 컨트롤 입력할 공간 생성
//             for(let idx = 0; idx < docState.pdf.numPages; idx++){
//                 let div = document.createElement('div');
//                 div.classList.add('ctrlArea');
//                 $('.pdfContentArea').append(div);
//             }
//         }
//         // 페이지 공간 클릭시 이벤트 설정
//         setCtrlAreaClickEvent();

//         docState.canvas = document.getElementById('pdfArea');
//         docState.context = docState.canvas.getContext('2d');

//         // renderPage(docState.pageNum));

//         // pdf공간 옆에 미리보기화면
//         docState.pdf.getPage(1).then(function(page){
//             setSideView(page, 1);
//         })
//     });

// }

// setPDF.js // test
// // pdf 공간 옆에 미리보기화면 생성
// function setSideView(page, pageNum){
//     let wscale = 200/page.view[2];
//     let viewPort = page.getViewport({scale: wscale});

//     let div = document.createElement('div');
//     div.classList.add('sidePdfPageBlock');
//     let p = document.createElement('p');
//     p.textContent = pageNum + '.';
    
//     let canvas = document.createElement('canvas');
//     canvas.classList.add('sidePdfPage');
//     canvas.height = viewPort.height;
//     canvas.width = viewPort.width;
//     canvas.addEventListener('click', function(){
//         // $('#sideView').scrollTop(this.offsetTop - 200);
//         docState.pageNum = pageNum;
//         renderPage(pageNum);
//     });
//     canvas.title = `${pageNum}/${docState.pdf.numPages}`;

//     let context = canvas.getContext('2d');

//     let renderContext = {
//         canvasContext: context,
//         viewport: viewPort,
//     };

//     page.render(renderContext).promise.then(()=>{
//         div.append(p);
//         div.append(canvas);
//         $('#sideView').append(div);

//         if(pageNum < docState.pdf.numPages){
//             // 다음페이지 미리보기 생성
//             docState.pdf.getPage(pageNum+1).then(function(_page){
//                 setSideView(_page, pageNum+1);
//             });
//         }
//         else{
//             console.log('setSideView End');
//             // $('#sideView .sidePdfPage')[docState.pageNum-1].classList.add('selected');
//             renderPage(docState.pageNum);
//         }
//     });
// }


function saveAsJson(){
    let jsonData = {
        pdfPath: g_docPath,
        pages: [],
    };

    $('.ctrlArea').each(function(idx, area){
        let ctrlData = [];
        for(let ctrl of area.children){
            let data = {};
            data.type = ctrl.dataset['ctrlType'];
            data.name = ctrl.dataset.name || '';
            data.property = [];
            switch(data.type){
                case 'text':
                    data.property.push({type: (ctrl.getAttribute('type') || 'text')});
                    if(ctrl.getAttribute('maxlength')){
                        data.property.push({maxLength: ctrl.getAttribute('maxlength')});
                    }
                    if(ctrl.dataset['text']){
                        data.caption = ctrl.dataset['text'];
                    }
                    break;
                case 'cmbBox':
                    data.property.push({itemList: ctrl.combo.itemList});
                    data.option = {selected: $(ctrl).find('li.selected').val()}
                    break;
                case 'chkBox':
                    data.property.push({caption: ctrl.getAttribute['caption']});
                    data.option = {selected: true};
                    break;
                default:
                    continue;
            }

            data.pos = {
                left: ctrl.style.left,
                top: ctrl.style.top,
            };

            ctrlData.push(data);
        }

        jsonData.pages.push(ctrlData);
    });

    let blob = new Blob([JSON.stringify(jsonData)], {type: 'application/json'});
    window.saveAs(blob, 'test.json');
}

// let json = {
//     pdfName: 'asdfasdf.pdf',
//     pages: [
//         [{
//             type: 'input',
//             name: '',
//             property: [
//                 {
//                     type: 'number',
//                     maxLength: 3,
//                 },
//             ],
//             caption: 'asdf'
//             pos: {left: '10px', top: '10px'},
//         },
//         {
//             type: 'cmbBox',
//             name: '',
//             property: [
//                 {itemList: [{val: val, txt: txt}]},
//             ],
//             option: {selected: 'val'},
//             pos: {left, top}
//         },
//         {
//             type: 'chkBox',
//             name: '',
//             property: [
//                 {
//                     caption: 'asdf',
//                 }
//             ],
//             option: {selected: true},
//             pos: {left, top}
//         },], // page1
//         [], // page2 ...
//         [],
//     ],
// };