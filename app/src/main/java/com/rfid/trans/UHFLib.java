package com.rfid.trans;

import android.media.SoundPool;
import android.os.SystemClock;


public class UHFLib{
	private BaseReader reader = new BaseReader();
	private ReaderParameter param = new ReaderParameter();
	private volatile boolean mWorking = true; 
	private volatile Thread mThread=null;
	private volatile boolean soundworking = true;
	private volatile boolean isSound = false;
	private volatile Thread sThread=null;
	private byte[]pOUcharIDList=new byte[25600];
	private volatile int NoCardCOunt=0;
	private Integer soundid=null;
	private SoundPool soundPool=null;
	public UHFLib()
	{
		param.ComAddr =(byte)255;
		param.ScanTime =2000;
		param.Session = 0;
		param.QValue = 4;
		param.TidLen = 0;
		param.TidPtr =0;
		param.Antenna =0x80;
	}
    public void beginSound(boolean sound)
    {
        isSound =sound;
    }
    public void setsoundid(int id,SoundPool soundPool)
	{
		soundid =id;
		this.soundPool = soundPool;
	}

	public  void playSound() {
		 if((soundid==null)||(soundPool==null))return;
		try {
			soundPool.play(soundid, 1, // 左声道音量
					1, // 右声道音量
					1, // 优先级，0为最低
					0, // 循环次数，0无不循环，-1无永远循环
					1 // 回放速度 ，该值在0.5-2.0之间，1为正常速度
			);
			//SystemClock.sleep(50);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public int Connect(String ComPort, int BaudRate)
	{
		playSound();
		int result = reader.Connect(ComPort, BaudRate, 1);
		if(result ==0)
		{
			SystemClock.sleep(1000);
			byte[] Version=new byte[2];
			byte[] Power=new byte[1];
			byte[] band = new byte[1];
			byte[] MaxFre= new byte[1];
			byte[] MinFre = new byte[1];
			byte[] BeepEn = new byte[1];
			byte[] Ant =new byte[1];
			result = GetUHFInformation(Version,Power,band,MaxFre,MinFre,BeepEn,Ant);
			if(result!=0)
			{
				reader.DisConnect();
			}
			isSound=false;
			soundworking=true;
			sThread  = new Thread(new Runnable() {
				@Override
				public void run() {
					while(soundworking)
					{
						if(isSound)
						{
							playSound();
							SystemClock.sleep(50);
						}
					}
				}
			});
			sThread.start();
		}
		return result;
	}
	
	public int DisConnect()
	{
		try{
			isSound=false;
			soundworking=false;
			sThread =null;
		}catch(Exception ex)
		{}
		return reader.DisConnect();
	}
	
	public void SetInventoryPatameter(ReaderParameter param)
	{
		this.param = param;
	}
	
	public ReaderParameter GetInventoryPatameter()
	{
		return this.param;
	}
	
	public int GetUHFInformation(byte Version[],byte Power[],byte band[],byte MaxFre[],byte MinFre[],byte BeepEn[],byte Ant[])
	{
		byte[]ReaderType=new byte[1];
		byte[]TrType=new byte[1];
		byte[]ScanTime=new byte[1];
		byte[]OutputRep=new byte[1];
		byte[]CheckAnt=new byte[1];
		byte[]ComAddr =new byte[1];
		ComAddr[0]=(byte)255;
		int result = reader.GetReaderInformation(ComAddr, Version, ReaderType, TrType, band, MaxFre, MinFre, Power, ScanTime, Ant, BeepEn, OutputRep, CheckAnt);
		if(result==0)
		{
			param.ComAddr = ComAddr[0];
			param.Antenna = Ant[0];
		}
		return result;
	}
	
	public int SetRfPower(int Power)
	{
		return reader.SetRfPower(param.ComAddr, (byte)Power);
	}
	
	public int SetRegion(int band,int maxfre,int minfre)
	{
		return reader.SetRegion(param.ComAddr, band, maxfre, minfre);
	}
	
	public int SetAntenna(byte AntCfg)
	{
		byte SetOnce=1;
		byte AntCfg1=0;
		int result= reader.SetAntennaMultiplexing(param.ComAddr, SetOnce, AntCfg1, AntCfg);
		if(result==0)
		{
			param.Antenna =AntCfg;
		}
		return result;
	}
	
	public int SetBeepNotification(int BeepEn)
	{
		return reader.SetBeepNotification(param.ComAddr, (byte)BeepEn);
	}
	
	public String ReadDataByEPC(String EPCStr, byte Mem, byte WordPtr, byte Num, byte Password[])
	{
		if(EPCStr.length() % 4 !=0) return "FF";
		byte ENum = (byte)(EPCStr.length()/4);
		byte[] EPC = reader.hexStringToBytes(EPCStr);
		byte MaskMem =0;
		byte[]MaskAdr=new byte[2];
		byte MaskLen=0;
		byte[]MaskData=new byte[12];
		byte MaskFlag=0;
		byte[]Data=new byte[Num*2];
		byte[]Errorcode=new byte[1];
		int result = reader.ReadData_G2(param.ComAddr, ENum, EPC, Mem, WordPtr, Num, Password, MaskMem, MaskAdr, MaskLen, MaskData, MaskFlag, Data, Errorcode);
		if(result==0)
		{
			return reader.bytesToHexString(Data, 0, Data.length);
		}
		else
		{
			return String.format("%2X", result);
		}
	}
	
	public String ReadDataByTID(String TIDStr, byte Mem, byte WordPtr, byte Num, byte Password[])
	{
		if(TIDStr.length() % 4 !=0) return "FF";
		byte ENum = (byte)255;
		byte[] EPC = new byte[12];
		byte[]TID = reader.hexStringToBytes(TIDStr);
		byte MaskMem =2;
		byte[]MaskAdr=new byte[2];
		MaskAdr[0]=MaskAdr[1]=0;
		byte MaskLen=(byte)(TIDStr.length()*4);
		byte[]MaskData=new byte[TIDStr.length()];
		System.arraycopy(TID, 0, MaskData, 0, TID.length);
		byte MaskFlag=1;
		byte[]Data=new byte[Num*2];
		byte[]Errorcode=new byte[1];
		int result = reader.ReadData_G2(param.ComAddr, ENum, EPC, Mem, WordPtr, Num, Password, MaskMem, MaskAdr, MaskLen, MaskData, MaskFlag, Data, Errorcode);
		if(result==0)
		{
			return reader.bytesToHexString(Data, 0, Data.length);
		}
		else
		{
			return String.format("%2X", result);
		}
	}
	
	public int WriteDataByEPC(String EPCStr, byte Mem, byte WordPtr, byte Password[], String wdata)
	{
		if(EPCStr.length() % 4 !=0) return 255;
		if(wdata.length() % 4 !=0) return 255;
		byte ENum = (byte)(EPCStr.length()/4);
		byte WNum = (byte)(wdata.length()/4);
		byte[] EPC = reader.hexStringToBytes(EPCStr);
		byte[] data = reader.hexStringToBytes(wdata); 
		byte MaskMem =0;
		byte[]MaskAdr=new byte[2];
		byte MaskLen=0;
		byte[]MaskData=new byte[12];
		byte MaskFlag=0;
		byte[]Errorcode=new byte[1];
		return reader.WriteData_G2(param.ComAddr, WNum, ENum, EPC, Mem, WordPtr, data, Password, MaskMem, MaskAdr, MaskLen, MaskData, MaskFlag, Errorcode);
	}
	
	public int WriteDataByTID(String TIDStr, byte Mem, byte WordPtr, byte Password[], String wdata)
	{
		if(TIDStr.length() % 4 !=0) return 255;
		if(wdata.length() % 4 !=0) return 255;
		byte ENum = (byte)255;
		byte WNum = (byte)(wdata.length()/4);
		byte[] EPC = new byte[12];
		byte[] data = reader.hexStringToBytes(wdata); 
		byte[]TID = reader.hexStringToBytes(TIDStr);
		
		byte MaskMem =2;
		byte[]MaskAdr=new byte[2];
		MaskAdr[0]=MaskAdr[1]=0;
		byte MaskLen=(byte)(TIDStr.length()*4);
		byte[]MaskData=new byte[TIDStr.length()];
		System.arraycopy(TID, 0, MaskData, 0, TID.length);
		byte MaskFlag=1;
		byte[]Errorcode=new byte[1];
		return reader.WriteData_G2(param.ComAddr, WNum, ENum, EPC, Mem, WordPtr, data, Password, MaskMem, MaskAdr, MaskLen, MaskData, MaskFlag, Errorcode);
	}
	
	public int WriteEPCByTID(String TIDStr, String EPCStr, byte Password[])
	{
		if(TIDStr.length() % 4 !=0) return 255;
		if(EPCStr.length() % 4 !=0) return 255;
		byte ENum = (byte)255;
		byte WNum = (byte)(EPCStr.length()/4);
		byte[] EPC = new byte[12];
		String PCStr="";
		switch(WNum)
		{
		case 1:
			PCStr="0800"; break;
		case 2:
			PCStr="1000"; break;
		case 3:
			PCStr="1800"; break;
		case 4:
			PCStr="2000"; break;
		case 5:
			PCStr="2800"; break;
		case 6:
			PCStr="3000"; break;
		case 7:
			PCStr="3800"; break;
		case 8:
			PCStr="4000"; break;
		case 9:
			PCStr="4800"; break;
		case 10:
			PCStr="5000"; break;
		case 11:
			PCStr="5800"; break;
		case 12:
			PCStr="6000"; break;
		case 13:
			PCStr="6800"; break;
		case 14:
			PCStr="7000"; break;
		case 15:
			PCStr="7800"; break;
		case 16:
			PCStr="8000"; break;
		}
		String wdata=PCStr +EPCStr;
		byte[] data = reader.hexStringToBytes(wdata); 
		byte[]TID = reader.hexStringToBytes(TIDStr);
		
		byte MaskMem =2;
		byte[]MaskAdr=new byte[2];
		MaskAdr[0]=MaskAdr[1]=0;
		byte MaskLen=(byte)(TIDStr.length()*4);
		byte[]MaskData=new byte[TIDStr.length()];
		System.arraycopy(TID, 0, MaskData, 0,TID.length);
		byte MaskFlag=1;
		byte[]Errorcode=new byte[1];
		byte Mem=1;
		byte WordPtr=1;
		return reader.WriteData_G2(param.ComAddr, WNum, ENum, EPC, Mem, WordPtr, data, Password, MaskMem, MaskAdr, MaskLen, MaskData, MaskFlag, Errorcode);
	}
	
	public int Lock(String EPCStr, byte select, byte setprotect, String PasswordStr)
	{
		if(EPCStr.length() % 4 !=0) return 255;
		if(PasswordStr.length() !=8) return 255;
		byte ENum = (byte)(EPCStr.length()/4);
		byte[] EPC = reader.hexStringToBytes(EPCStr);
		byte[] Password = reader.hexStringToBytes(PasswordStr);
		byte[]Errorcode=new byte[1];
		return reader.Lock_G2(param.ComAddr, ENum, EPC, select, setprotect, Password, Errorcode);
	}
	
	public int Kill(String EPCStr, String PasswordStr)
	{
		if(EPCStr.length() % 4 !=0) return 255;
		if(PasswordStr.length() !=8) return 255;
		byte ENum = (byte)(EPCStr.length()/4);
		byte[] EPC = reader.hexStringToBytes(EPCStr);
		byte[] Password = reader.hexStringToBytes(PasswordStr);
		byte[]Errorcode=new byte[1];
		return reader.Kill_G2(param.ComAddr, ENum, EPC, Password, Errorcode);
	}
	
	public void SetCallBack(TagCallback callback)
    {
		reader.SetCallBack(callback);
    }
	
	public void StartRead()
	{
		if(mThread==null)
		{

			mWorking=true;
			mThread = new Thread(new Runnable() {
	        @Override
	        public void run() {  
	        	byte Target=0;
	            while(mWorking)
	            {
					byte Ant=(byte)0x80;
					int[]pOUcharTagNum=new int[1];
					int[]pListLen=new int[1];
					pOUcharTagNum[0]=pListLen[0]=0;
					if((param.Session==0)||(param.Session==1))
					{Target=0;NoCardCOunt=0;}
					int result = reader.Inventory_G2(param.ComAddr, (byte)param.QValue, (byte)param.Session, (byte)param.TidPtr, (byte)param.TidLen, Target, Ant, (byte)10, pOUcharIDList, pOUcharTagNum, pListLen);
					if(pOUcharTagNum[0]==0)
					{
                        isSound=false;
						if(param.Session>1)
						{
							NoCardCOunt++;
							if(NoCardCOunt>7)
							{
								Target=(byte)(1-Target);
								NoCardCOunt=0;
							}
						}
					}
					else
					{
						NoCardCOunt=0;
						isSound=true;
					}
	            }
				isSound=false;
	        }
	        });
			mThread.start();
		}
	}
	
	public void StopRead()
	{
		if(mThread!=null)
		{
			isSound=false;
			mWorking=false;
			mThread=null;
		}
	}
}

