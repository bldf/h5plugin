package com.example;
//***** Begin 安卓配合ＭＵＩ的 Native插件必须的４个包　******************
import io.dcloud.common.DHInterface.AbsMgr;
import io.dcloud.common.DHInterface.IFeature;
import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.util.JSUtil;
//***** 安卓配合ＭＵＩ的 Native插件必须的４个包　 End******************
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.os.Build;


public class PGPlugintest implements IFeature
{
    @Override
    public void init(AbsMgr arg0, String arg1) {
        // TODO Auto-generated method stub

    }
    /**
     * 实现接口类的“excute”方法
     excute方法负责接收由html页面发起的扩展插件调用请求，并负责根据传入参数运行执行对应的业务。
     “execute”方法的“action”参数传入的是JS类的方法名，类型为String。开发者需要在方法中通过字符串匹配来处理请求的逻辑。
              “pArgs”参数为字符串列表对象，如JS层调用的方法有传入参数，会通过该参数传递到Native的方法中，方法的传入顺序和JS层传入顺序一致。
     开发者在实现同步和异步接口运行结果返回时调用的API是不同的
     * @param pWebview
     * @param action
     * @param pArgs
     * @return
     */
    @SuppressWarnings("deprecation")
    @TargetApi(Build.VERSION_CODES.CUPCAKE)
    @SuppressLint("NewApi")
    @Override
    public String execute(final IWebview pWebview, final String action, final String[] pArgs) {
        // TODO Auto-generated method stub
        //Context context = pWebview.getContext();

        if ("PluginTestFunction".equals(action))
        {
            String CallBackID = pArgs[0];
            JSONArray newArray = new JSONArray();
            newArray.put(pArgs[1]);
            newArray.put(pArgs[2]);
            newArray.put(pArgs[3]);
            newArray.put(pArgs[4]);

            JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, false);
        }
        else if("PluginTestFunctionArrayArgu".equals(action))
        {
            String ReturnString = null;
            String CallBackID =  pArgs[0];
            JSONArray newArray = null;
            try {

                newArray = new JSONArray(pArgs[1]);
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
            //JSUtil.execCallback(pWebview, cbId, (which==AlertDialog.BUTTON_POSITIVE)?"ok":"cancel", JSUtil.OK, false, false);
            JSUtil.execCallback(pWebview, CallBackID, ReturnString, JSUtil.OK, false);

        }else if("PluginTestFunctionSync".equals(action))
        {
            // 同步执行方法：
            // 同步执行方法在返回结果时可以直接将结果以return的形式返回给js层，返回的结果需要调用
            // 处理要返回的字符串，也可调用其他方法处理其他返回值类型（参考io.dclod.util.JSUtil的返回方法）。
            String inValue1 = pArgs[0];
            String inValue2 = pArgs[1];
            String inValue3 = pArgs[2];
            String inValue4 = pArgs[3];

            String ReturnValue = inValue1 + "-" + inValue2 + "-" + inValue3 + "-" + inValue4;
            return JSUtil.wrapJsVar(ReturnValue,true);

        }else if("PluginTestFunctionSyncArrayArgu".equals(action))
        {
            JSONArray newArray = null;
            JSONObject retJSONObj = null;
            try {
                newArray = new JSONArray(pArgs[0]);
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
        return null;
    }

    @Override
    public void dispose(String arg0) {
        // TODO Auto-generated method stub

    }
}