/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-4-27
 * Time: 下午9:30
 * To change this template use File | Settings | File Templates.
 */
//创建闭包，避免变量冲突
;(function(window,undefined){
    //创建插件对象
    var Tick = {},
        //浏览器判断
        isIE = !window.getComputedStyle;
    var animateType = {
        "easeInSine":{a:{x:0.47,y:0},b:{x:0.745,y:0.715}},
        "easeOutSine":{a:{x:0.39,y:0.575},b:{x:0.565,y:1}},
        "easeInOutSine":{a:{x:0.445,y:0.05},b:{x:0.55,y:0.95}},
        "easeInQuad":{a:{x:0.55,y:0.085},b:{x:0.68,y:0.53}},
        "easeOutQuad":{a:{x:0.25,y:0.46},b:{x:0.45,y:0.94}},
        "easeInOutQuad":{a:{x:0.455,y:0.03},b:{x:0.515,y:0.955}},
        "easeInCubic":{a:{x:0.55,y:0.055},b:{x:0.675,y:0.19}},
        "easeOutCubic":{a:{x:0.215,y:0.61},b:{x:0.355,y:1}},
        "easeInOutCubic":{a:{x:0.645,y:0.045},b:{x:0.355,y:1}},
        "easeInQuart":{a:{x:0.895,y:0.03},b:{x:0.685,y:0.22}},
        "easeOutQuart":{a:{x:0.165,y:0.84},b:{x:0.44,y:1}},
        "easeInOutQuart":{a:{x:0.77,y:0},b:{x:0.0175,y:1}},
        "easeInQuint":{a:{x:0.755,y:0.05},b:{x:0.855,y:0.06}},
        "easeOutQuint":{a:{x:0.23,y:1},b:{x:0.32,y:1}},
        "easeInOutQuint":{a:{x:0.86,y:0},b:{x:0.07,y:1}},
        "easeInExpo":{a:{x:0.95,y:0.05},b:{x:0.795,y:0.035}},
        "easeOutExpo":{a:{x:0.19,y:1},b:{x:0.22,y:1}},
        "easeInOutExpo":{a:{x:1,y:0},b:{x:0,y:1}},
        "easeInCirc":{a:{x:0.6,y:0.04},b:{x:0.98,y:0.335}},
        "easeOutCirc":{a:{x:0.075,y:0.82},b:{x:0.165,y:1}},
        "easeInOutCirc":{a:{x:0.785,y:0.135},b:{x:0.15,y:0.86}},
        "easeInBack":{a:{x:0.6,y:-0.28},b:{x:0.735,y:0.045}},
        "easeOutBack":{a:{x:0.175,y:0.885},b:{x:0.32,y:1.275}},
        "easeInOutBack":{a:{x:0.68,y:-0.55},b:{x:0.265,y:1.55}}
    };
    //---------------暴露接口--------------------
    /**
     * 到从起始目标点的函数
     * @param target
     * @param params
     */
    Tick.to = function(target,params){
        var self = this;
        //判断第二个参数是否为json
        if(!self._isObject(params)){
            return;
        }
        //初始化数据，传入target，params，以及后面的参数
        params = self._init.apply(self,arguments);
        //将整理后的数据，传入核心函数
        self._animate.apply(self,params);
    };
    /**
     * 从目标点到现在点的函数
     * @param target
     * @param params
     */
    Tick.from = function(target,params){
        var self = this;

        if(!self._isObject(params)){
            return;
        }
        for(var item in params){
            if(params.hasOwnProperty(item) && item != "onComplete" && item != "onCompleteParam"){
                //取出现在的属性值保存在临时变量中
                var tmp = parseFloat(self._css(target,item));
                //将参数值设置为属性值
                self._css(target,item,params[item]);
                //将临时变量中的属性值设为运动目标值
                params[item] = tmp;
            }
        }
        //将arguments[1]覆盖
        arguments[1] = params;

        params = self._init.apply(self,arguments);
        self._animate.apply(self,params);
    };
    Tick.fromTo = function(target,fParams,tParams){
        var self = this;
        if(!self._isObject(tParams) || !self._isObject(fParams)){
            return;
        }
        for(var item in fParams){
            if(fParams.hasOwnProperty(item) && item != "onComplete" && item != "onCompleteParam"){
                //将target的属性设置为from值
                self._css(target,item,fParams[item]);
            }
        }
        //将fParams除去
        Array.prototype.splice.call(arguments,1,1);
        //将剩余的arguments作为参数传入
        tParams = self._init.apply(self,arguments);

        self._animate.apply(self,tParams);
    };

    //---------------私有方法---------------------
    /**
     * 初始化参数
     * @param target
     * @param params
     * @returns []
     */
    Tick._init = function(target,params){
        var self = this,
            json = {},
            fn = null,
            fnParams = [],
            type = '',
            speed = 0,
            delay = 0,
            val = [];
        //第二个参数是json对象
        // 里面包括运动目标以及回调函数和函数参数
        for(var item in params){
            if(params.hasOwnProperty(item)){
                if(item == "onComplete"){
                    fn = params[item];
                }else if(item == "onCompleteParams"){
                    fnParams = params[item];
                }else{
                    json[item] = params[item];
                }
            }
        }
        //设置第三、四个参数type、speed
        if(self._isString(arguments[2])){
            type = animateType[arguments[2]] || animateType["easeInSine"];
            speed = arguments[3] || 1000;
        }else{
            type = animateType["easeInSine"];
            speed = arguments[2] || 1000;
        }
        //最终传给核心运动函数的参数
        val.push(target,json,type,speed,delay,fn,fnParams);

        return val;
    };
    /**
     * 判断是否是对象
     * @param obj 被判断的对象
     * @returns {boolean}
     * @private
     */
    Tick._isObject = function(obj){
        return Object.prototype.toString.call(obj) == "[object Object]";
    };
    /**
     * 判断是否是字符串
     * @param str 被判断的对象
     * @returns {boolean}
     * @private
     */
    Tick._isString = function(str){
        return Object.prototype.toString.call(str) == "[object String]";
    };
    /**
     * 设置元素属性
     * @param target
     * @param attr
     * @param val
     * @private
     */
    Tick._setAttr = function(target,attr,val){
        if(attr == "opacity"){
            if(isIE){
                target.setAttribute("style","filter:alpha(opacity="+val*100+")");
                return;
            }
        }else{
            val = val + "px";
        }
        target.style[attr] = val;
    };
    /**
     * 获取元素属性
     * @param target
     * @param attr
     * @private
     */
    Tick._getAttr = function(target,attr){
        var val,
            match;
        if(isIE){
            if(attr == "opacity"){
                var filter = target.currentStyle.filter,
                    reg = /alpha\(opacity=(\d+\.?\d*)\)/i;
                //去除空白符
                filter = filter.replace(/\s+/g,"");
                //字符串match方法返回捕获组
                match = filter.match(reg);
                //如果match有值，且为数组则返回捕获的数值
                if(match && match.length > 0){
                    return match[1];
                }
            }
            //IE下非透明度属性
            val = target.currentStyle[attr];
        }else{
            //非IE下属性
            val = window.getComputedStyle(target,null)[attr];
        }
        return val;
    };
    /**
     * 设置或者获取属性值
     * @param target
     * @param attr{json || attr}
     * @param val
     * @returns {属性值}
     * @private
     */
    Tick._css = function(target,attr,val){
        var self = this,
            argLen = arguments.length,
            //当参数为3个，或者当第二个参数为json时，是设置属性
            isSet = argLen > 2 || self._isObject(arguments[1]),
            isJson;
        if(argLen < 2) return;
        if(isSet){
        //设置属性值
            isJson = self._isObject(attr);
            if(isJson){
                //当为json对象是，遍历属性并设置值
                for(var item in attr){
                    if(attr.hasOwnProperty(item)){
                        self._setAttr(target,item,attr[item]);
                    }
                }
            }else{
                self._setAttr(target,attr,val);
            }
        }else{
        //获取属性值
            return self._getAttr(target,attr);
        }
    };
    /**
     * 贝塞尔函数
     * @param type
     * @param t
     * @returns {{x: number, y: number}}
     * @private
     */
    Tick._cubicBezier = function(type,t){
        var self = this,
            pa = {x:0,y:0},
            pb = type["a"],
            pc = type["b"],
            pd = {x:1,y:1},
            x,y;

        x = pa.x*Math.pow(1-t,3) + 3*pb.x*t*Math.pow(1-t,2) + 3*pc.x*Math.pow(t,2)*(1-t)+pd.x*Math.pow(t,3);
        y = pa.y*Math.pow(1-t,3) + 3*pb.y*t*Math.pow(1-t,2) + 3*pc.y*Math.pow(t,2)*(1-t)+pd.y*Math.pow(t,3);

        return {x:x,y:y};
    };
    /**
     * 核心运动函数
     * @param target
     * @param json
     * @param type
     * @param speed
     * @param delay
     * @param fn
     * @param fnParams
     * @private
     */
    Tick._animate = function(target,json,type,speed,delay,fn,fnParams){
        var self = this,
            timeScale = 1000/60,
            //speed/2为了保证动画的精细程度
            speed = speed/ 2,
            //count为动画的帧数
            count = speed/timeScale,
            //保存贝塞尔函数中前一次的时间值
            prevTime = 0,
            tmp = [];

        delay = delay || 0;
        if(target.timer){
            clearTimeout(target.timer);
        }
        //根据贝塞尔函数获取到贝塞尔曲线
        for(var i = 0 ;i <= Math.ceil(count*2) ; i++){
            //获取相应帧的x,y参数
            var  item = self._cubicBezier(type,i/(2*count));
            tmp.push(item);
        }

        //将函数取得的第一对为0的值去掉
        tmp.splice(0,1);

        //获取目标各参数初始值
        for(var key in json){
            target[key] = parseFloat(self._css(target,key));
        }

        //启动move函数，开始运动
        target.timer = setTimeout(function(){
            move();
        },timeScale + delay);

        function move(){
            var newValue,
                stop = false,
                //把数组对应下一个元素切割出来
                scale = tmp.splice(0,1)[0];
            //运动处理
            for(var key in json){
                if(!scale){
                    stop = true;
                    target.style[key] = json[key] + "px";
                }else{
                    newValue = target[key] + (json[key] - target[key]) * scale.y;
                    target.style[key] = newValue + "px";
                }
            }
            //时间处理
            if(scale){
                var time = speed * scale.x;
                timeScale = time - prevTime;
                prevTime = time;
                //强制将运动频率同步为浏览器刷新率
                if(timeScale < 1000/60){
                    timeScale = 1000/60;
                }
                //启动计时器
                target.timer = setTimeout(function(){
                    move();
                },timeScale);
            }
            //停止处理
            if(stop){
                //但所有帧完成后清除下次调用
                clearTimeout(target.timer);
                if(typeof fn == "function"){
                    fn.apply(target,fnParams);
                }
            }

        }

    };
    //---------------------------------------------

   //将对象传递给全局作用域
    window.Tick = Tick;
}(window));