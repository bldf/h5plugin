package com.rfid.trans;

import android.util.Log;

public class MyCallback implements TagCallback{
    public void tagCallback(ReadTag tag){
        Log.i("ttt",tag.epcId) ;
    }
    public int tagCallbackFailed(int reason){
        Log.i("ttssst",reason+"错误") ;
        return 0;
    }
}
