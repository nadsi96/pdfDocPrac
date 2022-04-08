var signArea = {
    // witdh: '200px',
    // height: '200px',
    // width: 200,
    // height: 200,
    // containerRect: null,
    // canvas: null,
    // ctx: null,
    // pos: null,
    // prePos: null,
    // pos = [left, top]
    createElem: function(parent, ctlPos, width, height){
        width = width || ('200px');
        height = height || ('200px');

        let prePos = [0,0];
        let pos = [0,0];
        let containerRect;

        function signStart(e){
            e.stopPropagation();

            containerRect = ctx.canvas.offsetParent.getBoundingClientRect();
            prePos = [
                e.clientX - containerRect.x,
                e.clientY - containerRect.y
            ];
            // prePos = [
            //     e.clientX,
            //     e.clientY,
            // ];

            this.addEventListener('mousemove', signDraw);
            this.addEventListener('mouseup', signEnd);
        };
        function signDraw(e){
            e.stopPropagation();

            console.log('prePos : ' + prePos);
            console.log('current Pos: ' + pos);
            pos = [
                e.clientX - containerRect.x,
                e.clientY - containerRect.y,
            ];
            // pos = [
            //     e.clientX,
            //     e.clientY
            // ];

            // begin
            ctx.beginPath();
            // from
            ctx.moveTo(prePos[0], prePos[1]);
            // to
            ctx.lineTo(
                pos[0],
                pos[1]
            );

            // draw
            ctx.stroke();

            prePos = [
                pos[0],
                pos[1]
            ];
        };
        function signEnd(e){
            e.stopPropagation();
            
            this.removeEventListener('mousemove', signDraw);
            this.removeEventListener('mouseup', signEnd);
        };
        
        let div = document.createElement('div');
        div.style.height = height;
        div.style.width = width;
        div.style.position = 'absolute';
        div.style.left = ctlPos[0] + 'px';
        div.style.top = ctlPos[1] + 'px';
        div.style.border = '1px solid black';

        let canvas = document.createElement('canvas');
        canvas.classList.add('signArea');

        div.append(canvas);
        parent.append(div);
        // let containerRect = canvas.offsetParent.getBoundingClientRect();

        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';

        ctx.canvas.width = div.offsetWidth;
        ctx.canvas.height = div.offsetHeight;

        
        // canvas.addEventListener('mousedown', signStart);
        this.setEvent(div);

    },
    setEvent: function(ctrl){
        let canvas = $(ctrl).find('.signArea')[0];
        let ctx = canvas.getContext('2d');
        let containerRect = ctx.canvas.offsetParent.getBoundingClientRect();

        let pos = [0,0];
        let prePos = [0,0];

        function signStart(e){
            e.stopPropagation();

            containerRect = canvas.offsetParent.getBoundingClientRect();

            prePos = [
                e.clientX - containerRect.x,
                e.clientY - containerRect.y
            ];

            this.addEventListener('mousemove', signDraw);
            this.addEventListener('mouseup', signEnd);
        };
        function signDraw(e){
            e.stopPropagation();

            console.log('prePos : ' + prePos);
            console.log('current Pos: ' + pos);
            pos = [
                e.clientX - containerRect.x,
                e.clientY - containerRect.y,
            ];

            // begin
            ctx.beginPath();
            // from
            ctx.moveTo(prePos[0], prePos[1]);
            // to
            ctx.lineTo(
                pos[0],
                pos[1]
            );

            // draw
            ctx.stroke();

            prePos = [
                pos[0],
                pos[1]
            ];
        };
        function signEnd(e){
            e.stopPropagation();

            this.removeEventListener('mousemove', signDraw);
            this.removeEventListener('mouseup', signEnd);
        };

        ctrl.addEventListener('mousedown', signStart);
    }
};