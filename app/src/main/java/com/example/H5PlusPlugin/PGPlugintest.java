package com.example.H5PlusPlugin;
/**
 * 创建插件类
 创建一个继承自StandardFeature的类，实现第三方插件扩展。
 创建插件类需要引入的包
 import io.dcloud.DHInterface.IWebview;
 import io.dcloud.DHInterface.StandardFeature;
 import io.dcloud.util.JSUtil;
 */
import android.bluetooth.BluetoothAdapter;
import android.graphics.Bitmap;
import android.os.Bundle;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.dothantech.lpapi.LPAPI;
import com.dothantech.printer.IDzPrinter;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
public class PGPlugintest extends StandardFeature {
    private static  JSONArray INITPARAMS = null;
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

    /********************************************************************************************************************************************/
    // ***************  Begin 提供页面js调用的api*********************************
    /********************************************************************************************************************************************/

    // 判断当前打印机是否连接
    public void isPrinterConnected(IWebview pWebview, JSONArray array) {
        String CallBackID = array.optString(0);
        JSONArray newArray = new JSONArray();
        // 调用LPAPI对象的getPrinterState方法获取当前打印机的连接状态
        IDzPrinter.PrinterState state = api.getPrinterState();
        // 打印机未连接
        if (state == null || state.equals(IDzPrinter.PrinterState.Disconnected)) {
            newArray.put(false);
        }
        // 打印机正在连接
        if (state.equals(IDzPrinter.PrinterState.Connecting)) {
            newArray.put(false);
        }
        newArray.put(true);
        // 异步开发需要调用
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
    }

    /**
     * 同步方式打开 同步方式打开 同步方式打开 指定 名称 或型号的打印机 或型号的打印机 或型号的打印机
     * *****使用注意
     * ***** 确保打印机已经打开，并进行了配对操作。
     * @param pWebview
     * @param array
     */
    public void sdOpenPrinterSync(IWebview pWebview, JSONArray array){
        String CallBackID = array.optString(0);
        JSONArray newArray = new JSONArray();
           // api.reopenPrinter() ;
         Boolean re =    api.openPrinterSync(array.optString(1));
        newArray.put(re);
        // 异步开发需要调用
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
    }

    /**
     * 打印标签
     * @param pWebview
     * @param array
     */
    public void printLabel(IWebview pWebview, JSONArray array){
        String CallBackID = array.optString(0);
        JSONArray newArray = new JSONArray();
//        Boolean re= print2dBarcode(array.optString(1), getPrintParam(1, 0));
        Boolean re= printContent(getPrintParam(1, 0),array);
        newArray.put(re);
        // 异步开发需要调用
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
    }



    /**
     * 初始化传递标签打印参数
     * @param pWebview
     * @param array
     */
    public void initParam(IWebview pWebview, JSONArray array){
        String CallBackID = array.optString(0);
        JSONArray newArray = new JSONArray();
        INITPARAMS = array ;
        newArray.put(true);
        // 异步开发需要调用
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
    }

    /**
     * 链接打印机
     * @param pWebview
     * @param array
     */
    public  void JoinPrinterAddress(IWebview pWebview, JSONArray array){
        String CallBackID = array.optString(0);
        JSONArray newArray = new JSONArray();
        pairedPrinters = api.getAllPrinterAddresses(null);// 在链接打印机的时候获取所有的已链接的打印机
        IDzPrinter.PrinterAddress printer = pairedPrinters.get( array.optInt(1));
        if (api.openPrinterByAddress(printer)) {//如果链接打印机成功
            newArray.put(true);
        }else{
            newArray.put(false);
        }
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
    }

    /**
     * 获取所有已配对的蓝牙
     * @return
     */
    public String PluginTestFunctionSyncArrayArgus(IWebview pWebview, JSONArray array)
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
    public String allddresses(IWebview pWebview, JSONArray array)
    {
        JSONObject retJSONObj = null;
        pairedPrinters = api.getAllPrinterAddresses(null);// 在链接打印机的时候获取所有的已链接的打印机
        try {
            retJSONObj = new JSONObject();
            Iterator<IDzPrinter.PrinterAddress> it =  pairedPrinters.iterator() ;
            while (it.hasNext()){
                IDzPrinter.PrinterAddress re =   it.next() ;
                retJSONObj.putOpt(re.shownName,re.macAddress) ;
            }
        } catch (JSONException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }

        return JSUtil.wrapJsVar(retJSONObj);
    }


    /************* Begin 测试 接口 *******************/

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
        // 异步开发需要调用
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);

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
    /************* 测试 接口  End *******************/
    /********************************************************************************************************************************************/
    // *************** 提供页面js调用的api  End *********************************
    /********************************************************************************************************************************************/








    /**
     * 渲染param，标签内容，内部调用。打印页面传递过来的内容，contentArray 必须和初始化保存的参数一样
     * @param param
     * @param contentArray
     * @return
     */
    private boolean printContent(Bundle param,JSONArray contentArray) {
        // 开始绘图任务，传入参数(页面宽度, 页面高度)
        api.startJob(50, 80, 0);
        for( int a = 1;a<INITPARAMS.length();a++){
            JSONObject obj =null;
            try{
                String st = INITPARAMS.optString(a) ;
                obj = new JSONObject(st) ;
            }catch (JSONException e){

            }
            if(obj==null){
                continue;
            }
            String str = (String) obj.opt("type");
            switch (str){
                case "text":// 如果是打印文本
                    /*
                        text 需要绘制的文本字符串。
                        x绘制的文本框左上角水平位置（单位毫米）。
                        y绘制的文本框左上角垂直位置（单位毫米）。
                        width绘制的文本框水平宽度（单位毫米）。如果 width 为 0，则会根据绘制文本的显示宽度，根据当前对齐方式进行以 x 为基准点的左中右对齐。
                        默认值为0。
                        height绘制的文本框垂直高度（单位毫米）。如果height为 0，则会根据绘制文本的显示高度，根据当前对齐方式进行以 y 为基准点的上中下对齐。
                        默认值为0。
                        fontHeight文字大小（单位毫米）。
                     */
                    api.drawText(contentArray.optString(a),
                            obj.optDouble("x"),
                            obj.optDouble("y"),
                            obj.optDouble("width"),
                            obj.optDouble("height"),
                            obj.optDouble("fontHeight"));
                    break;
                case "barCode"://如果是打印二维码
                    /**
                     *text 需要绘制的QrCode二维码的内容。
                     * x 绘制的QrCode二维码的左上角水平位置（单位毫米）。
                     * y 绘制的QrCode二维码的左上角垂直位置（单位毫米）。
                     * width 绘制的QrCode二维码的水平宽度（单位毫米）。
                     */
                    api.draw2DQRCode(contentArray.optString(a),
                            obj.optDouble("x"),
                            obj.optDouble("y"),
                            obj.optDouble("width"));
                    break;
                case "code"://如果是打印条码
                    /**
                     * text:需要绘制的一维条码的内容
                     * type  一维条码的编码类型（BarcodeType)，默认值为AUTO。默认20
                     * x 绘制的一维条码的左上角水平位置（单位毫米）
                     * y 绘制的一维条码的左上角垂直位置（单位毫米）。
                     * width: 一维条码的整体显示宽度
                     * height:一维条码的显示高度（包括供人识读文本）。
                     * textHeight 供人识读文本的高度（单位毫米），建议为3毫米。
                     */
                    api.draw1DBarcode(contentArray.optString(a),
                            obj.optInt("codeType"),
                            obj.optDouble("x"),
                            obj.optDouble("y"),
                            obj.optDouble("width"),
                            obj.optDouble("height"),
                            obj.optDouble("textHeight"));
                    break;
            }
        }
        // 结束绘图任务提交打印
        return api.commitJob();
    }



    /**
     * 获取打印时需要的打印参数
     * @param copies
     * @param orientation
     * @return
     */
    private Bundle getPrintParam(int copies, int orientation) {
        Bundle param = new Bundle();
        // 打印浓度
        if (printDensity >= 0) {
            param.putInt(IDzPrinter.PrintParamName.PRINT_DENSITY, printDensity);
        }
        // 打印速度
        if (printSpeed >= 0) {
            param.putInt(IDzPrinter.PrintParamName.PRINT_SPEED, printSpeed);
        }
        // 间隔类型
        if (gapType >= 0) {
            param.putInt(IDzPrinter.PrintParamName.GAP_TYPE, gapType);
        }
        // 打印页面旋转角度
        if (orientation != 0) {
            param.putInt(IDzPrinter.PrintParamName.PRINT_DIRECTION, orientation);
        }
        // 打印份数
        if (copies > 1) {
            param.putInt(IDzPrinter.PrintParamName.PRINT_COPIES, copies);
        }
        return param;
    }

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

    private LPAPI api = LPAPI.Factory.createInstance(mCallback);
//

    protected void onDestroy() {
        // 应用退出时，调用LPAPI对象的quit方法断开打印机连接
        api.quit();
        // 应用退出时需要的操作
//        fini();
    }
}