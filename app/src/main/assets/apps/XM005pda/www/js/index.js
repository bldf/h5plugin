mui.init({
			swipeBack: true,//启用右滑关闭功能
			});
mui('body').on('tap','.mui-card-content li,.mui-content li',function(){
	var _t = this.querySelector('a[href]') || this.querySelector('b[href]') ;
	if(!_t){return;}
	M.p() ;
	var  href = _t.attr('href')+'',o = (_t.attr('data-options')+'').tojson(),title=_t.attr('title');
	!title && (title=_t.innerText.trim());
	if(~href.indexOf('html')){
		title==''&&(title=_t.parentNode.querySelector('span:not(.mui-badge)').innerText.trim()) ;
		if(_t.attr('go')){
			M.go(href,title,o.data,o.style,o.btn);
		}else{
			if(mui('div.mui-content').length && mui('div.mui-content')[0].attr('bg')){//如果有添加背景
				M.goT(href,title,o.data,{titleNView:{backgroundColor:mui('div.mui-content')[0].attr('bg')}},o.btn);
			}else{
				M.goT(href,title,o.data,o.style,o.btn);
			}
		}
	}else{
		M.toast('还未开发！','center');
	}
});
	//***************   Begin 下拉刷新  **************
		mui.init({
				swipeBack: false,
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						callback: pulldownRefresh
					}
				}
			});
			/**
			 * 下拉刷新具体业务实现
			 */
			function pulldownRefresh() {
				setTimeout(function() {
					mui.toast('下拉刷新成了');
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				}, 1000);
			}
			// ***********************  下拉刷新  End  ********************************