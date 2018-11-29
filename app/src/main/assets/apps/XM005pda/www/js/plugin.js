document.addEventListener("plusready", function () {
    // `声明的JS“扩展插件别名”
    var _BARCODE = 'printbarcode',
        B = window.plus.bridge;
    var printbarcode = {
        // 声明异步返回方法
        PluginTestFunction: function (Argus1, Argus2, Argus3, Argus4, successCallback, errorCallback) {
            var success = typeof successCallback !== 'function' ? null : function (args) {
                successCallback(args);
            },
                fail = typeof errorCallback !== 'function' ? null : function (code) {
                    errorCallback(code);
                };
            callbackID = B.callbackId(success, fail);
            // 通知Native层plugintest扩展插件运行”PluginTestFunction”方法
            return B.exec(_BARCODE, "PluginTestFunction", [callbackID, Argus1, Argus2, Argus3, Argus4]);
        },
        PluginTestFunctionArrayArgu: function (Argus, successCallback, errorCallback) {
            var success = typeof successCallback !== 'function' ? null : function (args) {
                successCallback(args);
            },
                fail = typeof errorCallback !== 'function' ? null : function (code) {
                    errorCallback(code);
                };
            callbackID = B.callbackId(success, fail);
            return B.exec(_BARCODE, "PluginTestFunctionArrayArgu", [callbackID, Argus]);
        },
        // 声明同步返回方法
        PluginTestFunctionSync: function (Argus1, Argus2, Argus3, Argus4) {
            // 通知Native层plugintest扩展插件运行“PluginTestFunctionSync”方法并同步返回结果
            return B.execSync(_BARCODE, "PluginTestFunctionSync", [Argus1, Argus2, Argus3, Argus4]);
        },
        PluginTestFunctionSyncArrayArgu: function (Argus) {
            return B.execSync(_BARCODE, "PluginTestFunctionSyncArrayArgu", [Argus]);
        },
        // 链接也配对的打印机
        sdOpenPrinterSync:function (Argus1,successCallback, errorCallback) {
              var success = typeof successCallback !== 'function' ? null : function (args) {
                  successCallback(args);
              },
                  fail = typeof errorCallback !== 'function' ? null : function (code) {
                      errorCallback(code);
                  };
              callbackID = B.callbackId(success, fail);
              // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
              return B.exec(_BARCODE, "sdOpenPrinterSync", [callbackID, Argus1]);
          },
          printText:function (Argus1,successCallback, errorCallback) {
              var success = typeof successCallback !== 'function' ? null : function (args) {
                  successCallback(args);
              },
                  fail = typeof errorCallback !== 'function' ? null : function (code) {
                      errorCallback(code);
                  };
              callbackID = B.callbackId(success, fail);
              // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
              return B.exec(_BARCODE, "printText", [callbackID, Argus1]);
          },
          JoinPrinterAddress:function (Argus1,successCallback, errorCallback) {
               var success = typeof successCallback !== 'function' ? null : function (args) {
                   successCallback(args);
               },
                   fail = typeof errorCallback !== 'function' ? null : function (code) {
                       errorCallback(code);
                   };
               callbackID = B.callbackId(success, fail);
               // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
               return B.exec(_BARCODE, "JoinPrinterAddress", [callbackID, Argus1]);
           },
          printBarcode:function (Argus1,successCallback, errorCallback) {
               var success = typeof successCallback !== 'function' ? null : function (args) {
                   successCallback(args);
               },
                   fail = typeof errorCallback !== 'function' ? null : function (code) {
                       errorCallback(code);
                   };
               callbackID = B.callbackId(success, fail);
               // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
               return B.exec(_BARCODE, "printBarcode", [callbackID, Argus1]);
           },
           /**
            获取所有已配对的蓝牙列表
           */
           allddresses: function () {
              return B.execSync(_BARCODE, "allddresses");
          },
           /**
           初始化标签框架基础参数
           */
          initParam:function (paramArr,successCallback, errorCallback) {
               var argesArr,success = typeof successCallback !== 'function' ? null : function (args) {
                   successCallback(args);
               },
                   fail = typeof errorCallback !== 'function' ? null : function (code) {
                       errorCallback(code);
                   };
               callbackID = B.callbackId(success, fail);
               argesArr = [callbackID] ;
               for(var a = 0,d;d=paramArr[a];a++){
                    argesArr.push(JSON.stringify(d)) ;
               }
               // 通知Native层plugintest扩展插件运行”sdOpenPrinterSync”方法
               return B.exec(_BARCODE, "initParam",argesArr);
           },
           /**
            开始打印标签
           */
          printLabel:function (paramArr,successCallback, errorCallback) {
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
               return B.exec(_BARCODE, "printLabel",argesArr);
           }
    };
    window.plus.printbarcode = printbarcode;
}, true);