function onInit(){
    $('#btn_openDoc').on('click', function(){
        $('#btn_openDoc_hidden').click();
    })
    $('#btn_openDoc_hidden').on('change', function(e){
        // C:\fakepath\example.html
        let path = this.value.split('\\');
        if(path[path.length - 1].substr(-4) == 'html'){
            path.splice(0, 2);
            let url = 'savedScreen';
            for(let p of path){
                url += '/' + p;
            }
            checkSaveFile(url);
        }
        else{
            console.log('wrong file');
        }
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

    $('#btn_saveAsPdf').on('click', saveToPDF);
}

// let testFileName = 'savedScreen/test (2).html';
let testFileName = 'savedScreen/test (4).html';
function checkSaveFile(fileName){
    // fileName = testFileName;
    $.ajax({
        url: fileName,
        type: 'HEAD',
        error: function(){
            console.log('file not exists');
            // includeHTML();
        },
        success: function(){
            console.log('file exists');
            includeHTML(fileName);
        }
    })
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

                // html에 해당하는 pdf 호출
                let pdfPath = elmnt.querySelector('.pdfContentArea').dataset.docPath;
                docState.clear();
                // setDocu(pdfPath);
                callPDF(pdfPath, 'client');
                
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




// setPDF.js // test
// let docState = {
//     pdf: null,
//     pageNum: 1,
//     pageRendering: false,
//     pageNumPending: null,
//     scale: 1.2,
//     canvas: null,
//     context: null,
//     clear: function(){
//         this.pdf = null;
//         this.pageNum = 1;
//         this.pageRendering = false;
//         this.pageNumPending = null;
//         this.scale = 1.2;
//         this.canvas = null;
//         this.context = null;
//     }
// };

let docUrl = '../docs/Document.pdf';
// let docUrl = '../docs/example.pdf';
// pdf 그리기
// setPDF.js // test
// function setDocu(pdfPath){

//     console.log('setDocu Start');
    
//     var pdfjsLib = window['pdfjs-dist/build/pdf'];
//     pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";

//     // pdf 비동기로 불러옴
//     var loadingTask = pdfjsLib.getDocument(pdfPath);
//     loadingTask.promise.then(function(pdf){
//         console.log('pdf loaded');

//         docState.pdf = pdf;
//         // 화면 상단 pdf 페이지 수, input elem의 최소, 최대값 설정
//         $('#pdfTotalPageNum').text(docState.pdf.numPages);
//         $('#pdfCurrentPageNum').attr({
//             max: docState.pdf.numPages,
//             min: 1,
//         })

//         // 컨트롤 속성들 재설정
//         setCtrlData();

//         docState.canvas = document.getElementById('pdfArea');
//         docState.context = docState.canvas.getContext('2d');

//         renderPage(docState.pageNum);
//     });
// }

// setPDF.js // test
// // pageNum 페이지 띄워주기
// function renderPage(pageNum){
//     docState.pageRendering = true;
//     console.log('renderPage ' + docState.pageRendering);

//     $('#pdfCurrentPageNum').val(pageNum);

//     return docState.pdf.getPage(pageNum).then(function(page){
//         console.log('getPage');
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
//         console.log(renderContext);
//         var renderTask = page.render(renderContext);

//         // page render after
//         return renderTask.promise.then(function(){
//             docState.pageRendering = false;
//             if(docState.pageNumPending != null){
//                 renderPage(docState.pageNumPending);
//                 docState.pageNumPending = null;
//             }
//         });
//     });

    
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
//         return false;
//     }
//     qRenderPage(++docState.pageNum);
// }





// 페이지마다 pdf페이지, 컨트롤 포함된 div 복사해서
// display block으로 주고 save시키면 되려나
function saveToPDF(){
    console.log('save as pdf');

    if(checkEmptyItem()){
        // 필수항목 다 채워짐
    }
    else{
        // ㄴㄴ
        alert('asdf');
        return;
    }
    // 캔버스에 clear버튼 제거
    $('.btn_canvasClear').remove();
    $('.cmbBox ul').css('display', 'none');

    $('#toPdfArea').remove(); // test
    // // 1페이지로 이동 후 동작
    let toPdf = document.createElement('div');
    toPdf.setAttribute('id', 'toPdfArea');
    toPdf.height = 'fit-content';

    renderPage(1).then(()=>{
        copyPage(toPdf, 1);
    });
    
    // toPdfFile();
}

// pdf페이지, 해당 페이지의 컨트롤 div copy
// toPdf에 append
function copyPage(toPdf, pageNum){
    
    let pdfArea = document.getElementById('pdfArea');
    let canvasW = pdfArea.offsetWidth;
    let canvasH = pdfArea.offsetHeight;

    let page = document.createElement('div');
    
    let pdfPageCanvas = document.createElement('canvas');
    pdfPageCanvas.style.position = 'relative';
    pdfPageCanvas.width = canvasW;
    pdfPageCanvas.height = canvasH;

    let ctx = pdfPageCanvas.getContext('2d');
    ctx.drawImage(pdfArea, 0, 0);

    let ctrlArea = $('.ctrlArea')[pageNum-1].cloneNode(true);
    ctrlArea.style.display = 'block';
    ctrlArea.style.position = 'absolute';
    ctrlArea.classList.remove('ctrlArea');
    ctrlArea.style.top = '0px';
    ctrlArea.style.left = '0px';
    
    // canvas 내용 복사
    let srcCanvas = $($('.ctrlArea')[pageNum-1]).find('.ctrl_canvas');
    let destCanvas = $(ctrlArea).find('.ctrl_canvas');
    for(let idx = 0; idx < srcCanvas.length; idx++){
        destCanvas[idx].getContext('2d').drawImage(srcCanvas[idx], 0, 0);
    }

    page.append(pdfPageCanvas);
    page.append(ctrlArea);

    let brkPnt = document.createElement('div'); // <<
    // brkPnt.style.pageBreakAfter = "always";
    // brkPnt.style.breakAfter = "always";
    // brkPnt.classList.add('breakPagePoint');
    brkPnt.classList.add('html2pdf__page-break'); // <<

    // let brkPntBefore = document.createElement('div');
    // brkPntBefore.classList.add('pageBreakPointBefore');
    // let brkPntAfter = document.createElement('div');
    // brkPntAfter.classList.add('pageBreakPointAfter');

    // page.classList.add('pageBreakPointBefore');
    // page.classList.add('pageBreakPointAfter');
    // page.classList.add('pageBreakPoint');
    page.classList.add('pageBorder');
    toPdf.append(page);
    // toPdf.append(brkPnt); // <<
    // toPdf.append(brkPntBefore);
    // toPdf.append(brkPntAfter);

    if(++pageNum > docState.pdf.numPages){
        renderPage(docState.pageNum);

        // console.log(toPdf);
        $('body').append(toPdf); // test
        // $('.ctrl.cmbBox').each(function(idx, ctrl){
        //     ctrl.value = ctrl.dataset['selectedValue'] || ctrl.value;
        // })

        // return;
        // pdf로 저장
        // console.log(
        // html2pdf().set({
        //     margin: 5,
        //     filename: 'test.pdf',
        //     jsPDF: {orientaion: 'portrait', unit: 'mm', format: 'a4', compress: false},
            
        // }).from(toPdf).save());
        // 아래보다는 빠른데 화질 구데기

        // 비교적 느린데 화질 더 
        // 중간에 뜬금 빈칸 // 페이지 사이에 brkpnt 들어가면 뜬금 빈칸 생김
        let pages = Array.from(document.getElementsByClassName('pageBorder'));
        // if(pages[0].offsetWidth > pages[0].offsetHeight){
        //     pages[0].style.transform = 'rotate(90deg)';
        // }

        let margin = 5;
        let worker = html2pdf().set({
            margin: 5,
            filename: 'test.pdf',
            // jsPDF: {orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: false},
            // jsPDF: {
            //     orientation: (pages[0].offsetHeight > pages[0].offsetWidth) ? 'portrait' : 'landscape',
            //     unit: 'px',
            //     format: [pages[0].offsetWidth + 20, pages[0].offsetHeight + 20],
            //     compressPDF: false
            // },
            jsPDF: {
                orientation: (pages[0].offsetHeight > pages[0].offsetWidth) ? 'portrait' : 'landscape',
                unit: 'mm',
                format: 'a4',
                compressPDF: false,
            },

            // jsPDF: {
            //     orientation: (pages[0].offsetHeight > pages[0].offsetWidth) ? 'portrait' : 'landscape',
            //     unit: 'px',
            //     format: 'a4',
            //     compressPDF: false,
            // },
            html2canvas: {scale: 4},
            image: {
                type: 'jpeg',
                quality: 1,
            }
        }).from(pages[0]);

        if(pages.length > 1){
            worker = worker.toPdf();

            // let a4mm = [
            //     595.28 * (0.2645833333 * 96/72), 841.89 * (0.2645833333 * 96/72)
            // ];
            // let a4px = [
            //     595.28 * (96/72), 841.89 * (96/72)
            // ];

            // let hAccum = 0;
            pages.slice(1).forEach((elem, index) => {
                worker = worker.get('pdf').then(pdf => {
                    // let contentmm = [
                    //     elem.offsetWidth * (0.2645833333 * 96/72), elem.offsetHeight * (0.2645833333 * 96/72)
                    // ];

                    // elem.style.top = hAccum + 'px';
                    if(elem.offsetWidth > elem.offsetHeight){
                        // a4: [595.28, 841.89], // point
                        // (1 pixel = 72/96 points)
                        // 1px = 0.2645833333mm
                        // 1pt = (0.2645833333 * 96/72) mm
                        // pdf.addPage([contentmm[1], contentmm[0]], 'landscape');

                        // elem.style.transform = 'rotate(90deg)';
                        // let dgr = elem.offsetWidth - elem.offsetHeight;
                        // elem.style.top = hAccum + (dgr/2) + 'px';
                        // elem.style.left = -(dgr/2) + 'px';
                        // hAccum += dgr;
                        // pdf.addPage('a4', 'p');

                        pdf.addPage('a4', 'l');
                    }
                    else{
                        pdf.addPage('a4', 'p');
                        // pdf.addPage(contentmm, 'portrait');
                    }
                    // pdf.addPage();
                    // pdf.addPage([elem.offsetWidth + 20, elem.offsetHeight + 20], (elem.offsetWidth < elem.offsetHeight) ? 'portrait' : 'landscape')
                }).from(elem)
                .toContainer()
                .toCanvas()
                .toPdf()
            });
        }
        worker = worker.save();


        // let pages = Array.from(document.getElementsByClassName('pageBorder'));
        // let worker = html2pdf().set({
        //     margin: 5,
        //     filename: 'test.pdf',
        //     jsPDF: {orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: false},
        //     html2canvas: {scale: 4},
        //     image: {
        //         type: 'jpeg',
        //         quality: 1,
        //     }
        // });
        // pages.forEach((elem, index) => {
        //     worker = worker.get('pdf').then(pdf => {
        //         pdf.addPage()
        //     }).from(elem)
        //     .toContainer()
        //     .toCanvas()
        //     .toPdf()
        // });
        // worker.save();
        return;
    }
    else{
        renderPage(pageNum).then(()=>{
            copyPage(toPdf, pageNum);
        });
    }
}


// 컨트롤에 지정된 데이터/속성값 입력
function setCtrlData(){
    $('.ctrl').each(function(idx, ctrl){
        if(ctrl.dataset['ctrlType'] == "text"){
            ctrl.value = ctrl.dataset['text'] || '';
            if(ctrl.getAttribute('type') == 'number'){
                ctrl.addEventListener('input', function(e){
                    if(ctrl.value.length > ctrl.maxLength){
                        ctrl.value = ctrl.value.slice(0, ctrl.maxLength);
                    }
                })
            }
        }
        else if(ctrl.dataset['ctrlType'] == 'cmbBox'){
            // resetCombo(ctrl);
            combo2.reset(ctrl);
        }
        else if(ctrl.dataset['ctrlType'] == 'chkBox'){
            $(ctrl).find('input').prop('checked', ctrl.dataset['checked']);
        }
        else if(ctrl.dataset['ctrlType'] == 'canvas'){
            // canvas.setEvent(ctrl);
            canvas.setEvent2(ctrl);
            canvas.setClearBtn(ctrl);
        }
        else if(ctrl.dataset['ctrlType'] == "radio"){
            
        }
        else if(ctrl.dataset['ctrlType'] == 'calendar'){
            ctrl.value = ctrl.dataset['selectedDate'];
        }
    });

    // 콤보 열린게 있을때
    // 다른데 클릭시
    // 알아서 닫히게
    $('.ctrlArea').on('click', function(){
        $('.cmbBox ul').slideUp();
    })
}

// 필수 체크한 것 중 빈칸 있는지 확인
// chkBox 제외
function checkEmptyItem(){
    let flag = true;

    $('.ctrlArea').find('.required').each(function(idx, elem){
        switch(elem.dataset.ctrlType){
            case 'text': case 'calendar':
                if(elem.value == ''){
                    flag = false;
                    console.log(elem.dataset.ctrlType);
                    return false;
                }
                break;
            case 'chkBox':
                
                break;
            case 'cmbBox':
                // 항상 기본값 있
                break;
            case 'radio':
                // 항상 기본값 있
                break;
            case 'canvas':
                if(elem.dataset.linePath){
                    let lp = JSON.parse(elem.dataset.linePath);
                    if(lp.moveTo.length < 1 || lp.lineTo < 1){
                        flag = false;
                        console.log(elem.dataset.ctrlType);
                        return false;
                    }
                }
                else{
                    flag = false;
                    console.log(elem.dataset.ctrlType);
                    return false;
                }
                break;
            default:
                break;
        }
    });

    return flag;
}


// function toPdfFile(){
//     let toPdf = document.createElement('div');
//     toPdf.setAttribute('id', 'toPdfArea');
//     toPdf.height = 'fit-content';

//     let pages = [];

//     function copyPage2(pageNum, pages){
//         let pdfArea = document.getElementById('pdfArea');
//         let canvasW = pdfArea.offsetWidth;
//         let canvasH = pdfArea.offsetHeight;

//         let page = document.createElement('div');
        
//         let pdfPageCanvas = document.createElement('canvas');
//         pdfPageCanvas.style.position = 'relative';
//         pdfPageCanvas.width = canvasW;
//         pdfPageCanvas.height = canvasH;
    
//         let ctx = pdfPageCanvas.getContext('2d');
//         ctx.drawImage(pdfArea, 0, 0);
    
//         let ctrlArea = $('.ctrlArea')[pageNum-1].cloneNode(true);
//         ctrlArea.style.display = 'block';
//         ctrlArea.style.position = 'absolute';
//         ctrlArea.classList.remove('ctrlArea');
//         ctrlArea.style.top = '0px';
//         ctrlArea.style.left = '0px';
        
//         // canvas 내용 복사
//         let srcCanvas = $($('.ctrlArea')[pageNum-1]).find('.ctrl_canvas');
//         let destCanvas = $(ctrlArea).find('.ctrl_canvas');
//         for(let idx = 0; idx < srcCanvas.length; idx++){
//             destCanvas[idx].getContext('2d').drawImage(srcCanvas[idx], 0, 0);
//         }
    
//         page.append(pdfPageCanvas);
//         page.append(ctrlArea);
//         page.classList.add('pageBorder');
    
//         pages.push(page);
//         toPdf.append(page);

//         if(docState.pdf.numPages < ++pageNum){
//             // end
//             $('body').append(toPdf);
//             toPdf.style.width = 'fit-content';
//             $('.pageBorder').css('width', '');
//             html2canvas(toPdf).then(function(canvas){
//                 let imgData = canvas.toDataURL('image/jpeg');
    
//                 let h = toPdf.offsetHeight;
//                 let w = toPdf.offsetWidth;

//                 // let margin = 10;
//                 // let imgWidth = 210 - (margin * 2);
//                 // let pageHeight = imgWidth * 1.414;
//                 // let imgHeight = canvas.height * imgWidth / canvas.width;
//                 // let heightLeft = imgHeight;

//                 // let file = new jsPDF('p', 'mm', 'a4');

//                 // let position = margin;

//                 let margin = 10;
//                 let position = margin;
//                 let file = new jsPDF('p', 'px', 'a4');
//                 for(let p of pages){
//                     file.addImage(imgData, 'JPEG', 5, position, canvas.width, p.offsetHeight);
//                     file.addPage();
//                     position += p.offsetHeight;
//                 }
    
//                 // file.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
//                 // heightLeft -= pageHeight;
    
//                 // for(let idx = 0; idx < pages.length; idx++){
//                 //     file.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
//                 //     file.addPage();
//                 //     position = heightLeft - imgHeight;
//                 //     heightLeft -= pageHeight;
//                 // }
            
//                 // while(heightLeft>=20){
//                 //     position = heightLeft - imgHeight;
//                 //     file.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//                 //     file.addPage();
//                 //     heightLeft -= pageHeight;
//                 // }
    
//                 file.save('testfile.pdf');
//             });
            

//             renderPage(docState.pageNum);

//             return;
//         }
//         else{
//             renderPage(pageNum).then(()=>{
//                 copyPage2(pageNum, pages);
//             });
//         }
//     }
    
    

//     renderPage(1).then(()=>{
//         copyPage2(1, pages);
//     });
// }