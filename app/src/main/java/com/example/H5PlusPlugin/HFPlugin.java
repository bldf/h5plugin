package com.example.H5PlusPlugin;
import android.media.SoundPool;
import android.util.Log;

import org.json.JSONArray;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

import com.rfid.trans.ReadTag;
import com.rfid.trans.TagCallback;
import com.rfid.trans.UHFLib;
import com.rfid.trans.MyCallback;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

public class HFPlugin extends StandardFeature {
    public static UHFLib rrlib = new UHFLib();
    private Timer timer;
    long beginTime =0;
    private boolean isCanceled = true;
    private static final int SCAN_INTERVAL = 5;
    private static final int MSG_UPDATE_LISTVIEW = 0;
    private static final int MSG_UPDATE_TIME = 1;
    public static List<InventoryTagMap> lsTagList = new ArrayList<InventoryTagMap>();
    public Map<String, Integer> dtIndexMap =new LinkedHashMap<String, Integer>();
    private List<InventoryTagMap> data;
    /**
     * 打开ifid
     * @param pWebview
     * @param array
     */
    public void openIFID(IWebview pWebview, JSONArray array){
        String CallBackID = array.optString(0);
        JSONArray newArray = new JSONArray();
        boolean re = false ;
        int ires = rrlib.Connect("/dev/ttyMT0",57600) ;
        if (ires == 0) {
            re = true ;
        }
        newArray.put(re);
        // 异步开发需要调用
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
    }
    /**
     * 打开ifid
     * @param pWebview
     * @param array
     */
    public void writeIFID(IWebview pWebview, JSONArray array){
        String CallBackID = array.optString(0);
        String wdata = array.optString(1);
        JSONArray newArray = new JSONArray();
        boolean re = false ;
        byte[]Password = {0,0,0,0};
        byte WordPtr = 0 ;
        byte Mem = 3 ;
        int ires = rrlib.WriteDataByEPC("E20000195518021325701363",Mem,WordPtr,Password,wdata);
//        int ires = rrlib.Connect("/dev/ttyMT0",57600) ;
        if ((ires+"").length() !=2) {
            re = true ;
        }
        newArray.put(re);
        // 异步开发需要调用
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
    }

    /**
     * 打开ifid
     * @param pWebview
     * @param array
     */
    public void readeIFID(IWebview pWebview, JSONArray array){
        String CallBackID = array.optString(0);
        JSONArray newArray = new JSONArray();
        byte[]Password = {0,0,0,0};
        byte WordPtr = 0 ;
        byte Mem = 3 ;
        byte Num = 6 ;
        String re =  rrlib.ReadDataByEPC("E20000195518021325701363",Mem,WordPtr,Num,Password);

        newArray.put(re);
        // 异步开发需要调用
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
    }

    /**
     * 关闭ifid
     * @param pWebview
     * @param array
     */
    public void closeIFID(IWebview pWebview, JSONArray array){
        String CallBackID = array.optString(0);
        JSONArray newArray = new JSONArray();
        boolean re = false ;
        int ires = rrlib.DisConnect();
        if (ires == 0) {
            re = true ;
        }
        newArray.put(re);
        // 异步开发需要调用
        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
    }

    /**
     * 读取ifid
     * @param pWebview
     * @param array
     */
    public void getIFID(IWebview pWebview, JSONArray array){
        String CallBackID = array.optString(0);
        JSONArray newArray = new JSONArray();
        String str = "";
//        rrlib.ReadDataByTID("E200001955180213257013",0,)
//        test();
        redIFID(pWebview, CallBackID) ;
        newArray.put(str);
        // 异步开发需要调用
//        JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
    }
    public static class InventoryTagMap  {
        public String strEPC;
        public int antenna;
        public String strRSSI;
        public int nReadCount;
    }

    public void redIFID(IWebview pWebview, String CallBackID){
        MsgCallback callback = new MsgCallback(pWebview,CallBackID);
        rrlib.SetCallBack(callback);
        rrlib.StartRead();
    }

    private void cancelScan(){
        rrlib.StopRead();
//        isCanceled = true;
//        if(timer != null){
//            timer.cancel();
//            timer = null;
////            scan.setText(getString(R.string.btscan));
//        }
    }
    public class MsgCallback implements TagCallback {
        public IWebview pWebview;
        public String CallBackID ;
        public  MsgCallback(IWebview pWebview, String CallBackID){
            this.CallBackID = CallBackID ;
            this.pWebview = pWebview ;
        }
        @Override
        public void tagCallback(ReadTag arg0) {
            // TODO Auto-generated method stub
            rrlib.beginSound(true);
            rrlib.playSound();
            String epc = arg0.epcId.toUpperCase();
            Log.i("sdsflkdkjlkjksdfdsd",epc) ;
            JSONArray newArray = new JSONArray();
            newArray.put(epc);
            JSUtil.execCallback(pWebview, CallBackID, newArray, JSUtil.OK, true);
            cancelScan();
//            InventoryTagMap m;
//            rrlib.beginSound(true);
//            Integer findIndex = dtIndexMap.get(epc);
//            if (findIndex == null) {
//                dtIndexMap.put(epc,dtIndexMap.size());
//                m = new InventoryTagMap();
//                m.strEPC = epc;
//                m.antenna = arg0.antId;
//                Log.i("asdf",arg0.antId+"") ;
//                m.strRSSI = String.valueOf(arg0.rssi);
//                m.nReadCount =1;
//                //dtIndexMa
//                lsTagList.add(m);
//            }
//            else
//            {
//                m= lsTagList.get(findIndex);
//                m.antenna |= arg0.antId;
//                m.nReadCount++;
//                m.strRSSI = String.valueOf(arg0.rssi);
//            }
//            mHandler.removeMessages(MSG_UPDATE_LISTVIEW);
//            mHandler.sendEmptyMessage(MSG_UPDATE_LISTVIEW);
        }

        @Override
        public int tagCallbackFailed(int reason) {
            // TODO Auto-generated method stub
            return 0;
        }};


}
