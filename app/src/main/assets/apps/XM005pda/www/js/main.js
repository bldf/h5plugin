/**
		 * 使用interact.js注意事项： 在需要多动的元素必须添加样式-ms-touch-action:none;	-action:none;不然拖动没效果,
		 *                   但是这样又会有个问题就是在不能操作滚动条了，所以这个样式通过js去控制
		 */
		var OFSETARR,VERTICAL,LIW,LIH,ULGRID="ul.gridcon";//LIW:li的宽度。LIH:li的高度
		var SDINTTOUCHSTYLE = 'ul.gridcon{-ms-touch-action:none;touch-action:none;}' ;
		var APP = new Vue({
			el:'.mui-content',
			data:{liArr:null},
			updated:setAllOfet,
			mounted:function(){
				var arr2,arr = [{text:'添加',ico:'icon-jia',href:'addMenu.html'}];
				if(LL.sdintmainstr){//如果当前页面已有选中,添加回显
					 arr2 = JSON.parse(LL.sdintmainstr);
					_.forEach(arr2,function(n){
						n.text!='添加'&&arr.splice(arr.length-1,0,n);
					});
				}
				this.liArr=_.map(arr,function(d){d.uid=mui.uuid++;return d});
			},
			methods:{
				rmli:function(d){//删除li
					_.remove(this.liArr,function(n){//一次性全部删除
						return n.uid==d.uid;
					});
					this.liArr =_.clone(this.liArr);
					LL.sdintmainstr = JSON.stringify(APP.liArr);
				},
				goHref:function(d){//li点击事件，跳转页面
					if(!mui('li.down').length){
						if(d.text!='添加'){
							M.goT(d.href,d.text) ;
						}else{
							M.go(d.href);
						}
					}
				}
			}
		})
		function res(){//清楚样式
			for(var a= 0,d,arr=mui('li.mui-table-view-cell');d=arr[a];a++){
				  d.classList.remove('down') ; 
				  d.classList.remove('scale') ;
				  d.classList.remove('trans') ;
			}
		};
		function gs(el){//获取元素的父级li元素
			el.is('li')?1:el=el.parentNode ;
			el.is('li')?1:el=el.parentNode ;
			return el ;
		}
		//VERTICAL :计算横着一共可以放多少个
		function setAllOfet(){//获取所有元素的offset坐标，存储
			var index=1,_lis=mui(ULGRID)[0].querySelectorAll('ul>li'),dyadicArray={};
			//dyadicArray:按照坐标存放dom元素。
			VERTICAL = parseInt(mui(ULGRID)[0].offsetWidth/_lis[0].offsetWidth);
			OFSETARR= [];
			_.forEach(_lis,function(dom,i){
				var d = M.offset(dom) ;
				dom.dataset.order= i ;// order从0开始的
				OFSETARR.push({dom:dom,offset:d});
				dyadicArray[index]=dyadicArray[index]||[];
				dyadicArray[index].push(dom) ;
				dom.dataset.orderX=index;
				dom.dataset.orderY=dyadicArray[index].length;//坐标都是从1开始的。
				!((i+1)%VERTICAL)&&(index++);
			});
			LIW = _lis[0].offsetWidth ; 
			LIH = _lis[0].offsetHeight; 
			LL.sdintmainstr = JSON.stringify(APP.liArr);
		}
		//计算x轴和y轴坐标发生的变化。 oldAr老坐标， newAr新坐标，width宽，height，高。deom:[2排中的3, 3排中的1]
		function checkSet(oldAr,newAr,width,height,type){
		  var x=0,y=0;
		   if(checkType(newAr)=='array' && checkType(oldAr)=='array'){
		   	    if(type==='lt'){//如果是向左let,或者上top移动了 。
		   	    	x = (newAr[1] - oldAr[1])*width;
				    y = (newAr[0] - oldAr[0])*height;
		   	    }else{
			   	    x = -(oldAr[1] - newAr[1])*width;
				    y = -(oldAr[0] - newAr[0])*height;	
		   	    }
		   }else{
		     console.warn('参数不合法！');
		   }
		   return {x:x,y:y};
		};
		/**
		 * 根据一个数字和横排的个数，计算出， x和y坐标。返回一个数组，坐标从1开始的
		 * demo  : 5 ,3  return [2,2]
		 * @param {Object} i
		 * @param {Object} n
		 */
		function getSetByNum(i,n){
			var x ,y ; 
	        if(i%n===0){//如果是最后一个
	            x = i/n ;
	            y = n; 
	        }else{
	            x = parseInt(i/n)+1 ;
	            y = i - parseInt(i/n)*n ;
	        }
			return [x,y];
		};
		/**
		 * 根据一个坐标和横排的个数返回一个数字
		 * demo: getNumByXY(2,2,4)   return 6;
		 * @param {Object} x
		 * @param {Object} y
		 * @param {Object} n
		 */
		function getNumByXY(x,y,n){
			return (parseInt(x)-1)*parseInt(n)+parseInt(y) ;
		}
		function rmTrans(b,e){//清楚translate样式,并且添加transition样式，这样会有一个过度的效果   ; b开始坐标， e结束坐标。
			for(var a =b;a<e;a++){
				var dom = OFSETARR[a].dom ;
				dom.style.transform='translate(0px,0px)';
				dom.classList.add('trans');
				delete dom.dataset.odd ;
			}
		};
		/**
		 * 
		 * @param {Object} b
		 * @param {Object} e
		 * @param {Object} type   === 'lt' 就是往左或者上移动了。
		 */
		function mvTrans(b,e,type){//修改transform坐标,b：开始坐标， e:结束坐标
			var dom,domX,domY,obj ;
			for(var a =b;a<e;a++){//在这中间的元素，坐标要发生变化。
				if(!OFSETARR[a])break;
				 dom = OFSETARR[a].dom ;
				 domX = dom.dataset.orderX ;
				 domY = dom.dataset.orderY ;
				 if(type==='lt'){
				 	obj = checkSet([domX,domY],getSetByNum(getNumByXY(domX,domY,VERTICAL)+1,VERTICAL),LIW,LIH,type);
				 	dom.dataset.odd=1;
				 }else{
				 	obj = checkSet([domX,domY],getSetByNum(getNumByXY(domX,domY,VERTICAL)-1,VERTICAL),LIW,LIH,type) ;
				 	dom.dataset.odd=-1;
				 }
				 dom.classList.add('trans') ; //添加transition过度的效果
//						 console.log(a,[domX,domY],getSetByNum(a,VERTICAL),LIW,LIH,obj);
//						 ((y-1)*n)+x-1 // 根据x，y坐标和横着能放几个计算出 。在数组中的index坐标，返回的是从0开始的
				 dom.style.transform='translate('+obj.x+'px,'+obj.y+'px)';
			}
		}
		function sumOfset(){//计算offset坐标。this：当前移动的元素li
				var of2=M.offset(this) ;//实时移动的坐标位置
				var scaleSize=Number((((this.style.transform+'').match(/(scale\()\d+\.\d+/gi) || ['1'])[0]).match(/\d+\.\d+/gi)[0]);//自动计算如果有给样式添加transform scale放大。
				var si = (of2.top + this.offsetHeight*scaleSize - M.offset(mui(ULGRID)[0]).top) / LIH;
				var si2 = (of2.left + this.offsetWidth*scaleSize) / LIW;
				var x = Math.round(si2) ; 
				var y = Math.round(si) ;
				var od = parseInt(this.dataset.order) ;
				var moveIndex =(y-1)*VERTICAL +x -1 ;//数组中的坐标，从0开始计算 
				if(moveIndex > this.dataset.order){//如果是向下移动了,在这之间的坐标要整体加1
					rmTrans(0,od);
					rmTrans(moveIndex+1,OFSETARR.length);
					mvTrans(od+1,moveIndex+1);
//					console.log('右或者下移动了');
				}else if(moveIndex < this.dataset.order){//如果是向上移动了，在这之间的坐标要整体减1
					rmTrans(0,moveIndex);
					rmTrans(od+1,OFSETARR.length);
					mvTrans(moveIndex,od,'lt');
//					console.log('左或者上移动了');
				}else{//如果移动到了原地方
					rmTrans(0,moveIndex);
					rmTrans(od+1,OFSETARR.length);
//					console.log('移动到了原地方');
				}
				this.dataset.odd=moveIndex-parseInt(this.dataset.order);
		};
		function setLiOrder(){//排序所有的li标签,并且更新html;
			APP.liArr=_.map(_.orderBy(OFSETARR,function(d){
				return parseInt(d.dom.dataset.order) + parseInt(d.dom.dataset.odd || 0) 
			}),function(d){
				var r=d.dom.dataset.odd ;
				d=APP.liArr[d.dom.dataset.order];
				r&&(d.uid=mui.uuid++);
				return d;
			});
		}
		interact.maxInteractions(Infinity);
		interact('li.mui-table-view-cell').on('hold',function(e){
			var el = gs(e.target);
			if(el.querySelectorAll('span.iconfont.icon-jia').length)return ;//如果是添加则不做拖拽。
			res();
			el.classList.remove('scale') ;
			el.classList.add('trans');
			el.classList.add('down');
			el.classList.add('scale');
			if(mui('#sdinttouchstyle').length){//如果有样式标签了
				mui('#sdinttouchstyle')[0].innerText=SDINTTOUCHSTYLE;
			}else{
				mui('body')[0].appendChild(('<style id="sdinttouchstyle">'+SDINTTOUCHSTYLE+'</style>').toDom());
			}
//			console.log('长按了。。。') ;
		}).on('up',function(e,a,d){
			var el = gs(e.target);
			el.classList.remove('scale') ;
			el.classList.remove('trans') ;
//			console.log('鼠标停止了') ;
		}).on('down',function(e,a,d){
//			console.log('点击') ;
			if(e.target.is('span'))return ;//如果点击的是关闭的span，则不做操作
			_.forEach(OFSETARR,function(d){
				d.dom.classList.remove('down') ;
			});
		}).draggable({
    		max: Infinity,
  		}).on('dragstart',function(event){//开始移动的时候触发
  			  var thumb = gs(event.target);
  			  if(!thumb.classList.contains('scale'))return ;//如果当前没有启动移动则不触发移动
		        event.interaction.x = 0;
    			event.interaction.y = 0;
		        thumb.classList.remove('trans') ;
//		        console.log('开始移动',mui('#sdinttouchstyle')[0].innerText) ;
		}).on('dragmove', function (event) {//移动的时候触发
//			console.log('正在移动') ;
			var thumb = event.target;
	         if(!thumb.classList.contains('scale'))return;//如果当前没有启动移动则不触发移动
	         event.interaction.x += event.dx;
			 event.interaction.y += event.dy;
	         thumb.style['transform'] = 'scale(1.2) translate(' + event.interaction.x + 'px,' + event.interaction.y + 'px)';
	         sumOfset.call(thumb);
  		}).on('dragend', function (event) {//移动结束的时候触发
  			 var el =gs(event.target);
  			 if(el.dataset.odd==0){//如果移动过
  			 	el.classList.add('down');
  			 	el.style='';
  			 }else if(!el.dataset.odd){//如果当前没有启动移动
  			 	el.classList.remove('down');
  			 }else{
  				setLiOrder(); 	
  			 }
			 mui('#sdinttouchstyle').length&&(mui('#sdinttouchstyle')[0].innerText='');
//			console.log('移动结束的时候触发') ;
		});
		
		document.addEventListener('touchmove', function (event) {//监控用户滑动
				if(mui('li.down').length){
					 window.event.returnValue = false;
				}else{
					 window.event.returnValue = true;
				}
//					console.log('9999')
		}, false);
/*************   Begin 和拖动关系不大的业务逻辑  ***************************/
			//保存单个页面选择过来的
			function saveOne(arr){
				_.forEach(arr,function(n){
					APP.liArr.splice(APP.liArr.length-1,0,n);	
				});
				LL.sdintmainstr = JSON.stringify(APP.liArr);
			}
/*************   和拖动关系不大的业务逻辑   End***************************/