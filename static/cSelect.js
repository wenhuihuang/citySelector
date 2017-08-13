$.fn.cSelect = function(options){
    if(options && typeof options != 'object') return ;

    

    var me = this;
    var defaults = {
        type : "default",
        data : position, //地区分类数据
        hot : hot, //热门地区
        textField : 'address-text', //地区文字域
        codeField : 'address_code', //地区id域
        text:'343',
        uuid : uuid(4,4),
        selected : []

    }
    var settings = $.extend(defaults,options);
    bindEvent(me,settings)
    var layerWrapper = $('<div id="layer_'+settings.uuid+'" class="layer_class" init="true" style="position: absolute; z-index: 1000; left: 51px; top: 107px; display: block;" />')
    var rightContent = $('<div class="con" />')
    var cityList = $('<div class="work_position_click_center_right_list de d3" />')
    var countyList = $('<div  class="work_position_click_center_right_list de d3" style="border:none;" />')
    var tin = null;

    function initDom(me,settings){
        var body = $('body');
       
        var layerInit = $('<div id="work_position_click_init" class="panel_lnp panel_py panel_ct con_m" />')
        var topMessageContent = getTopMessageContent();
        var topMultipleContent = getTopMultipleContent();
        var centerContent = getCenterContent();
        var buttomContent = getBottomContent();
        var mask = getMask();
        layerInit.append(topMessageContent).append(topMultipleContent).append(centerContent).append(buttomContent);
        layerWrapper.append(layerInit);
        body.append(layerWrapper).append(mask)
        tin = layerWrapper.find('.tin');

        initEvent();
    }

    //遮罩层
    function getMask(){
        return $('<div id="layer_back_drop" class="layer_back_drop_class" style="z-index: 999; position: absolute; width: 1903px; height: 2699px; left: 0px; top: 0px; display: block;" />');
    }

    //弹窗内容顶部：消息部分
    function getTopMessageContent(me,settings){
        return '<h2 id="work_position_click_top">'+
                '<p id="work_position_click_top_message">选择地区<span class="sp">（最多只能选择<strong>5</strong>项）</span></p><a class="js_click_close" href="javascript:void(0);"><i></i></a>'+
            '</h2>';
    }

    //弹窗内容顶部内容：多选部分
    function getTopMultipleContent(me,settings){
        return '<div id="work_position_click_multiple" class="panel_tags mk ">'+
                '<div class="tin" id="work_position_click_multiple_selected"><span id="work_position_click_multiple_selected_each_030200" class="ttag" data-value="030200"><span>广州</span><em></em></span>'+
                '</div>'+
                '<p id="work_position_click_multiple_error" class="error element_hide">最多只能选择5项</p>'+
            '</div>'
    }

    //弹窗内容中间 左边加右边
    function getCenterContent(){
        var centerContent = $('<div id="work_position_click_center" class="panel_selt" />')
        var leftContent = getCenterLeftContent();
        var rightContent = getCenterRightContent();
        centerContent.append(leftContent);
        centerContent.append(rightContent);
        
        return centerContent;
    }
    
    //底部按钮
    function getBottomContent(){
        return '<div id="work_position_click_bottom" class="but_box"><span class="p_but" id="work_position_click_bottom_save">确定</span><span class="p_but gray work_position_click_close">取消</span></div>';
    }
    

    //弹窗内容左边：
    function getCenterLeftContent(){

            if(settings.data && typeof settings.data != 'object' ) return;
            var data = settings.data;

            var leftContent = $('<ul id="work_position_click_center_left" class="sbar" />')
            
            var eleArray = [];
            var currentWord = "";

            eleArray.push('<li class="on" data-id="0">热门城市<em></em></li>');

             for(var i = 0; i < data.length;i++){
                    if(data[i]['mark'] == currentWord ){
                        eleArray.push("<li data-id='"+data[i]['id']+"'><span>"+data[i]['name']+"</span></li>")
                    }else{
                        currentWord = data[i]['mark'];
                        eleArray.push("<li data-id='"+data[i]['id']+"'><b>"+currentWord+"</b><span>"+data[i]['name']+"</span></li>")
                        
                    }
                }

            leftContent.append(eleArray.join(""))

            return leftContent;

    }

    //弹窗内容右边
    function getCenterRightContent(me,settings){
        
        return rightContent;
    }

    //点击左边内容切换右边内容(城市)
    function updateRightContent(index,data_text){
        
        if(settings.data && typeof settings.data != "object") return;
        var isHot = false;
        if(index == 0){
            isHot = true;
            var data = settings.hot;
        }else{
            index = index - 1;
            var data = settings.data[index];
        }

        
        var city = data.l2
        var eleArray = [];
        eleArray.push('<div><em data-id="'+data['id']+'" class="js_click_select" data-text="'+data_text+'">选择本省</em></div>')
        eleArray.push('<table><tbody><tr>')
        for(var i = 0; i < city.length;i++){
             if(i != 0 && i%7  == 0){
                eleArray.push('</tr>');
                eleArray.push('<tr>');
            }

            if(isHot){
                eleArray.push('<td class="js_more"><em data-id="'+city[i]["id"]+'" class="js_city on">'+city[i]['name']+'</em></td>')    
            }else{
                eleArray.push('<td class="js_more"><em data-id="'+data['id']+','+city[i]["id"]+'" class="js_city on">'+city[i]['name']+'</em></td>')
            }
        }
        eleArray.push('</tr></tbody></table>')
        cityList.empty().append(eleArray.join(""))
        rightContent.empty().append(cityList)

        addOn();
        

    }

    //点右边城市部分切换区县
    function updateCounty(id_srt,data_text){
        var id_array = id_srt.split(',');
        var data = getObjById(settings.data,id_array[0])
        var citys = data.l2;
        var city = getObjById(citys,id_array[1])
        var countys = city.l3;
        var eleArray = [];
            eleArray.push('<div><em data-id="'+id_srt+'" class="js_click_select" data-text="'+data_text+'">选择本市（县）</em></div>')
            eleArray.push("<table><tbody><tr>");
         for(var i = 0; i < countys.length;i++){
             if(i != 0 && i%7  == 0){
                eleArray.push('</tr>');
                eleArray.push('<tr>');
            }
            var id = [id_array[0],id_array[1],countys[i]['id']].join(',');
            eleArray.push('<td class="js_more"><em data-id="'+id+'" class="js_click_select">'+countys[i]['name']+'</em></td>')
        }
        eleArray.push('</tr></tbody></table>')
        countyList.empty().append(eleArray.join(""))
        rightContent.append(countyList)
        
    }

    //根据id从数据中获取对象
    function getObjById(arr,id){
        for(var i = 0; i < arr.length;i++){
            if(arr[i]['id'] == id ){
                return arr[i]
            }
        }
    }

    //选择区域
    function select(id,text){
        var delArray = [];
        var id_array = id.split(',');
        //选中本省
        if(id_array.length == 1){
            countyList.empty();
        }

        for(var i = 0; i < settings.selected.length;i++){
             if(settings.selected[i]['id'] == id){
                //如果有则删除
                settings.selected.splice(i,1);
                eachSelect(settings.selected);
                addOn();
                return;
            }
            //如果选中的是子则删除父区域
            if(id.indexOf(settings.selected[i]['id']) > -1 && settings.selected[i]['id'].split(',').length < 3){
                delArray.push(i)
                //eachSelect(settings.selected);
            }
            //如果选中父区域则删除子区域
            if(id_array.length < 3 && settings.selected[i]['id'].indexOf(id) > -1 ){
                delArray.push(i)
            }
        }

        for(var i = 0 ;i < delArray.length;i++){
            //因为splice 会改变原来数据，导致数据的长度改变，又因为之前删除了一个，所以减去i个就是当前要删除的元素
           settings.selected.splice(delArray[i]-i,1);
        }

        //如果没有则添加
        settings.selected.push({id:id,text:text});
        eachSelect(settings.selected);
        addOn();
        
    }

    //添加选中样式 on
    function addOn(){
        rightContent.find('em').removeClass('on')
        for(var i = 0,len = settings.selected.length; i < len;i++){
            var id = settings.selected[i]['id'];
            rightContent.find('[data-id="'+id+'"]').addClass('on')
        }
    }

    //遍历所选中的区域
    function eachSelect(arr){
        var eleArray = [];
        for(var i = 0; i < arr.length;i++){
            eleArray.push('<span class="ttag" data-id="'+arr[i].id+'"><span>'+arr[i].text+'</span><em></em></span>')
        }
        
        tin.empty().append(eleArray.join(""));
    }


    //弹窗展示
    function show(me,settings){
        
        var layer = $('#layer_'+settings.uuid);
        if(!layer.length > 0){
            initDom(me,settings)
        }
        eachSelect(settings.selected);
        layerWrapper.show();
        layer.next(".layer_back_drop_class").show();
    }

    //弹窗隐藏
    function hide(){
        $('.layer_class').hide();
        $(".layer_back_drop_class").hide();
    }

    //初始化事件
    function initEvent(){
        var lis = layerWrapper.find('.sbar').children('li');
        lis.on('click',function(e){
            var index = $(this).index()
            var text = $(this).text().replace(/\w/g,"");
            $(this).addClass('on').siblings('li').removeClass('on');
            updateRightContent( index, text );
        })

        layerWrapper.delegate('.js_city','click',function(){
            var id_srt = $(this).data('id');
            var text = $(this).text();
             addOn();
             $(this).addClass('on')
            updateCounty(id_srt,text)
           
        })
        
        $('.js_click_close').on('click',function(){
            hide();
        })
        layerWrapper.delegate('.js_click_select','click',function(){
            var id = $(this).data('id')+"";
            if(id.split(',').length < 3){
                var text = $(this).data('text');
            }else{
                var text = $(this).text().replace(/\w/ig,"");
            }
            
            select(id,text);
        })
    }

    function bindEvent(me,settings){
        $(me).on('click',function(){
            show(me,settings)
        })
        
    }

    //生成uuid
    function uuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random()*16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }



}