int prevState = 0;
int bState = 0;
int ledState = 0;
int bPin = 2;
int led1 = 9;
int led2 = 10;
int led3 = 11;

void setup() {
  // put your setup code here, to run once:
  pinMode(led1,OUTPUT);
  pinMode(led2,OUTPUT);
  pinMode(led3,OUTPUT);
  pinMode(bPin, INPUT);
  Serial.begin(9600);
}

void setColor(int red,int green,int blue)
{
  analogWrite(led1,red);
  analogWrite(led2,green);
  analogWrite(led3,blue);
}

void changeColor(){
   ledState++;
   int i,j;
   int cIndex = ledState % 3;
   Serial.println(cIndex);
   switch (cIndex) {
      case 0:
         setColor(255,0,0);
      break;
      case 1:
         //先暗后明
         for(i=255;i>=0;i--){
           setColor(i,0,0);
           delay(4);
         }
         for(i=0;i<256;i++){
           setColor(0,i,0);
           delay(4);
         }
      break;
      case 2:
         //渐变
         for(i=0;i<256;i++){
           setColor(0,255-i,i);
           delay(4);
         }
      break;
   }
}

void loop() {
  bState = digitalRead(bPin);
  if(bState != prevState && bState == HIGH){
     Serial.println("should change color");
     changeColor();
  }
  prevState = bState;
  delay(50);
}
