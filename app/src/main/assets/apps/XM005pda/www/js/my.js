LL.appid = mui('#edition2')[0].attr('data-appid') ; //当前app版本
mui('.mui-content').on('tap','a',function(){
			M.p() ;
//			!~this.innerText.indexOf('密码')&&mui('#liup')[0].classList.remove('mui-active');
			switch (this.getAttribute('data-index')){
				case '9'://如果是注销登录
				mui.confirm('注销成功后将会重新登录','确定要注销吗',['确认','取消'],function (e) {
					if(!e.index){
						sendAjax('/loginOut',{},function(d){});
					}
				});
					break;
				case '3'://如果是技术支持
					M.goT('./support/support.html','技术支持'); 
					break;
				case '2'://如果是操作说明书
					break;
				case '4':
				if(this.parentNode.querySelectorAll('span.mui-badge.mui-badge-red').length){
					var o = JSON.parse(LL.appupdateInfo), obj = event.detail ;
					function ld(){
						var str ='https://www.pgyer.com/xm005pda';
						function err(){
							M.toast('你取消了更新！');
						}
						mui.os.ios&&(str = 'https://www.pgyer.com/xm005pda');
				  	sendAjax(str,{password:'syhf'},function(d){
				  		if(d.message=='完成'&&d.extra&&d.extra.href){
				  			plus.runtime.openURL(d.extra.href,err);
				  		}else{
				  			plus.runtime.openURL(str,err);
				  		}
				  	});
					}
					!~M.netWork().info.indexOf('WiFi') && mui.toast('当前非WIFI网络！请注意流量资费！') ;
					if(obj.type){
						ld() ;
						return ;
					}
					mui.confirm('新版本更新内容为：\n【'+o.describe+'】更新日期：【'+o.releaseDate+'】','最新版本为：'+o.edition,['确认','取消'],function (e) {
					!e.index&&ld();
				});
				}else{
					mui.confirm('是否打开浏览器查看最新安装版本','获取最新版本',['确认','取消'],function (e) {
						if(!e.index){
							(function(){
								var str ='https://www.pgyer.com/xm005pda';
									function err(){
										M.toast('你取消了查看！');
									}
									mui.os.ios&&(str = 'https://www.pgyer.com/xm005pda');
							  	sendAjax(str,{password:'syhf'},function(d){
							  		if(d.message=='完成'&&d.extra&&d.extra.href){
							  			plus.runtime.openURL(d.extra.href,err);
							  		}else{
							  			plus.runtime.openURL(str,err);
							  		}
							  	});
							})();
						}
					}) ;
					M.toast('当前已是最新版本！'); 
				}
					break;
			}
		});
		mui('#USER')[0].innerText = LL.userName ;
		mui('#uppwd').on('tap','button',function(){//修改密码
			M.p() ;
			var  o = M.getV('.mui-input-group input') ;
			switch (this.getAttribute('data-index')){
				case '1'://如果是确定
					if(o.oldpwd==''){
						mui.toast('原密码不能为空！'); 
					}else if(o.newpwd==''){
						mui.toast('新密码不能为空！'); 
					}else if(o.newpwd != o.newpwd2){
						mui.toast('新密码2次输入的不正确,请重新输入！') ; 
					}else{
					    sendAjax('/users/updateUserPassword.do',o,function(d){
					    	if(d.fail){
								mui.alert(d.fail,'修改密码失败','btnValue',function (e) {
									
					    		},'div');					    		
					    	}else{
					    		M.toast('修改成功!请重新登录！','center') ;
					    		mui.fire(plus.webview.getWebviewById('index.html'),'tapindex');
								M.go('login.html');
								LL.removeItem('loginInfo');
					    	}
					    });
					}
					break;
				case '0'://如果是取消
				M.reset('.mui-input-group input');
				mui('#liup')[0].classList.remove('mui-active');
					break;
			}
		});
		mui.back=function(){//返回切换到后台不做退出处理
			mui.fire(plus.webview.getWebviewById('index.html'),'tapindex');
		};
		mui.plusReady(loadNumber);		