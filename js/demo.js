/**
 * js实现购物车功能
 */
window.onload = function () {
    // 兼容IE低版本不识别getElementsByClassName
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (cls) {
            var ret = [];
            var els = document.getElementsByTagName('*');
            for (var i = 0, len = els.length; i < len; i++) {

                if (els[i].className.indexOf(cls + ' ') >=0 || els[i].className.indexOf(' ' + cls + ' ') >=0 || els[i].className.indexOf(' ' + cls) >=0) {
                    ret.push(els[i]);
                }
            }
            return ret;
        }
    }
    // rows、cells
    var table = document.getElementById('cartTable'); // 购物车表格
    var selectInputs = document.getElementsByClassName('check'); // 所有勾选框
    var checkAllInputs = document.getElementsByClassName('check-all') // 全选框
    var tr = table.children[1].rows; //行 
    var selectedTotal = document.getElementById('selectedTotal'); //已选商品数目容器
    var priceTotal = document.getElementById('priceTotal'); //总计
    var deleteAll = document.getElementById('deleteAll'); // 删除全部按钮
    var selectedViewList = document.getElementById('selectedViewList'); //浮层已选商品列表容器
    var selected = document.getElementById('selected'); //已选商品
    var foot = document.getElementById('foot');

    // 更新总数和总价格，已选浮层
    function getTotal() {
        //选择check，加钱，
        var selected = 0, price = 0, html = '';
        for (var i = 0; i < tr.length; i++) {
            if (tr[i].getElementsByTagName('input')[0].checked) {
                //选中加入on显示背景色
                tr[i].className = 'on';
                //计算已选商品数目
                selected += parseInt(tr[i].getElementsByTagName('input')[1].value); 
                //计算总计价格
                price += parseFloat(tr[i].getElementsByTagName('td')[4].innerHTML); 
                // 添加图片到弹出层已选商品列表容器 index代表是选中的哪一行
                html += '<div><img src="'+tr[i].getElementsByTagName('img')[0].src+'"><span class="del" index="'+i+'">取消选择</span></div>';
            }else{
                //未选中删除背景色
                tr[i].className = '';
            }
        }
        selectedTotal.innerHTML = selected; // 已选数目
        priceTotal.innerHTML = price.toFixed(2); // 总价  小数点保留2位
        selectedViewList.innerHTML = html;
        //如果没有选中，浮层隐藏，否则有个空白处
        if (selected==0) {
            foot.className = 'foot';
        }
    }

    // 计算单行价格
    function getSubtotal(tr) {
        var cells = tr.cells;//取得一行tr下的所有td,用cells属性
        // var price =parseFloat(cells[2].innerHTML); 单价
        // var count = parseInt(tr.getElementsByTagName('input')[1].value) 获取数量
        // var subtotal = parseFloat(price*count);
        // cells[4].innerHTML =subtotal.toFixed(2);  //将总价写入小计td,并且保留2位小数
        var price = cells[2]; //单价
        var subtotal = cells[4]; //将总价写入小计td
        var countInput = tr.getElementsByTagName('input')[1]; //数目input
        var span = tr.getElementsByTagName('span')[1]; //-号 是tr第二个span元素
        //写入HTML
        subtotal.innerHTML = (parseInt(countInput.value) * parseFloat(price.innerHTML)).toFixed(2);
        //如果数目只有一个，把-号去掉
        if (countInput.value == 1) {
            span.innerHTML = '';
        }else{
            span.innerHTML = '-';
        }
    }

    // 点击checkbox框
    for(var i = 0; i < selectInputs.length; i++ ){
        selectInputs[i].onclick = function () {
            //如果是全选，所有的选择框选中
            //if (this.className === 'check-all check')
            if (this.className.indexOf('check-all') >= 0) { 
                for (var j = 0; j < selectInputs.length; j++) {
                    selectInputs[j].checked = this.checked;
                }
            }
            //只要有一个未勾选，则取消全选框的选中状态
            if (!this.checked) { 
                for (var i = 0; i < checkAllInputs.length; i++) {
                    checkAllInputs[i].checked = false;
                }
            }
            //选完更新总计
            getTotal();
        }
    }

    // 显示已选商品弹层
    selected.onclick = function () {
        //否则有个空白处
        // if (foot.className == 'foot') {
        //     if (selectedTotal.innerHTML != 0) {
        //         foot.className = 'foot show';
        //     }
        // }
        // else {
        //     foot.className = 'foot';
        // }
        if (selectedTotal.innerHTML != 0) {
            foot.className = (foot.className == 'foot' ? 'foot show' : 'foot');
        }
    }

    //已选商品弹层中的取消选择按钮
    selectedViewList.onclick = function (e) {
        //兼容低版本的ie
        var e = e || window.event;
        var el = e.srcElement;
        if (el.className=='del') {
            var input =  tr[el.getAttribute('index')].getElementsByTagName('input')[0]
            input.checked = false;
            input.onclick();
        }
    }

    //为每行元素添加事件
    for (var i = 0; i < tr.length; i++) {
        //将点击事件绑定到tr元素
        tr[i].onclick = function (e) {
            var e = e || window.event;
            //通过事件对象的target属性获取触发元素
            var el = e.target || e.srcElement; 
            //触发元素的class,-是reduce，+是add
            var cls = el.className; 
            // 获取tr中第二个input
            var countInout = this.getElementsByTagName('input')[1];
            //数目 
            var value = parseInt(countInout.value);
            //reduce是当前tr的第二个 span
            // var reduce = this.getElementsByTagName('span')[1];
            //通过判断触发元素的class确定用户点击了哪个元素
            switch (cls) {
                case 'add': //点击了加号
                    countInout.value = value + 1;
                    // reduce.innerHTML ='-';
                    getSubtotal(this);
                    break;
                case 'reduce': //点击了减号
                // if(value>1){
                //     countInout.value = value - 1;
                // }else{
                //     reduce.innerHTML='-';
                // }

                    if (value > 1) {
                        countInout.value = value - 1;
                        getSubtotal(this);
                    }
                    break;
                case 'delete': //点击了删除
                    var conf = confirm('确定删除此商品吗？');
                    if (conf) {
                        //相当于jq的remove();
                        this.parentNode.removeChild(this);
                    }
                    break;
            }
            getTotal();
        }
        // 给数目输入框绑定keyup事件
        tr[i].getElementsByTagName('input')[1].onkeyup = function () {
            var val = parseInt(this.value); //确保是个数字，否则为空时会出现NaN
            // 判断当input数字不是1的时候‘-’需要显示
            // var tr =this.parentNode.parentNode;
            // var reduce = tr.getElementsByTagName('span')[1];
            // if(val <=1){
            //     reduce.innerHTML='';
            // }else{
            //     reduce.innerHTML='-';
            // }
            if (isNaN(val) || val <= 0) {
                val = 1;
            }
            if (this.value != val) {
                this.value = val;
            }
            //parentNode.parentNode代表当前节点的爷爷节点 就是tr
            getSubtotal(this.parentNode.parentNode); //更新小计
            getTotal(); //更新总数
        }
    }

    // 点击全部删除
    deleteAll.onclick = function () {
        //避免没有选择的时候也弹窗
        if (selectedTotal.innerHTML != 0) {
            var con = confirm('确定删除所选商品吗？'); //弹出确认框
            if (con) {
                for (var i = 0; i < tr.length; i++) {
                    // 如果被选中，就删除相应的行
                    if (tr[i].getElementsByTagName('input')[0].checked) {
                        tr[i].parentNode.removeChild(tr[i]); // 删除相应节点
                        i--; //回退下标位置，否则当数组被改变后，下标改变
                    }
                }
            }
        } else {
            alert('请选择商品！');
        }
        getTotal(); //更新总数
    }

    // 进到商品列表，默认全选  并且触发它的onclick事件
    checkAllInputs[0].checked = true;
    checkAllInputs[0].onclick();
}
