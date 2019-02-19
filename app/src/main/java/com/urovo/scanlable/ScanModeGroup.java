package com.urovo.scanlable;

import android.app.ActivityGroup;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;

public class ScanModeGroup extends ActivityGroup {

	public ActivityGroup group;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		group = this;
	}
	
	@Override
	public void onBackPressed() {
		// TODO Auto-generated method stub
		group.getLocalActivityManager().getCurrentActivity().onBackPressed(); 
	}
	
	@Override  
    protected void onStart() {  
        super.onStart();  
        /*Intent intent = new Intent(this, ScanMode.class);  
        intent.putExtra(MainActivity.EXTRA_MODE, getIntent().getStringExtra(MainActivity.EXTRA_MODE));
        Window w = group.getLocalActivityManager().startActivity(  
                "FirstActivity", intent);  
        View view = w.getDecorView();  
        group.setContentView(view);  */
    }
}
