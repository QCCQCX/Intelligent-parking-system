#include <aJSON.h>
#include <Servo.h>
Servo myservo;
Servo myservo1;
//=============  此处必须修改============
String DEVICEID = "29045"; // 你的设备ID=======
String APIKEY = "fa54aa522"; // 设备密码==
String INPUTID1 = "25584"; //1
String INPUTID2 = "25585";//2
String INPUTID3 = "25586";//3
String INPUTID4 = "25587";//4

//=======================================
const int Trig1 = 2;                                           // 设定SR04连接的Arduino引脚
const int Echo1 = 3; 
double distance1,time1 ; 
const int Trig2 = 4;                                           // 设定SR04连接的Arduino引脚
const int Echo2 = 5; 
double distance2,time2 ; 
const int Trig3 = 6;                                           // 设定SR04连接的Arduino引脚
const int Echo3 = 7; 
double distance3,time3 ;
const int Trig4 = 8;                                           // 设定SR04连接的Arduino引脚
const int Echo4 = 9; 
double distance4,time4 ;


unsigned long lastCheckStatusTime = 0; //记录上次报到时间
unsigned long lastCheckInTime = 0; //记录上次报到时间
unsigned long lastUpdateTime = 0;//记录上次上传数据时间
const unsigned long postingInterval = 40000; // 每隔40秒向服务器报到一次
const unsigned long updateInterval = 5000; // 数据上传间隔时间5秒
unsigned long checkoutTime = 0;//登出时间


void setup() {
  pinMode(Trig1, OUTPUT); 
  pinMode(Echo1, INPUT);
  pinMode(Trig2, OUTPUT); 
  pinMode(Echo2, INPUT);
  pinMode(Trig3, OUTPUT); 
  pinMode(Echo3, INPUT);
  pinMode(Trig4, OUTPUT); 
  pinMode(Echo4, INPUT);
  
  myservo.attach(10);
  myservo1.attach(11);
  myservo1.write(90);  
  
  Serial.begin(115200);
  delay(5000);//等一会儿ESP8266
}
void loop() {
  //每一定时间查询一次设备在线状态，同时替代心跳
  if (millis() - lastCheckStatusTime > postingInterval) {
    checkStatus();
  }
  //checkout 50ms 后 checkin
  if ( checkoutTime != 0 && millis() - checkoutTime > 50 ) {
    checkIn();
    checkoutTime = 0;
  }
  //每隔一定时间上传一次数据
  if (millis() - lastUpdateTime > updateInterval) {
    digitalWrite(Trig1, LOW);                                 
    delayMicroseconds(2);                                   
    digitalWrite(Trig1, HIGH);                               
    delayMicroseconds(10);                                  //产生一个10us的高脉冲去触发SR04
    digitalWrite(Trig1, LOW);                                
    time1 = pulseIn(Echo1, HIGH);                              // 检测脉冲宽度，注意返回值是微秒us
    distance1 = time1 /58 ;                                  //计算出距离,输出的距离的单位是厘米cm
    
    digitalWrite(Trig2, LOW);                                 
    delayMicroseconds(2);                                   
    digitalWrite(Trig2, HIGH);                               
    delayMicroseconds(10);                                  //产生一个10us的高脉冲去触发SR04
    digitalWrite(Trig2, LOW);                                
    time2 = pulseIn(Echo2, HIGH);                              // 检测脉冲宽度，注意返回值是微秒us
    distance2 = time2 /58 ;                                  //计算出距离,输出的距离的单位是厘米cm
    
    digitalWrite(Trig3, LOW);                                 
    delayMicroseconds(2);                                   
    digitalWrite(Trig3, HIGH);                               
    delayMicroseconds(10);                                  //产生一个10us的高脉冲去触发SR04
    digitalWrite(Trig3, LOW);                                
    time3 = pulseIn(Echo3, HIGH);                              // 检测脉冲宽度，注意返回值是微秒us
    distance3 = time3 /58 ;

    digitalWrite(Trig4, LOW);                                 
    delayMicroseconds(2);                                   
    digitalWrite(Trig4, HIGH);                               
    delayMicroseconds(10);                                  //产生一个10us的高脉冲去触发SR04
    digitalWrite(Trig4, LOW);                                
    time4 = pulseIn(Echo4, HIGH);                              // 检测脉冲宽度，注意返回值是微秒us
    distance4 = time4 /58 ;     

    
    int val1;//定义变量
    int val2;//定义变量
    int val3;//定义变量
    int val4;//定义变量
    
    if(distance1 < 4)
    {
      val1=1;
     }
    if(distance1 > 5)
    {
      val1=0;
     }
     if(distance2 < 4)
    {
      val2=1;
     }
    if(distance2 > 5)
    {
      val2=0;
     }
     if(distance3 < 4)
    {
      val3=1;
     }
    if(distance3 >5)
    {
      val3=0;
     }
    if(distance4 < 4)
    {
      val4=1;
     }
    if(distance4 > 5)
    {
      val4=0;
     }
    update3(DEVICEID, INPUTID1, val1, INPUTID2, val2, INPUTID3, val3, INPUTID4, val4);
    lastUpdateTime = millis();
  }
  //读取串口信息
  while (Serial.available()) {
    String inputString = Serial.readStringUntil('\n');
    //检测json数据是否完整
    int jsonBeginAt = inputString.indexOf("{");
    int jsonEndAt = inputString.lastIndexOf("}");
    if (jsonBeginAt != -1 && jsonEndAt != -1) {
      //净化json数据
      inputString = inputString.substring(jsonBeginAt, jsonEndAt + 1);
      int len = inputString.length() + 1;
      char jsonString[len];
      inputString.toCharArray(jsonString, len);
      aJsonObject *msg = aJson.parse(jsonString);
      processMessage(msg);
      aJson.deleteItem(msg);
    }
  }
}
//设备登录
//{"M":"checkin","ID":"xx1","K":"xx2"}\n
void checkIn() {
  Serial.print("{\"M\":\"checkin\",\"ID\":\"");
  Serial.print(DEVICEID);
  Serial.print("\",\"K\":\"");
  Serial.print(APIKEY);
  Serial.print("\"}\n");
}
//强制设备下线，用消除设备掉线延时
//{"M":"checkout","ID":"xx1","K":"xx2"}\n
void checkOut() {
  Serial.print("{\"M\":\"checkout\",\"ID\":\"");
  Serial.print(DEVICEID);
  Serial.print("\",\"K\":\"");
  Serial.print(APIKEY);
  Serial.print("\"}\n");
}

//查询设备在线状态
//{"M":"status"}\n
void checkStatus() {
  Serial.print("{\"M\":\"status\"}\n");
  lastCheckStatusTime = millis();
}

//处理来自ESP8266透传的数据
void processMessage(aJsonObject *msg) {
  aJsonObject* method = aJson.getObjectItem(msg, "M");
  aJsonObject* content = aJson.getObjectItem(msg, "C");
  aJsonObject* client_id = aJson.getObjectItem(msg, "ID");
  if (!method) {
    return;
  }
  String M = method->valuestring;
  String C = content->valuestring;
  String F_C_ID = client_id->valuestring;
  if (M == "WELCOME TO BIGIOT")
  {
    checkOut();
    checkoutTime = millis();
    return;
  }
  if (M == "connected") {
    checkIn();
  }
  if (M == "say")
  {
    if (C == "A")
    {
      myservo.write(0);              // 舵机角度写入
      delay(5);                       // 等待转动到指定角度
      delay(5000);
      myservo.write(90);              // 舵机角度写入
      delay(5);                       // 等待转动到指定角度
    }
    if (C == "B")
    {
      myservo1.write(0);              // 舵机角度写入
      delay(5);                       // 等待转动到指定角度
    }
    if (C == "C")
    {
      myservo1.write(90);              // 舵机角度写入
      delay(5);                       // 等待转动到指定角度
    }
  }
}
void sayToClient(String client_id, String content) {
  Serial.print("{\"M\":\"say\",\"ID\":\"");
  Serial.print(client_id);
  Serial.print("\",\"C\":\"");
  Serial.print(content);
  Serial.print("\"}\r\n");
  lastCheckInTime = millis();
}
void update3(String did, String inputid1, int value1, String inputid2, int value2, String inputid3, int value3,String inputid4, int value4) {
  Serial.print("{\"M\":\"update\",\"ID\":\"");
  Serial.print(did);
  Serial.print("\",\"V\":{\"");

  Serial.print(inputid1);
  Serial.print("\":\"");
  Serial.print(value1);
  Serial.print("\",\"");

  Serial.print(inputid2);
  Serial.print("\":\"");
  Serial.print(value2);
  Serial.print("\",\"");

  Serial.print(inputid3);
  Serial.print("\":\"");
  Serial.print(value3);
  Serial.print("\",\"");

  
  Serial.print(inputid4);
  Serial.print("\":\"");
  Serial.print(value4);
  Serial.println("\"}}");
}
