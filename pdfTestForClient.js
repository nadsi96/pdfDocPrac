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
    $('#btn_prev').on('click', function(){
        if(docState.pageNum <= 1){
            return;
        }
        else{
            docState.pageNum -= 1;
            $('#pdfCurrentPageNum').val(docState.pageNum);
            let elem = $('#sideView .sidePdfPage')[docState.pageNum-1];
            $('#sideView .sidePdfPage.selected').removeClass('selected');
            elem.classList.add('selected');
            $('#sideView').scrollTop(elem.offsetTop - 200);
            $('#docArea').scrollTop($('.docPageClone')[docState.pageNum-1].offsetTop - 100);
        }
    });
    $('#btn_next').on('click', function(){
        if(docState.pageNum >= docState.pdf.numPages){
            return;
        }
        else{
            docState.pageNum += 1;
            $('#pdfCurrentPageNum').val(docState.pageNum);
            let elem = $('#sideView .sidePdfPage')[docState.pageNum-1];
            $('#sideView .sidePdfPage.selected').removeClass('selected');
            elem.classList.add('selected');
            $('#sideView').scrollTop(elem.offsetTop - 200);
            $('#docArea').scrollTop($('.docPageClone')[docState.pageNum-1].offsetTop - 100);
        }
    });
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

let docUrl = '../docs/Document.pdf';


// 페이지마다 pdf페이지, 컨트롤 포함된 div 복사해서
// display block으로 주고 save시키면 되려나
function saveToPDF(){
    if(!docState.pdf){
        alert('open file first');
        return;
    }

    console.log('save as pdf');

    if(checkEmptyItem()){
        // 필수항목 다 채워짐
    }
    else{
        // ㄴㄴ
        alert('fill required item');
        return;
    }
    // 캔버스에 clear버튼 제거
    $('.btn_canvasClear').remove();
    $('.cmbBox ul').css('display', 'none');

    saveAsJson();
    _saveToPDF();
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

    $('.copyCtrlArea').find('.required').each(function(idx, elem){
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

function saveAsJson(){
    let jsonData = {
        pdfPath: g_docPath,
        pages: [],
    };

    $('.ctrlArea').each(function(idx, area){
        let ctrlData = [];
        for(let ctrl of area.children){
            let data = {};
            data.type = ctrl.dataset.ctrlType;
            data.name = ctrl.dataset.name || '';
            data.property = [];

            switch(data.type){
                case 'text':
                    data.property.push({type: (ctrl.getAttribute('type') || 'text')});
                    if(ctrl.getAttribute('maxlength')){
                        data.property.push({maxLength: ctrl.getAttribute('maxlength')});
                    }
                    if(ctrl.dataset.text){
                        data.caption = ctrl.dataset.text;
                    }
                    break;
                case 'cmbBox':
                    data.property.push({itemList: JSON.parse(ctrl.dataset.itemList)});
                    data.option = {selected: $(ctrl).find('li.selected').data('val')};
                    break;
                case 'chkBox':
                    data.property.push({caption: ctrl.getAttribute('caption')});
                    data.option = {selected: $(ctrl).find('input')[0].checked};
                    break;
                case 'radio':
                    data.itemList = JSON.parse(ctrl.dataset.itemList);
                    data.selected = $(ctrl).find('input:checked').val();
                    break;
                case 'canvas':
                    data.linePath = JSON.parse(ctrl.dataset.linePath || '[]');
                    break;
                default:
                    continue;
            }

            data.pos = {
                left: ctrl.style.left,
                top: ctrl.style.top,
            };
            data.size = {
                width: ctrl.style.width || $(ctrl).width(),
                height: ctrl.style.height || $(ctrl).height(),
            };

            ctrlData.push(data);
        }

        jsonData.pages.push(ctrlData);
    });

    let blob = new Blob([JSON.stringify(jsonData)], {type: 'application/json'});
    window.saveAs(blob, 'result.json');
}

function _saveToPDF(){

    // 페이지 하나씩 생성
    // 느린데 화질은 얘가 좀 더
        let pages = Array.from(document.getElementsByClassName('pageBorder'));

        let worker = html2pdf().set({
            margin: 5,
            filename: 'test.pdf',
            jsPDF: {
                orientation: (pages[0].offsetHeight > pages[0].offsetWidth) ? 'portrait' : 'landscape',
                unit: 'mm',
                format: 'a4',
                compressPDF: false,
            },
            html2canvas: {scale: 4},
            image: {
                type: 'jpeg',
                quality: 1,
            }
        }).from(pages[0]);

        if(pages.length > 1){
            worker = worker.toPdf();

            pages.slice(1).forEach((elem, index) => {
                worker = worker.get('pdf').then(pdf => {
                    
                    if(elem.offsetWidth > elem.offsetHeight){

                        pdf.addPage('a4', 'l');
                    }
                    else{
                        pdf.addPage('a4', 'p');
                    }
                }).from(elem)
                .toContainer()
                .toCanvas()
                .toPdf()
            });
        }
        worker = worker.save();
}