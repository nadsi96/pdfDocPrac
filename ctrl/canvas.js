var canvas = {
    createCanvas: function(ctlPos, width, height){
        width = width || '200px';
        height = height || '200px';

        let div = document.createElement('div');
        div.style.height = height;
        div.style.width = width;
        div.style.position = 'absolute';
        // div.style.left = ctlPos[0] + 'px';
        // div.style.top = ctlPos[1] + 'px';
        div.style.left = '0px';
        div.style.top = '0px';

        let placeHolderContainer = document.createElement('div');
        placeHolderContainer.style.height = '100%';
        placeHolderContainer.style.width = '100%'
        placeHolderContainer.style.position = 'relative';
        placeHolderContainer.style.left = '0px';
        placeHolderContainer.style.top = '0px';
        placeHolderContainer.style.color = '#769da8';
        placeHolderContainer.style.fontWeight = 'bold';
        placeHolderContainer.style.display = 'flex';
        placeHolderContainer.style.alignItems = 'center';
        placeHolderContainer.style.justifyContent = 'center';

        let placeHolder = document.createElement('p');
        placeHolder.style.position = 'relative';
        placeHolder.style.color = '#769da8';
        placeHolder.style.fontWeight = 'bold';
        placeHolder.style.maxHeight = '100%';
        placeHolder.style.margin = '0px';
        placeHolder.style.textOverflow = 'ellipsis';
        placeHolder.style.overflow = 'hidden';
        placeHolder.innerHTML = '서명';

        placeHolderContainer.append(placeHolder);
        div.append(placeHolderContainer);
        
        let canvas = document.createElement('canvas');
        canvas.classList.add('ctrl_canvas');

        div.append(canvas);

        let ctx = canvas.getContext('2d');
        // ctx.lineWidth = 5;
        // ctx.lineCap = 'round';
        // ctx.strokeStyle = '#000000';

        // ctx.canvas.width = div.offsetWidth;
        // ctx.canvas.height = div.offsetHeight;

        // canvas.addEventListener('mousedown', signStart);

        return div;
    },
    setSize: function(ctrl){
        let canvas = $(ctrl).find('.ctrl_canvas')[0];
        // canvas.width = ctrl.offsetWidth; // content-box인 경우 border 포함크기
        // canvas.height = ctrl.offsetHeight;
        canvas.width = $(ctrl).width();
        canvas.height = $(ctrl).height();
    },
    // pdfTestForClient
    setEvent: function(ctrl){
        let canvas = $(ctrl).find('.ctrl_canvas')[0];
        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        let containerRect;

        let pos = [0,0];
        let prePos = [0,0];
        function drawStart(e){
            e.stopPropagation();

            console.log('dragStart');
            containerRect = canvas.offsetParent.getBoundingClientRect();

            prePos = [
                e.clientX - containerRect.x,
                e.clientY - containerRect.y,
            ];

            this.addEventListener('mousemove', drawing);
            this.addEventListener('mouseup', drawEnd);
            this.addEventListener('mouseout', drawOut);
        };
        function drawing(e){
            e.stopPropagation();

            pos = [
                e.clientX - containerRect.x,
                e.clientY - containerRect.y,
            ];

            ctx.beginPath();
            ctx.moveTo(prePos[0], prePos[1]);
            ctx.lineTo(pos[0], pos[1]);
            ctx.stroke();
        
            prePos = [pos[0], pos[1]];
        };
        function drawEnd(e){
            e.stopPropagation();

            console.log('mouseup');
            this.removeEventListener('mousemove', drawing);
            this.removeEventListener('mouseup', drawEnd);
            this.removeEventListener('mouseout', drawOut);
        }
        function drawOut(e){
            e.stopPropagation();

            console.log('mouse out');
            this.removeEventListener('mousemove', drawing);
            this.removeEventListener('mouseup', drawEnd);
            this.removeEventListener('mouseout', drawOut);
        }

        canvas.addEventListener('mousedown', drawStart);
    },

    setClearBtn: function(ctrl){
        let btn = document.createElement('button');
        btn.style.position = 'absolute';
        btn.style.right = '0px';
        btn.style.top = '0px';
        btn.innerHTML = 'clear';
        btn.classList.add('btn_canvasClear');

        btn.addEventListener('click', function(e){
            e.stopPropagation();
            let canvas = $(ctrl).find('.ctrl_canvas')[0];
            let ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        ctrl.append(btn);
    },




    // 클릭하면 큰 캔버스 띄우고 완료버튼 클릭시 작성내용 적용
    setEvent2: function(ctrl){
        ctrl.addEventListener('click', function(e){
            let container = document.createElement('div');
            container.classList.add('extension_canvas_Container');
            $('.contentContainer').append(container);

            let content = document.createElement('div');
            content.classList.add('extension_canvas_Content');
            container.append(content);

            let bgText = $(ctrl).find('div').clone(true)[0];
            bgText.style.position = 'absolute';
            content.append(bgText);

            let canvas = document.createElement('canvas');
            // canvas.width = 800;
            content.append(canvas);
            
            // 비율 맞춰서 긴 방향이 800px인 큰 캔버스 만듦
            let ctrlCanvas = $(ctrl).find('.ctrl_canvas')[0];
            let ctrlCanvasW = ctrlCanvas.width;
            let ctrlCanvasH = ctrlCanvas.height;
            if(ctrlCanvasW >= ctrlCanvasH){
                canvas.width = 800;
                canvas.height = (canvas.width * (ctrlCanvasH / ctrlCanvasW));
            }
            else{
                canvas.height = 800;
                canvas.width = (canvas.height * (ctrlCanvasW / ctrlCanvasH));
            }

            let ctx = canvas.getContext('2d');
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000000';



            let containerRect;
            let prePos = [0, 0];
            let pos = [0, 0];
            // 복사할 때, drawImage
            // scaling되면서 lineWidth도 같이 줄어듦
            // lineWidth 크기 일정하게 유지
            // 그냥 그린 path 기억해서 것다가 그려주기 어떰
            let linePos = {
                moveTo: [],
                lineTo: [],
            };
            function drawStart(e){
                containerRect = canvas.offsetParent.getBoundingClientRect();

                prePos = [
                    e.clientX - containerRect.x,
                    e.clientY - containerRect.y,
                ];

                this.addEventListener('mousemove', drawing);
                this.addEventListener('mouseup', drawEnd);
                this.addEventListener('mouseout', drawEnd);
            }
            function drawing(e){
                pos = [
                    e.clientX - containerRect.x,
                    e.clientY - containerRect.y,
                ];

                linePos.moveTo.push([prePos[0], prePos[1]]);
                linePos.lineTo.push([pos[0], pos[1]]);
    
                ctx.beginPath();
                ctx.moveTo(prePos[0], prePos[1]);
                ctx.lineTo(pos[0], pos[1]);
                ctx.stroke();
            
                prePos = [pos[0], pos[1]];
            }
            function drawEnd(e){
                this.removeEventListener('mousemove', drawing);
                this.removeEventListener('mouseup', drawEnd);
                this.removeEventListener('mouseout', drawEnd);
            }

            canvas.addEventListener('mousedown', drawStart);


            let btnArea = document.createElement('div');
            container.append(btnArea);
            btnArea.style.position = 'relative';
            btnArea.style.display = 'flex';
            btnArea.style.height = '30px';

            let btnOK = document.createElement('button');
            btnOK.textContent = 'OK';
            btnOK.addEventListener('click', function(){
                let ctrlCtx = ctrlCanvas.getContext('2d');
                ctrlCtx.clearRect(0,0,ctrlCanvas.width, ctrlCanvas.height);
                // ctrlCtx.drawImage(canvas, 0,0,ctrlCanvasW, ctrlCanvasH); // lineWidth scaling

                ctrlCtx.lineWidth = 2;
                ctrlCtx.lineCap = 'round';
                ctrlCtx.strokeStyle = '#000000';
                ctrlCtx.beginPath();
                let rtoW = (ctrlCtx.canvas.width/canvas.width);
                let rtoH = (ctrlCtx.canvas.height/canvas.height);
                for(let idx = 0; idx < linePos.moveTo.length; idx++){
                    ctrlCtx.moveTo(linePos.moveTo[idx][0] * rtoW, linePos.moveTo[idx][1] * rtoH);
                    ctrlCtx.lineTo(linePos.lineTo[idx][0] * rtoW, linePos.lineTo[idx][1] * rtoH);
                }
                ctrlCtx.stroke();

                $(container).remove();
            });

            let btnCancel = document.createElement('button');
            btnCancel.textContent = 'Cancel';
            btnCancel.addEventListener('click', function(){
                $(container).remove();
            });

            let btnClear = document.createElement('button');
            btnClear.textContent = 'Clear';
            btnClear.addEventListener('click', function(){
                linePos.moveTo = [];
                linePos.lineTo = [];
                ctx.clearRect(0,0,canvas.width, canvas.height);
            });

            btnArea.append(btnOK);
            btnArea.append(btnCancel);
            btnArea.append(btnClear);
        });
    },
};