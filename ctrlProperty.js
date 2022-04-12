var attributeSet = {
    dataset: {name: null},
    type: 'text',
    maxlength: -1,
};

function initCtrlProperty(){
    // $('#ctrl_attr_1').on('keyup', function(e){
    //     if(window.event.keyCode == 13){
    //         // 엔터키
    //         $('#ctrl_attr_1').blur();
    //     }
    // });

    $('#ctrl_attr_1').on('blur', ctrl_attr_1_func);
    $('#ctrl_attr_2').change(ctrl_attr_2_func);

    $('#ctrl_attr_3').on('blur', ctrl_attr_3_func);
    $('#ctrl_attr_4').on('blur', ctrl_attr_4_func);
    $('#ctrl_attr_5').on('click', ctrl_attr_5_func);
    $('#ctrl_attr_6').on('blur', ctrl_attr_6_func);
    $('#ctrl_attr_7').on('blur', ctrl_attr_7_func);
    $('#ctrl_attr_8').on('blur', ctrl_attr_8_func);
    $('#ctrl_attr_9').on('change', ctrl_attr_9_func);

    $('.ctrl_attr').attr('disabled', true);
    $('.ctrl_attr').each(function(idx, ctrl_attr){
        ctrl_attr.addEventListener('keyup', function(e){
            if(window.event.keyCode == 13){
                // enter
                $('#ctrl_attr_' + (idx+1)).blur();
            }
        });
    });

}

function clearAttrInput(selectedElem){
    $('.ctrl_attr').val('');
    $('.ctrl_attr').attr('disabled', true)
    if(selectedElem){
        $(`.ctrl_attr.attr_${selectedElem.dataset.ctrlType}`).attr('disabled', false);
        // switch(selectedElem.dataset["ctrlType"]){
        //     case 'text':
        //         $('#ctrl_attr_4').attr('disabled', true);
        //         $('#ctrl_attr_5').attr('disabled', true);
        //         break;
        //     case 'chkBox':
        //         $('#ctrl_attr_2').attr('disabled', true);
        //         $('#ctrl_attr_3').attr('disabled', true);
        //         $('#ctrl_attr_5').attr('disabled', true);
        //         $('#ctrl_attr_8').attr('disabled', true);
        //         break;
        //     case 'cmbBox':
        //         $('#ctrl_attr_2').attr('disabled', true);
        //         $('#ctrl_attr_3').attr('disabled', true);
        //         $('#ctrl_attr_4').attr('disabled', true);
        //         $('#ctrl_attr_8').attr('disabled', true);
        //         break;
        //     case 'canvas':
        //         $('#ctrl_attr_2').attr('disabled', true);
        //         $('#ctrl_attr_3').attr('disabled', true);
        //         $('#ctrl_attr_4').attr('disabled', true);
        //         $('#ctrl_attr_5').attr('disabled', true);
        //         break;
        //     case 'radio':
        //         $('#ctrl_attr_2').attr('disabled', true);
        //         $('#ctrl_attr_3').attr('disabled', true);
        //         $('#ctrl_attr_4').attr('disabled', true);
        //         $('#ctrl_attr_8').attr('disabled', true);
        //         break;
        //     default:
        //         return;
        // }
    }
    else{
        $('.ctrl_attr').attr('disabled', true);
    }
}
function ctrl_setAttrInfo(selectedElem){
    clearAttrInput(selectedElem);

    // $('#ctrl_attr_6').val($(selectedElem).css('width'));
    // $('#ctrl_attr_7').val($(selectedElem).css('height'));
    $('#ctrl_attr_6').val(selectedElem.style.width);
    $('#ctrl_attr_7').val(selectedElem.style.height);

    let attrSet = selectedElem.attributes;
    let attrEntries = Object.entries(attrSet);
    attrEntries.forEach(function(val, idx){
        switch(val[1].localName){
            case 'data-name':
                $('#ctrl_attr_1').val(val[1].value);
                break;
            case 'type':
                if(['number', 'text'].includes(val[1].value)){
                    $('#ctrl_attr_2').val(val[1].value).change();
                }
                break;
            case 'maxlength':
                $('#ctrl_attr_3').val(val[1].value);
                break;
            case 'caption':
                $('#ctrl_attr_4').val(val[1].value);
                break;
            case 'placeholder':
                $('#ctrl_attr_8').val(val[1].value);
                break;
            default:
                break;
        }
    });

    $('#ctrl_attr_9').val((selectedElem.classList.contains('required') ? '1' : '0')).change();
    
}

function ctrl_attr_1_func(){
    let v = $('#ctrl_attr_1').val();
    g_selectedControl.dataset.name = v;
    console.log(v);
}

function ctrl_attr_2_func(){
    let v = $('#ctrl_attr_2').find(':selected').text();
    g_selectedControl.setAttribute('type', v);
    console.log(g_selectedControl);

}

function ctrl_attr_3_func(){
    let v = $('#ctrl_attr_3').val();
    g_selectedControl.setAttribute('maxlength', v);
    g_selectedControl.removeEventListener('input', maxLenChk);
    g_selectedControl.addEventListener('input', maxLenChk)
    console.log(g_selectedControl);
}
// input type number일 때는 maxlength가 안 먹혀서
function maxLenChk(e){
    console.log(`${g_selectedControl.value}   ${g_selectedControl.maxLength}`);
    if(g_selectedControl.value.length > g_selectedControl.maxLength){
        g_selectedControl.value = g_selectedControl.value.slice(0, g_selectedControl.maxLength);
        g_selectedControl.dataset['text'] = g_selectedControl.value;
    }
}

function ctrl_attr_4_func(){
    let v = $('#ctrl_attr_4').val();
    $(g_selectedControl).find('span').text(v);
    $(g_selectedControl).attr('caption', v);
}

function ctrl_attr_5_func(){
    // if(g_selectedControl.dataset['ctrlType'] == 'cmbBox'){
    //     openCmbSetter(g_selectedControl);
    // }
    openCmbSetter(g_selectedControl);
}

function ctrl_attr_6_func(){
    let v = $('#ctrl_attr_6').val();
    if(v.substr(-2, 2) == 'px' && isNaN(v.substr(0, v.length-2)) == false){
        let val = v.substr(0, v.length-2);
        // if(val > $('.ctrlArea').width()){
        //     v = $('.ctrlArea').css('width');
        //     $('#ctrl_attr_6').val(v);
        // }
        // else if(val < 0){
        //     v = '0px'
        //     $('#ctrl_attr_6').val(v);
        // }
        v = chkSize(val, 0) + 'px';
        $('#ctrl_attr_6').val(v);
    }
    else if(v.substr(-1, 1) == '%' && isNaN(v.substr(0, v.length-1)) == false){
        let val = v.substr(0, v.length-1);
        if(0 <= val && val <= 100){
            // v = `calc(${v} - 8px)`; // border
        }
        else{
            return;
        }
    }
    else if(isNaN(v) == false){
        v = chkSize(v, 0) + 'px';
        $('#ctrl_attr_6').val(v);
    }
    else{
        return;    
    }
    g_selectedControl.style.width = v;
    if(g_selectedControl.dataset.ctrlType == 'canvas'){
        canvas.setSize(g_selectedControl);
    }
}
function ctrl_attr_7_func(){
    let v = $('#ctrl_attr_7').val();
    if(v.substr(-2, 2) == 'px' && isNaN(v.substr(0, v.length-2)) == false){
        let val = v.substr(0, v.length-2);
        // if(val > $('.ctrlArea').height()){
        //     v = $('.ctrlArea').css('height');
        //     $('#ctrl_attr_7').val(v);
        // }
        // else if(val < 0){
        //     v = '0px';
        //     $('#ctrl_attr_7').val(v);
        // }
        v = chkSize(val, 0) + 'px';
        $('#ctrl_attr_7').val(v);
    }
    else if(v.substr(-1, 1) == '%' && isNaN(v.substr(0, v.length-1)) == false){
        let val = v.substr(0, v.length-1);
        if(0 <= val && val <= 100){
            // v = `calc(${v} - 8px)`; // border
        }
        else{
            return;
        }
    }
    else if(isNaN(v) == false){
        v = chkSize(v, 0) + 'px';
        $('#ctrl_attr_7').val(v);
    }
    else{
        return;    
    }
    
    g_selectedControl.style.height = v;
    if(g_selectedControl.dataset.ctrlType == 'canvas'){
        canvas.setSize(g_selectedControl);
    }
}
function chkSize(val, axis){
    let size;
    if(axis){
        size = $('.ctrlArea').height();
    }
    else{
        size = $('.ctrlArea').width();
    }

    if(val > size){
        val = size;
    }
    else if(val < 0){
        val = 0;
    }

    return val;
}
function ctrl_attr_8_func(){
    let hint = $('#ctrl_attr_8').val();
    if(g_selectedControl.dataset.ctrlType == 'text'){
        // input
    }
    else{
        // canvas
        $(g_selectedControl).find('p').text(hint);
    }
    $(g_selectedControl).attr('placeholder', hint);
}

function ctrl_attr_9_func(){
    if(g_selectedControl){
        if($('#ctrl_attr_9').val() == '1'){
            g_selectedControl.classList.add('required');
        }
        else{
            g_selectedControl.classList.remove('required');
        }
    }
}

function openCmbSetter(ctrl){
    let container = openPopup();

    let content = document.createElement('div');
    content.style.padding = '10px';
    content.style.border = '1px solid black';
    content.style.borderRadius = '10px';
    content.style.backgroundColor = 'grey';

    let tblDiv = document.createElement('div');
    tblDiv.style.height = '300px';
    tblDiv.style.overflowY = 'scroll';
    tblDiv.style.border = '1px solid black';
    tblDiv.style.borderTop = '0px';

    let tbl = document.createElement('table');
    tbl.classList.add('cmbSetterTable');
    tblDiv.append(tbl);

    let header = ['index', 'value', 'text'];
    let tr_header = document.createElement('tr');
    for(let h of header){
        let th = document.createElement('th');
        th.textContent = h;
        tr_header.append(th);
    }
    tbl.append(tr_header);

    // 기존 내용 입력
    if(ctrl){
        if(ctrl.dataset.ctrlType == 'cmbBox'){
            let options = $(ctrl).find('li');
            for(let idx = 0; idx < options.length; idx++){
                let tr = document.createElement('tr');
                tr.innerHTML = `
                <td class="tblIdx">${idx+1}</td>
                <td><input value="${options[idx].dataset['val']}"></td>
                <td><input value="${options[idx].innerHTML}"></td>
                `;
                tbl.append(tr);
            }
        }
        else if(ctrl.dataset.ctrlType == 'radio'){
            $(ctrl).find('label').each(function(idx, elem){
                let tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="tblIdx">${idx}</td>
                    <td><input value="${$(elem).find('input[type=radio]').val()}"></td>
                    <td><input value="${$(elem).find('span').text()}"></td>
                `;
                // $(elem).find('input[type=radio]').val();
                // $(elem).find('span').text();
                tbl.append(tr);
            });
        }
    }
    let tr = document.createElement('tr');
    tr.innerHTML = `
            <td class="tblIdx">${tbl.rows.length}</td>
            <td><input></td>
            <td><input></td>
        `;
    tbl.append(tr);

    let div_btnArea_top = document.createElement('div');
    let btn_del = document.createElement('button');
    btn_del.textContent = '-';
    btn_del.addEventListener('click', function(e){
        tbl.deleteRow(tbl.rows.length - 1);
    });
    let btn_add = document.createElement('button');
    btn_add.textContent = '+';
    btn_add.addEventListener('click', function(e){
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="tblIdx">${tbl.rows.length}</td>
            <td><input></td>
            <td><input></td>
        `;
        tbl.append(tr);
    });
    div_btnArea_top.append(btn_del);
    div_btnArea_top.append(btn_add);

    let div_btnArea_bottom = document.createElement('div');
    let btn_ok = document.createElement('button');
    btn_ok.textContent = 'OK';
    btn_ok.addEventListener('click', function(){
        // ctrl.innerHTML = '';
        let rows = tbl.rows;

        let itemList = [];
        let values = [];
        for(let idx = 1; idx < rows.length; idx++){
            let val = rows[idx].cells[1].firstChild.value.trim();
            let txt = rows[idx].cells[2].firstChild.value.trim();

            // value, text 둘 다 입력된 것만 option으로 추가
            if(val.length > 0 && txt.length > 0){
                if(values.includes(val)){
                    console.error('duplicated value');
                    return;
                }
                values.push(val);
                itemList.push({val: val, txt: txt});
            }
        }
        if(ctrl.dataset.ctrlType == 'cmbBox'){
            // ctrl.combo.setItems(itemList);
            combo2.setItems(itemList, ctrl);
        }
        else if(ctrl.dataset.ctrlType == 'radio'){
            // ctrl.radio.setItems(itemList);
            radio.setItem(itemList, ctrl);
        }
        
        // 팝업 닫
        container.remove();
    });
    let btn_cancel = document.createElement('button');
    btn_cancel.textContent = "Cancel";
    btn_cancel.addEventListener('click', function(){
        // 팝업 닫
        container.remove();
    });
    div_btnArea_bottom.append(btn_ok);
    div_btnArea_bottom.append(btn_cancel);

    content.append(div_btnArea_top);
    content.append(tblDiv);
    content.append(div_btnArea_bottom);
    container.append(content);
    $('body').append(container);
}

function openPopup(){
    let popup = document.createElement('div');
    popup.classList.add('popup');

    return popup;
}
