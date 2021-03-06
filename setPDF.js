var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";


var g_docPath = '';
var docState = {
    pdf: null,
    pageNum: 1,
    pageRendering: false,
    pageNumPending: null,
    scale: 1.2,
    canvas: null,
    context: null,
    clear: function(pageNum){
        if(pageNum){
            pageNum = parseInt(pageNum);
        }
        else{
            pageNum = 1;
        }

        this.pdf = null;
        this.pageNum = pageNum;
        this.pageRendering = false;
        this.pageNumPending = null;
        this.scale = 1.2;
        this.canvas = null;
        this.context = null;
    }
};



// pageNum 페이지 띄워주기
function renderPage(pageNum, settingSideView){
    docState.pageRendering = true;
    
    $('#pdfCurrentPageNum').val(pageNum);

    return docState.pdf.getPage(pageNum).then(function(page){
        let viewPort = page.getViewport({scale: docState.scale});
        docState.canvas.height = viewPort.height;
        docState.canvas.width = viewPort.width;

        // 페이지에 해당하는 컨트롤 그려넣을 div elem block
        // width, height 해당 pdf  페이지랑 똑같이 설정
        $('.ctrlArea').css('display', 'none');
        $('.ctrlArea')[pageNum-1].style.display = "block";
        $('.ctrlArea')[pageNum-1].style.width = viewPort.width + "px";
        $('.ctrlArea')[pageNum-1].style.height = viewPort.height + "px";

        let renderContext = {
            canvasContext: docState.context,
            viewport: viewPort,
        };
        let renderTask = page.render(renderContext);

        // page render after
        return renderTask.promise.then(function(){
            docState.pageRendering = false;
            if(docState.pageNumPending != null){
                renderPage(docState.pageNumPending);
                docState.pageNumPending = null;
            }

            // 선택한 미리보기 화면 테두리
            $('#sideView .sidePdfPage.selected').removeClass('selected');
            $('#sideView .sidePdfPage')[docState.pageNum - 1].classList.add('selected');

            // 선택된 미리보기 화면으로 스크롤
            // $('#sideView').scrollTop($('#sideView .sidePdfPage.selected').offset().top - 200);
            $('#sideView').scrollTop($('#sideView .sidePdfPage.selected')[0].offsetTop - 200);

            if(settingSideView){
                $('.contentContainer').css('height', $('.htmlContainer').css('height'));
            }
        });
    });
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



// fileLoadFlag
// '' - 처음여는 pdf 파일
// 'edit' - pdf 편집
// 'client' - open on client side
function callPDF(docPath, fileLoadFlag){

    // sideView 초기화
    $('#sideView').empty();

    if($('.pdfContentArea').length){
        if(!fileLoadFlag){
            // 편집화면 불러오기 아닌 경우
            // 컨트롤 그리는 공간 초기화시켜줘야

            // $('.pdfContentArea').empty();
            $('.pdfContentArea').remove();
            setEmptyScreen();
        }
    }
    else{
        // 혹시라도 없는 경우
        setEmptyScreen();
    }

    // setEmptyScreen()에서 g_docPath를 ''으로 초기화시킴
    g_docPath = docPath;


    // pdf 호출
    var loadingTask = pdfjsLib.getDocument(docPath);
    loadingTask.promise.then(function(pdf){
        console.log('pdf loaded');

        docState.pdf = pdf;
        // 화면 상단 pdf 페이지 수, input elem의 최소, 최대값 설정
        $('#pdfTotalPageNum').text(docState.pdf.numPages);
        $('#pdfCurrentPageNum').attr({
            max: docState.pdf.numPages,
            min: 1,
        });

        if(fileLoadFlag == 'client'){
            // setCtrlData();
        }
        else{
            if(fileLoadFlag == 'edit'){
                resetCtrlEvent();
            }
            else{
                // 페이지 수만큼 컨트롤 입력할 공간 생성
                for(let idx = 0; idx < docState.pdf.numPages; idx++){
                    let div = document.createElement('div');
                    div.classList.add('ctrlArea');
                    $('.pdfContentArea').append(div);
                }
            }
            // 페이지 공간 클릭시 이벤트 설정
            setCtrlAreaClickEvent();
        }

        docState.canvas = document.getElementById('pdfArea');
        docState.context = docState.canvas.getContext('2d');

        if(fileLoadFlag == "client"){
            // $('#docArea').empty();
            $('.docPageClone').remove();
            if(docState.pdf.numPages >= 1){
                renderAllPage(1);
            }
        }
        else{
            // pdf공간 옆에 미리보기화면
            docState.pdf.getPage(1).then(function(page){
                setSideView(page, 1);
            })
        }
    });

}

// pdf 공간 옆에 미리보기화면 생성
function setSideView(page, pageNum){
    let wscale = 200/page.view[2];
    let viewPort = page.getViewport({scale: wscale});

    let clone = $('#copySideView').clone(true);
    clone.css('display', 'flex');
    clone.find('p').text(pageNum + '.');
    
    let canvas = clone.find('canvas')[0];
    
    canvas.height = viewPort.height;
    canvas.width = viewPort.width;
    canvas.addEventListener('click', function(){
        docState.pageNum = pageNum;
        renderPage(pageNum);
    });
    canvas.title = `${pageNum}/${docState.pdf.numPages}`;

    let context = canvas.getContext('2d');

    let renderContext = {
        canvasContext: context,
        viewport: viewPort,
    };

    page.render(renderContext).promise.then(()=>{
        $('#sideView').append(clone);

        if(pageNum < docState.pdf.numPages){
            // 다음페이지 미리보기 생성
            docState.pdf.getPage(pageNum+1).then(function(_page){
                setSideView(_page, pageNum+1);
            });
        }
        else{
            console.log('setSideView End');
            // $('#sideView .sidePdfPage')[docState.pageNum-1].classList.add('selected');
            renderPage(docState.pageNum, true);
        }
    });
}


// 모든 페이지 화면에 출력
function renderAllPage(pageNum){
    let srcPdfArea = document.getElementById('pdfArea');
    let canvasW = srcPdfArea.offsetWidth;
    let canvasH = srcPdfArea.offsetHeight;

    let clone = $('#copyDocPage').clone(true);
    clone.css('display', 'block');
    clone.addClass('docPageClone');
    clone.addClass('pageBorder');

    let pdfArea = clone.find('canvas')[0];
    docState.canvas = pdfArea;
    docState.context = docState.canvas.getContext('2d');

    pdfArea.width = canvasW;
    pdfArea.height = canvasH;

    return docState.pdf.getPage(pageNum).then(function(page){
        let viewPort = page.getViewport({scale: docState.scale});
        docState.canvas.height = viewPort.height;
        docState.canvas.width = viewPort.width;

        let ctrlArea = $('.ctrlArea')[pageNum-1].cloneNode(true);
        ctrlArea.classList.remove('ctrlArea');
        ctrlArea.classList.add('copyCtrlArea');
        ctrlArea.style.position = 'absolute';
        ctrlArea.style.display = 'block';
        ctrlArea.style.top = '0px';
        ctrlArea.style.left = '0px';
        ctrlArea.style.width = viewPort.width + "px";
        ctrlArea.style.height = viewPort.height + 'px';
        clone.find('.copyDocContent').append(ctrlArea);

        let renderContext = {
            canvasContext: docState.context,
            viewport: viewPort,
        };
        let renderTask = page.render(renderContext);

        // page render after
        return renderTask.promise.then(function(){

            // pdfArea
            $("#docArea").append(clone);

            // sideView
            let wscale = 200/page.view[2];
            let viewPort = page.getViewport({scale: wscale});

            let sideClone = $('#copySideView').clone(true);
            sideClone.css('display', 'flex');
            sideClone.attr('title', `${pageNum}/${docState.pdf.numPages}`);
            sideClone.find('p').text(pageNum + '.');

            let sideCanvas = sideClone.find('canvas')[0];
            sideCanvas.width = viewPort.width;
            sideCanvas.height = viewPort.height;
            sideCanvas.getContext('2d').drawImage(pdfArea, 0, 0, viewPort.width, viewPort.height);
            
            sideCanvas.addEventListener('click', function(){
                $('#sideView .sidePdfPage.selected').removeClass('selected');
                this.classList.add('selected')
                $('#sideView').scrollTop(this.offsetTop - 200);
                // $('#docArea').scrollTop(clone.offset().top - 100);
                $('#docArea').scrollTop(clone[0].offsetTop - 100);
                docState.pageNum = pageNum;
                $('#pdfCurrentPageNum').val(pageNum);
            });
            $('#sideView').append(sideClone);

            if(pageNum < docState.pdf.numPages){
                renderAllPage(pageNum+1);
            }
            else{
                setCtrlData();
                $('#sideView .sidePdfPage').first().addClass('selected')
                $('.htmlContainer').empty();
            }
        });
    });
}
