var arr = mui('.mui-card-content input');
		LL.ip = '192.168.201.15' ;
		LL.port = '8080';
//		LL.ip = '192.168.12.81';
//		LL.port = '8085';
		LL.ABC=true ;
		mui('.footer-btn').on('tap','button',function(){
			M.p();
			 var o = M.getV(arr);
				    mui('input:focus').length &&mui('input:focus')[0].blur() ; 
				    if(o.username==''){
				    	M.toast('用户名不能为空！','center') ;
				    }else if(o.password==''){
				    	M.toast('密码不能为空!','center') ;
				    }else{
				    	o.client='app';
				    	o.rememberMe = true ;
//				    	o.cid=plus.push.getClientInfo().clientid;
//				    	if(!o.cid){
//				    		mui.toast('获取推送失败！请在软件打开时允许推送！');
//				    		return ;
//					    }
				    	sendAjax('/login',o,function(d){
				    		if(d.success){
				    			M.toast('登录成功','center');
				    			LL.loginInfo='1';
				    			LL.userName = o.username;
				    			plus.webview.hide(M.ws, 'zoom-fade-in', 1500 );
					    			mui.later(function(){
					    				plus.webview.getLaunchWebview().evalJS('goIndex()');
					    			},1400);
				    		}else{
								M.toast(d.fail,'center') ;				    			
				    		}
				    	});
				    }
		});
		mui.back=function(){//返回切换到后台不做退出处理
			if(plus.android){	
				var main = plus.android.runtimeMainActivity();
	    		main.moveTaskToBack(false);				
			}
		};