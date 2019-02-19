document.addEventListener("plusready", function () {
    // `声明的JS“扩展插件别名”
    var _BARCODE = 'HFPlugin',
        B = window.plus.bridge;
    var HFPlugin = {
           /**
            获取所有已配对的蓝牙列表
           */
           allddresses: function () {
              return B.execSync(_BARCODE, "allddresses");
          },
           /**
           打开IFID
           */
          openIFID:function (paramArr,successCallback, errorCallback) {
               var argesArr,success = typeof successCallback !== 'function' ? null : function (args) {
                   successCallback(args);
               },
                   fail = typeof errorCallback !== 'function' ? null : function (code) {
                       errorCallback(code);
                   };
               callbackID = B.callbackId(success, fail);
               argesArr = [callbackID] ;
               for(var a = 0,d;d=paramArr[a];a++){
                    argesArr.push(d) ;
               }
               // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
               return B.exec(_BARCODE, "openIFID",argesArr);
           },
           /**
           关闭IFID
           */
          closeIFID:function (paramArr,successCallback, errorCallback) {
               var argesArr,success = typeof successCallback !== 'function' ? null : function (args) {
                   successCallback(args);
               },
                   fail = typeof errorCallback !== 'function' ? null : function (code) {
                       errorCallback(code);
                   };
               callbackID = B.callbackId(success, fail);
               argesArr = [callbackID] ;
               for(var a = 0,d;d=paramArr[a];a++){
                    argesArr.push(d) ;
               }
               // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
               return B.exec(_BARCODE, "closeIFID",argesArr);
           },
           /**
           获取IFID
           */
          getIFID:function (paramArr,successCallback, errorCallback) {
               var argesArr,success = typeof successCallback !== 'function' ? null : function (args) {
                   successCallback(args);
               },
                   fail = typeof errorCallback !== 'function' ? null : function (code) {
                       errorCallback(code);
                   };
               callbackID = B.callbackId(success, fail);
               argesArr = [callbackID] ;
               for(var a = 0,d;d=paramArr[a];a++){
                    argesArr.push(d) ;
               }
               // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
               return B.exec(_BARCODE, "getIFID",argesArr);
           },
          /**
          写IFID
          */
         writeIFID:function (paramArr,successCallback, errorCallback) {
              var argesArr,success = typeof successCallback !== 'function' ? null : function (args) {
                  successCallback(args);
              },
                  fail = typeof errorCallback !== 'function' ? null : function (code) {
                      errorCallback(code);
                  };
              callbackID = B.callbackId(success, fail);
              argesArr = [callbackID] ;
              for(var a = 0,d;d=paramArr[a];a++){
                   argesArr.push(d) ;
              }
              // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
              return B.exec(_BARCODE, "writeIFID",argesArr);
          },
          /**
            写IFID
            */
           readeIFID:function (paramArr,successCallback, errorCallback) {
                var argesArr,success = typeof successCallback !== 'function' ? null : function (args) {
                    successCallback(args);
                },
                    fail = typeof errorCallback !== 'function' ? null : function (code) {
                        errorCallback(code);
                    };
                callbackID = B.callbackId(success, fail);
                argesArr = [callbackID] ;
                for(var a = 0,d;d=paramArr[a];a++){
                     argesArr.push(d) ;
                }
                // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
                return B.exec(_BARCODE, "readeIFID",argesArr);
            },
           /**
           初始化ifid
           */
           initIFID:function (paramArr,successCallback, errorCallback) {
                          var argesArr,success = typeof successCallback !== 'function' ? null : function (args) {
                              successCallback(args);
                          },
                              fail = typeof errorCallback !== 'function' ? null : function (code) {
                                  errorCallback(code);
                              };
                          callbackID = B.callbackId(success, fail);
                          argesArr = [callbackID] ;
                          for(var a = 0,d;d=paramArr[a];a++){
                               argesArr.push(d) ;
                          }
                          // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
                          return B.exec(_BARCODE, "initIFID",argesArr);
                      }
    };
    window.plus.HFPlugin = HFPlugin;
}, true);