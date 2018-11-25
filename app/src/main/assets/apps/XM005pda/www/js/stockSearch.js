	loadNumber();
	var SEARCHDATA ,viewApi,NOREFRESH ;//NOREFRESH=true时不执行下拉刷新和上拉加载
	mui.plusReady(function(){
	var showHtml = document.getElementById('showListId').innerHTML,//显示列表数据的标签，该容器默认为隐藏状态
			    showCon = document.getElementById('dataCon') ,//显示数据的容器的id为dataCon
			    PAGE = 0,//当前显示的页数
			    ROWS = 35//每页加载的数据
			    TOTAL = 100 ,//一共显示多少条数据
			    header = document.querySelector('body>header'),//表头 
			    self = plus.webview.currentWebview() ,
			    UP={//上拉加载
						contentrefresh: '正在加载...',
						callback: pullupRefresh
					},
			    TESTDATA = self.test,//TESTDATA ==true 加载测试数据
//			    TESTDATA =true,//TESTDATA ==true 加载测试数据
 				SEARCHDATA = self.searchData ; 
			    DATAURL  = self.dataurl ;//加载数据的url
			    !header && (header=mui('#listPage>header')[0]) ;//如果获取不到header说明就单页面列表加查询，重新获取header
			    if(!SEARCHDATA)SEARCHDATA = {} ;
			    if(!DATAURL){// 增加可以通过给header标签添加data-options="url:'/asf.do'" ;等方式添加数据的url;
			    	var k = header.attr('data-options') ; 
			    	if(k){
						self.dataurl=(k+'').tojson().url ;
						DATAURL =self.dataurl ; 
			    	}
			    	if(!DATAURL&&document.querySelectorAll('a.mui-control-item.mui-active').length){//如果是有点击的table页签
			    		k = document.querySelectorAll('a.mui-control-item.mui-active')[0].attr('data-options') ;
			    		self.dataurl=(k+'').tojson().url ;
			    		DATAURL =self.dataurl ; 
			    	}
			    	if(!DATAURL && mui('div.sdint-seach-popover').length){//如果是头部下拉列表查询
			    		k = mui('div.sdint-seach-popover')[0].attr('data-options') ;
			    		self.dataurl=(k+'').tojson().url ;
			    		DATAURL =self.dataurl ; 
			    	}
			    }
			    (function(){
					var o = (header.attr('data-options')+'').tojson() ; 
				    	if(o.up || checkType(o.up)==='boolean')UP=o.up; 	
			    })();
			mui.init({
				pullRefresh: {
					container: '#pullrefresh',//因为这是一个通用的js，所以默认容器的id为pullrefresh
					down: {//下拉刷新
						style:'circle',
						auto:true,//初始化下拉加载一次
						callback: pulldownRefresh
					},
					up: UP
				}
			});
			document.querySelector('body').addEventListener('drag',function(e){//上滑显示表头，下滑不显示表头
				if(e.detail.deltaY>0){//向下滑动
					header.style.opacity='1'
				}else{//向上滑动
					document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop > 65 && (header.style.opacity='0');					
				}
			});
			function pullupRefresh() {//上拉加载
				if(NOREFRESH){
					mui('#pullrefresh').pullRefresh().endPullup();
					return ;
				}
				loadNumber();
				setTimeout(function() {
					   var ifRe = (PAGE+1) * ROWS>= TOTAL? true : false , le = document.querySelectorAll('#dataCon>*').length;
					    le < TOTAL && (ifRe =false );
					if(mui('#segmentedControl >a.mui-control-item.mui-active').length){
					    opt2 = (mui('#segmentedControl >a.mui-control-item.mui-active')[0].attr('data-options')+'').tojson() ;
					}
					  function load(data){
					  	var objarr = data.rows,opt =(header.attr('data-options')+'').tojson(),opt2={};
								for(var a = 0 ,d ;d=objarr[a] ; a++){
										d.i =  le+a+1;						
									 var div = document.createElement('div');
									 var fmt = opt.fmt||opt2.fmt ;
									    fmt && (d=fmt(d)) ;
									 div.innerHTML = showHtml.rep(d,'') ;
									 showCon.appendChild(div) ;
								}
								document.getElementById("total").innerText = '总记录：'+(opt.datalist?data.total :((PAGE) * ROWS>=data.total?data.total:(PAGE) * ROWS)+'/'+data.total )+' 条';
								TOTAL = data.total ;
								mui('img[data-lazyload]').length&&mui(document).imageLazyload({
									placeholder: '../img/user.png'
								});
					  }
						mui('#pullrefresh').pullRefresh().endPullup( ifRe); //参数为true代表没有更多数据了。
						if(ifRe){return ;}
						if(self.dataurl && self.dataurl!=''){
							PAGE ++ ;
							SEARCHDATA.page = PAGE ; 
							SEARCHDATA.rows = ROWS ;
							if(TESTDATA===true){//如果是加载测试数据
								var trr = showHtml.match(/\{\w+\}/gi),testObj={};
								for(var a =0,d;d=trr[a] ;a++){
									testObj[d.replace(/\{|\}/gi,'')]='MM5-10' ;
								}
								var o = getTestData({size:ROWS,obj:testObj}) ;
								var data = {rows:o,total:200} ;
								load(data) ;
							}else{
							sendAjax(self.dataurl,M.jRe(SEARCHDATA),function(data){
								load(data) ;
							});	
							}
						}else{
							var opt =(header.attr('data-options')+'').tojson() ;
							if(opt.datalist){//如果没有接口，只有数据，只需要给header配置 datalist即可,可以是方法
							    if(checkType(opt.datalist)==='function'){
								    opt.datalist(load) ;
							    }else{
								    load(opt.datalist) ;
							    }
							}else{
								mui.toast('参数传递错误！') ;
								return ;
							}
						}
				}, 200);
			}
			
			//*********   Begin 添加下拉刷新标签   *******************
			//这样写的目的是解决别的页面可以执行这个页面下拉刷新的问题
			mui('body')[0].appendChild('<i id="refreshTable" style="display:none;width:0;height:0;"><i>'.toDom());
			mui('#refreshTable')[0].addEventListener('tap',function(e){
					 pulldownRefresh((e.detail&&e.detail.search)?2:1);	
			});
			//*********   添加下拉刷新标签   End*******************
			
			/**
			 * 下拉刷新具体业务实现
			 */
			function pulldownRefresh(ty) {
				if(NOREFRESH){
					mui('#pullrefresh').pullRefresh().endPulldown(true);
					return ;
				}
				loadNumber();
				header.style.opacity='1';
				var pull = mui('#pullrefresh') ; 
				function load(data){
					var objarr = data.rows,le=1,html = '' ,opt =(header.attr('data-options')+'').tojson(),opt2={};
					if(mui('#segmentedControl >a.mui-control-item.mui-active').length){
					    opt2 = (mui('#segmentedControl >a.mui-control-item.mui-active')[0].attr('data-options')+'').tojson() ;
					}
						for(var a = 0 ,d ;d=objarr[a] ; a++){
							d.i =  le+a;		
							var fmt = opt.fmt||opt2.fmt ;
							fmt && (d=fmt(d)) ;
							html += showHtml.rep(d,'') ;
						}
						showCon.innerHTML=html ;
						mui("#total").length&&(mui("#total")[0].innerText = '总记录：'+(opt.datalist?data.total :((PAGE) * ROWS>=data.total?data.total:(PAGE) * ROWS)+'/'+data.total )+' 条');
						TOTAL = data.total ;
						M.ct();
						ty!=1&&mui.toast((ty==2?'查询':'刷新')+'成功！共'+TOTAL+'条',{type:'div'}) ;
						mui('img[data-lazyload]').length&&mui(document).imageLazyload({
								placeholder: '../img/user.png'
						});
				}
				setTimeout(function() {
						if(self.dataurl && self.dataurl!=''){
							PAGE  = 1  ;
							SEARCHDATA.page = PAGE ; 
							SEARCHDATA.rows = ROWS ;
							if(TESTDATA===true){//如果是加载测试数据
								load(testData()) ;
								mui.toast('***本次加载为测试数据***') ;
							}else{
								sendAjax(self.dataurl,M.jRe(SEARCHDATA),function(data){
									load(data) ;
								},true);
							}
						}else{
							var opt =(header.attr('data-options')+'').tojson() ;
							if(opt.datalist){//如果没有接口，只有数据，只需要给header配置 datalist即可,可以是方法
								 if(checkType(opt.datalist)==='function'){
								    opt.datalist(load) ;
							    }else{
								    load(opt.datalist) ;
							    }
							}else{
								mui.toast('参数传递错误！') ;
								return ;
							}
						}
				     pull.pullRefresh().refresh(true);
					 pull.pullRefresh().endPulldown();
				}, 200);
			}
			// 列表点击事件
			mui('#dataCon').on('tap','.mui-card-content',function(){
				var spans = this.querySelectorAll('.mui-ellipsis'),obj={} ; 
				for(var a = 0,d;d=spans[a]; a++){
					var key = d.getAttribute('name');
					if(key){
						obj[key]=d.innerText ;
					}
				}
				window.tapCall && (M.p(),tapCall(obj)) ;
			});
			// 如果有tab切换的点击事件：
			if(mui('#segmentedControl').length){
				mui('#segmentedControl').on('tap','a',function(){
					var o = (this.attr('data-options')+'').tojson();
					if(o.url){//如果有配置url
						M.ws.dataurl=o.url;//并执行下拉刷新操作
						o.fn&&o.fn.call(this);
						pulldownRefresh();
					}
				});
			}
			/**
			 * 加载列表所需要的假数据
			 */
			function testData(){
				var trr = showHtml.match(/\{\w+\}/gi),testObj={},o,data;
				for(var a =0,d;d=trr[a] ;a++){
					testObj[d.replace(/\{|\}/gi,'')]='MM10-16' ;
				}
				o = getTestData({size:ROWS,obj:testObj}) ;
				data = {rows:o,total:200} ;
				return data ;
			}
});
mui('.mui-scroll-wrapper').length&&mui('.mui-scroll-wrapper').scroll();//加载滚动条
mui('#popover').length&&mui('body').on('tap','#popover ul li',function(){//如果此页面为头部有下拉查询
				var t = this.innerText.trim() ,o=mui('#popover')[0].attr('data-options').tojson(); 
				M.p();
				for(var a = 0,d,arr=mui('#popover ul li');d=arr[a];a++){
					d.classList.remove('on') ;
				}
				this.classList.add('on');
				mui('#topInput')[0].value=this.attr('no-show')?'':t;
				mui.trigger(mui('body>div.mui-backdrop.mui-active')[0],'tap');
				if(t!=SEARCHDATA.lineName){
					~t.indexOf(o.placeholder)?delete SEARCHDATA.lineName:SEARCHDATA.lineName = t ;
					mui.trigger(mui('#refreshTable')[0],'tap',{search:true});
				}
			});
	mui('#topInput.line-name-list').length&&sendAjax('/basic/lineNameList.do',{page:1,rows:999},function(d){//如果列表上边有产线下拉，则加载产线
		var o=mui('#popover')[0].attr('data-options').tojson(),
			h = o.placeholder?'<li no-show="1" class="mui-table-view-cell"><a href="#">'+o.placeholder+'</a></li>':'' ;
		for(var a = 0,b;b=d[a];a++){
			h+= '<li  class="mui-table-view-cell"><a href="#">'+b.lineName+'</a></li>' ;
		}
		mui('#popover ul')[0].innerHTML = h ;
	});
(function($) {
		if(mui('#listAPP').length){//如果此页面为单页面中有list列表页面又有查询页面。则初始化
		var view ,oldBack = $.back;
		 viewApi = $('#listAPP').view({defaultPage: '#listPage'}) ;
		 view = viewApi.view ;
				$.back = function() {
					if (viewApi.canBack()){ //如果view可以后退，则执行view的后退
						M.ws.setStyle({popGesture:'close'});//恢复ios侧滑关闭功能
						viewApi.back();
					} else { //执行webview后退
						oldBack();
					}
				};
				view.addEventListener('pageBeforeShow', function(e) {
					if(~e.detail.page.id.indexOf('searchModdle')){
						NOREFRESH = true ; 
						$('body')[0].classList.add('mui-fullscreen');
						M.ws.setPullToRefresh({
						    support: false,
						    style: 'circle'
						}); 
					}else{
						NOREFRESH = false ;
						$('body')[0].classList.remove('mui-fullscreen');
						M.ws.setPullToRefresh({
						    support: true,
						    style: 'circle'
						}); 
					}
				});
		}
})(mui);
mui('header a[href="#searchModdle"]').length&&mui('header a[href="#searchModdle"]')[0].addEventListener('tap',function(){
	WN.plus&&M.ws.setStyle({popGesture:'none'});
	mui.trigger(mui('#listPage a[href="#searchModdle"]')[0],'tap');
});
