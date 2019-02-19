package com.urovo.scanlable;

import android.content.Context;
import android.widget.EditText;
import android.widget.Toast;

public class Util {
	
	public static boolean showWarning(Context context, int resRes){
		Toast.makeText(context, resRes, Toast.LENGTH_LONG).show();
		return false;
	}
	
	public static boolean isEtEmpty(EditText editText){
		String str = editText.getText().toString();
		return str==null||str.equals("");
	}
	
	public static boolean isLenLegal(EditText editText){
		if(isEtEmpty(editText))return false;
		String str = editText.getText().toString();
		return str!=null && str.length() % 2 == 0;
	}
	
	public static boolean isEtsLegal(EditText[] ets){
		for(EditText et:ets){
			if (isLenLegal(et)) return true;
		}
		return false;
	}
	
	 public static boolean isHexNumber(String str) {
	        boolean flag = false;
	        for (int i = 0; i < str.length(); i++) {
	            char cc = str.charAt(i);
	            if (cc == '0' || cc == '1' || cc == '2' || cc == '3' || cc == '4'
	                    || cc == '5' || cc == '6' || cc == '7' || cc == '8'
	                    || cc == '9' || cc == 'A' || cc == 'B' || cc == 'C'
	                    || cc == 'D' || cc == 'E' || cc == 'F' || cc == 'a'
	                    || cc == 'b' || cc == 'c' || cc == 'c' || cc == 'd'
	                    || cc == 'e' || cc == 'f') {
	                flag = true;
	            }
	            else
	            {
	            	flag=false; break;
	            }
	        }
	        return flag;
	    }
}
