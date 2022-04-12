// var combo = function(){
//     let elem = document.createElement('div');
//     elem.classList.add('crtl');
//     elem.classList.add('cmbBox');

//     let head = document.createElement('div');
//     head.classList.add('cmbBoxHead')
    
//     let selItem = document.createElement('div');
//     selItem.classList.add('cmbHeadTxt');

//     let icon = document.createElement('p');
//     icon.classList.add('comboIcon');
//     icon.textContent = 'V';

//     head.append(selItem);
//     head.append(icon);

//     let ul_itemList = document.createElement('ul');
//     ul_itemList.classList.add('comboItemList');
//     ul_itemList.style.display = 'none';

//     elem.append(head);
//     elem.append(ul_itemList);

//     elem.addEventListener('click', function(e){
//         e.stopPropagation();
//         $(ul_itemList).slideToggle();
//     });

//     elem.combo = {
//         el_head: head,
//         el_selectedTxt: selItem,
//         el_itemList: ul_itemList,
//         itemList: [],
//         setSize: function(width, height){
//             this.style.width = width;
//             this.style.height = height;

//             this.el_itemList.style.width = width;
//             this.el_itemList.style.left = this.offsetLeft + 'px';
//             this.el_itemList.style.top = (this.offsetTop + this.offsetHeight) + "px";
//         },
//         setItems: function(lst){
//             // lst = [{val: val, txt: txt}]
//             this.itemList = lst;
//             $(this.el_itemList).empty();
//             let _itemList = this.el_itemList;
//             let selected = this.el_selectedTxt;

//             for(let item of lst){
//                 let li = document.createElement('li');
//                 li.innerHTML = item.txt;
//                 li.dataset['val'] = item.val;

//                 li.addEventListener('click', function(e){
//                     e.stopPropagation();

//                     $(_itemList).find('li').removeClass('selected');
//                     li.classList.add('selected');
//                     selected.innerHTML = this.innerHTML;
//                     $(_itemList).slideUp();
//                 })
//                 _itemList.append(li);
//             }

//             let first = $(_itemList).find('li').first().addClass('selected');
//             selected.innerHTML = first.text();
//         }
//     }

//     elem.dataset['comboData'] = JSON.stringify(elem.combo);
//     return elem;
// }

// var resetCombo = function(ctrl){
//     let selItem = $(ctrl).find('.cmbHeadTxt');
//     let ul_itemList = $(ctrl).find('.comboItemList')

//     ctrl.addEventListener('click', function(e){
//         e.stopPropagation();

//         // 자신 제외한 콤보 닫
//         $('.cmbBox ul').not(ul_itemList).slideUp();
//         ul_itemList.slideToggle();
//     });

//     $(ctrl).find('li').on('click', function(e){
//         e.stopPropagation();

//         $(ctrl).find('li').removeClass('selected');
//         this.classList.add('selected');
//         selItem.text(this.innerHTML);
//         $(ctrl).find('.comboItemList').slideUp();
//     })
//     ctrl.combo = {
//         el_selectedTxt: selItem,
//         el_itemList: ul_itemList,
//         itemList: [],
//         setSize: function(width, height){
//             this.style.width = width;
//             this.style.height = height;

//             this.el_itemList.style.width = width;
//             this.el_itemList.style.left = this.offsetLeft + 'px';
//             this.el_itemList.style.top = (this.offsetTop + this.offsetHeight) + "px";
//         },
//         setItems: function(lst){
//             // lst = [{val: val, txt: txt}]
//             this.itemList = lst;
//             $(this.el_itemList).empty();
//             let _itemList = this.el_itemList;
//             let selected = this.el_selectedTxt;

//             for(let item of lst){
//                 let li = document.createElement('li');
//                 li.innerHTML = item.txt;
//                 li.dataset['val'] = item.val;
//                 li.addEventListener('click', function(e){
//                     e.stopPropagation();

//                     $(_itemList).find('li').removeClass('selected');
//                     li.classList.add('selected');
//                     selected.text(this.innerHTML);
//                     $(_itemList).slideUp();
//                 })
//                 _itemList.append(li);
//             }

//             let first = $(_itemList).find('li').first().addClass('selected');
//             selected.text(first.text());
//         }
//     }
// }


var combo2 = {
    create: function(){
        let elem = document.createElement('div');
        elem.classList.add('crtl');
        elem.classList.add('cmbBox');
    
        let head = document.createElement('div');
        head.classList.add('cmbBoxHead')
        
        let selItem = document.createElement('div');
        selItem.classList.add('cmbHeadTxt');
    
        let icon = document.createElement('p');
        icon.classList.add('comboIcon');
        icon.textContent = 'V';
    
        head.append(selItem);
        head.append(icon);
    
        let ul_itemList = document.createElement('ul');
        ul_itemList.classList.add('comboItemList');
        ul_itemList.style.display = 'none';
    
        elem.append(head);
        elem.append(ul_itemList);
    
        elem.addEventListener('click', function(e){
            e.stopPropagation();
            $(ul_itemList).slideToggle();
        });
    
        // elem.dataset['comboData'] = JSON.stringify(elem.combo);
        elem.dataset.itemList = JSON.stringify([]);
        return elem;
    },
    setItems(lst, ctrl){
        let itemList = $(ctrl).find('.comboItemList');
        itemList.empty();
        ctrl.dataset.itemList = JSON.stringify(lst);

        for(let item of lst){
            let li = document.createElement('li');
            li.innerHTML = item.txt;
            li.dataset['val'] = item.val;

            li.addEventListener('click', function(e){
                e.stopPropagation();
                combo2.clickEvent(this);
            })
            itemList.append(li);
        }

        let first = itemList.find('li').first().addClass('selected');
        $(ctrl).find('.cmbHeadTxt').text(first.text());
    },
    clickEvent: function(item){
        $(item).parent().find('li.selected').removeClass('selected');
        item.classList.add('selected');
        $(item).parent().parent().find('.cmbHeadTxt').text(item.innerHTML);
        $(item).parent().slideUp();
    },
    reset: function(ctrl){
        let ul_itemList = $(ctrl).find('.comboItemList')
    
        ctrl.addEventListener('click', function(e){
            e.stopPropagation();
    
            // 자신 제외한 콤보 닫
            $('.cmbBox ul').not(ul_itemList).slideUp();
            ul_itemList.slideToggle();
        });
    
        $(ctrl).find('li').on('click', function(e){
            e.stopPropagation();
            combo2.clickEvent(this);
        });
    },
};