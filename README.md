Tick.js
=======

a lightweight animation library for javascript


#1.简介
Tick.js -- 轻量级的动画库


#2.兼容性

IE6+、Chrome、Firefox、Safari、Opera等浏览器

#3.使用

###参数

````
	Tick.to(element,props,type,speed,callback.callbackParams)
````

####例子：

````
   Tick.to(element,{
   		left:400,
		top:400,
		width:200,
		height:200,
		onComplete:function(){
			console.log("done")
		},
		onCompleteParams:[]
   },"easeInOutBack",1000);
   
````

###API

````
	Tick.to(element,props,type,speed,callback.callbackParams)
````

````
	Tick.from(element,props,type,speed,callback.callbackParams)
````

````
	Tick.fromTo(element,tProps,fProps,type,speed,callback.callbackParams)
````

