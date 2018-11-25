package com.example.H5PlusPlugin;
/**
 * 创建插件类
 创建一个继承自StandardFeature的类，实现第三方插件扩展。
 创建插件类需要引入的包
 import io.dcloud.DHInterface.IWebview;
 import io.dcloud.DHInterface.StandardFeature;
 import io.dcloud.util.JSUtil;
 */

import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.AlertDialog;
import android.widget.Button;
import android.widget.EditText;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;



import com.dothantech.lpapi.LPAPI;
import com.dothantech.printer.IDzPrinter;

import java.util.ArrayList;
import java.util.List;


public class PGPlugintest extends StandardFeature {

    //**********************    打印相关  Begin *************************
    // 用于处理各种通知消息，刷新界面的handler
    private final Handler mHandler = new Handler();

    // 保存各种信息时的名称
    private static final String KeyPrintQuality = "PrintQuality";
    private static final String KeyPrintDensity = "PrintDensity";
    private static final String KeyPrintSpeed = "PrintSpeed";
    private static final String KeyGapType = "GapType";

    private static final String KeyLastPrinterMac = "LastPrinterMac";
    private static final String KeyLastPrinterName = "LastPrinterName";
    private static final String KeyLastPrinterType = "LastPrinterType";

    private static final String KeyDefaultText1 = "DefaultText1";
    private static final String KeyDefaultText2 = "DefaultText2";
    private static final String KeyDefault1dBarcode = "Default1dBarcode";
    private static final String KeyDefault2dBarcode = "Default2dBarcode";

    // 需要用到的各个控件对象
    private Button btnConnectDevice = null;
    private Button btnPrintQuality = null;
    private Button btnPrintDensity = null;
    private Button btnPrintSpeed = null;
    private Button btnGapType = null;
    private EditText et1 = null;
    private EditText et2 = null;

    // 打印参数
    private int printQuality = -1;
    private int printDensity = -1;
    private int printSpeed = -1;
    private int gapType = -1;

    // 打印数据
    private String defaultText1 = "";
    private String defaultText2 = "";
    private String default1dBarcode = "";
    private String default2dBarcode = "";

    // 用于填充的数组及集合列表
    private String[] printQualityList = null;
    private String[] printDensityList = null;
    private String[] printSpeedList = null;
    private String[] gapTypeList = null;

    private List<IDzPrinter.PrinterAddress> pairedPrinters = new ArrayList<IDzPrinter.PrinterAddress>();

    private List<Bitmap> printBitmaps = new ArrayList<Bitmap>();
    private int[] bitmapOrientations = null;

    // 上次连接成功的设备对象
    private IDzPrinter.PrinterAddress mPrinterAddress = null;

    // 状态提示框
    private AlertDialog stateAlertDialog = null;

    /********************************************************************************************************************************************/
    // DzPrinter连接打印功能相关
    /********************************************************************************************************************************************/

    // LPAPI 打印机操作相关的回调函数。
    private final LPAPI.Callback mCallback = new LPAPI.Callback() {

        /****************************************************************************************************************************************/
        // 所有回调函数都是在打印线程中被调用，因此如果需要刷新界面，需要发送消息给界面主线程，以避免互斥等繁琐操作。
        /****************************************************************************************************************************************/

        // 打印机连接状态发生变化时被调用
        @Override
        public void onStateChange(IDzPrinter.PrinterAddress arg0, IDzPrinter.PrinterState arg1) {
            final IDzPrinter.PrinterAddress printer = arg0;
            switch (arg1) {
                case Connected:
                case Connected2:
                    // 打印机连接成功，发送通知，刷新界面提示
//                    mHandler.post(new Runnable() {
//                        @Override
//                        public void run() {
//                            onPrinterConnected(printer);
//                        }
//                    });
                    break;

                case Disconnected:
                    // 打印机连接失败、断开连接，发送通知，刷新界面提示
//                    mHandler.post(new Runnable() {
//                        @Override
//                        public void run() {
//                            onPrinterDisconnected();
//                        }
//                    });
                    break;

                default:
                    break;
            }
        }

        // 蓝牙适配器状态发生变化时被调用
        @Override
        public void onProgressInfo(IDzPrinter.ProgressInfo arg0, Object arg1) {
        }

        @Override
        public void onPrinterDiscovery(IDzPrinter.PrinterAddress arg0, IDzPrinter.PrinterInfo arg1) {
        }

        // 打印标签的进度发生变化是被调用
        @Override
        public void onPrintProgress(IDzPrinter.PrinterAddress address, Object bitmapData, IDzPrinter.PrintProgress progress, Object addiInfo) {
            switch (progress) {
                case Success:
                    // 打印标签成功，发送通知，刷新界面提示
//                    mHandler.post(new Runnable() {
//                        @Override
//                        public void run() {
//                            onPrintSuccess();
//                        }
//                    });
                    break;

                case Failed:
                    // 打印标签失败，发送通知，刷新界面提示
//                    mHandler.post(new Runnable() {
//                        @Override
//                        public void run() {
//                            onPrintFailed();
//                        }
//                    });
                    break;

                default:
                    break;
            }
        }
    };

//    private LPAPI api;
//
//    protected void onCreate() {
//
//        // 调用LPAPI对象的init方法初始化对象
//        this.api = LPAPI.Factory.createInstance(mCallback);
//
//        // 尝试连接上次成功连接的打印机
//        if (mPrinterAddress != null) {
//            if (api.openPrinterByAddress(mPrinterAddress)) {
//                // 连接打印机的请求提交成功，刷新界面提示
//        //        onPrinterConnecting(mPrinterAddress, false);
//                return;
//            }
//        }
//    }

    //**********************   End 打印相关 *************************




    /**
     * 实现扩展方法
     Native层扩展插件的方法名需要和JS Plugin Bridge里windows.plus.bridge.exec()
            或windows.plus.bridge.execSync()方法的第二个传入参数相同，否则无法调用到指定的方法。
     * @param pWebview   发起请求的webview，
     * @param array   JSONArray array JS请求传入的参数
     */
    public void PluginTestFunction(IWebview pWebview, JSONArray array){
        String CallBackID = array.optString(0);
        JSONArray newArray = new JSONArray();
        newArray.put(array.optString(1));
        newArray.put(array.optString(2));
        newArray.put(array.optString(3));
        newArray.put(array.optString(4));
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, false);

    }

    public void PluginTestFunctionArrayArgu(IWebview pWebview, JSONArray array)
    {
        String ReturnString = null;
        String CallBackID =  array.optString(0);
        JSONArray newArray = null;
        try {
            newArray = new JSONArray( array.optString(1));
            String inValue1 = newArray.getString(0);
            String inValue2 = newArray.getString(1);
            String inValue3 = newArray.getString(2);
            String inValue4 = newArray.getString(3);
            ReturnString = inValue1 + "-" + inValue2 + "-" + inValue3 + "-" + inValue4;
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        // 异步方法开发者需要调用
        JSUtil.execCallback(pWebview, CallBackID, ReturnString, JSUtil.OK, false);
    }

    public String PluginTestFunctionSyncArrayArgu(IWebview pWebview, JSONArray array)
    {
        JSONArray newArray = null;
        JSONObject retJSONObj = null;
        try {

            newArray = array.optJSONArray(0);
            String inValue1 = newArray.getString(0);
            String inValue2 = newArray.getString(1);
            String inValue3 = newArray.getString(2);
            String inValue4 = newArray.getString(3);

            retJSONObj = new JSONObject();
            retJSONObj.putOpt("RetArgu1", inValue1);
            retJSONObj.putOpt("RetArgu2", inValue2);
            retJSONObj.putOpt("RetArgu3", inValue3);
            retJSONObj.putOpt("RetArgu4", inValue4);

        } catch (JSONException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }

        return JSUtil.wrapJsVar(retJSONObj);
    }

    public String PluginTestFunctionSync(IWebview pWebview, JSONArray array){
        String inValue1 = array.optString(0);
        String inValue2 = array.optString(1);
        String inValue3 = array.optString(2);
        String inValue4 = array.optString(3);

        String ReturnValue = inValue1 + "-" + inValue2 + "-" + inValue3 + "-" + inValue4;
        // 同步执行方法：
        // 同步执行方法在返回结果时可以直接将结果以return的形式返回给js层，返回的结果需要调用
        // 处理要返回的字符串，也可调用其他方法处理其他返回值类型（参考io.dclod.util.JSUtil的返回方法）。
        return JSUtil.wrapJsVar(ReturnValue,true);
    }

}