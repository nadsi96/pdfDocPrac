var radio = {
    create: function(){
        let elem = document.createElement('div');
        elem.classList.add('rdoBox');

        let itemList = [
            {val: '1', txt: 'radio1'},
            {val: '2', txt: 'radio2'},
            {val: '3', txt: 'radio3'},
        ];

        // $('.ctrl.rdoBox').each(function(idx, elem){
        //     rdoNameSet.add(elem.name);
        // })

        let dt = new Date();
        let name = dt.getTime();
        elem.dataset.rdName = 'rdo' + name;
        
        for(let item of itemList){
            let div = document.createElement('div');
            let label = document.createElement('label');

            let input = document.createElement('input');
            input.type = 'radio';
            input.name = 'rdo' + name;
            input.value = item.val;
            input.addEventListener('click', function(e){
                radio.clickEvent(e, elem);
            });

            let span = document.createElement('span');
            span.textContent = item.txt;

            label.append(input);
            label.append(span);
            div.append(label);
            elem.append(div);
        }

        $(elem).find('input')[0].defaultChecked = true;
        
        return elem;
    },
    clickEvent: function(e, elem){
        e.stopPropagation();
        $(elem).find('input[type=radio]').prop('defaultChecked', false);
        // elem.defaultChecked = true;
        e.target.defaultChecked = true;
    },
    reset: function(ctrl){
        $(ctrl).find('input[type=radio]').each(function(idx, elem){
            elem.addEventListener('click', function(e){
                radio.clickEvent(e, elem);
            });
        });
    },
    setItem: function(lst, ctrl){
        $(ctrl).empty();

        for(let item of lst){
            let div = document.createElement('div');
            let label = document.createElement('label');
        
            let input = document.createElement('input');
            input.type = 'radio';
            input.name = ctrl.dataset.rdName;
            input.value = item.val;
            input.addEventListener('click', function(e){
                radio.clickEvent(e, $(ctrl));
            });
        
            let span = document.createElement('span');
            span.textContent = item.txt;
        
            label.append(input);
            label.append(span);
            div.append(label);
            $(ctrl).append(div);
        }

        $(ctrl).find('input')[0].defaultChecked = true;
    }
}