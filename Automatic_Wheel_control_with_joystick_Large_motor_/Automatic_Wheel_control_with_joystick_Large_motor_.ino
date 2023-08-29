/* code for automatic wheel chair using irf3205 motor driver with 24V power supply
   using joystick control for mechatronics system design 2, department of mechatronics engr
   Federal University of Technology, Minna 
 */



//initiate right wheel control pin
int pwm1=3; //PWM pin
int dir1=2;

//initiate left wheel control pin
int pwm2=5; //PWM pin
int dir2=4;

//initiate joystic control pin
#define joystickVert A0
#define joystickHort A1

//initialte position
int joystickPosVert=437;
int joystickPosHort=343;

//initiate motor speed
int motorSpeed1=0;
int motorSpeed2=0;

//initiate ultrasonic sensor
int triggerPin=8;
int echoPin=9;
float duration, distance;

//initiate buzzer;
int buzzerPin=10;

//initiate LEDs
int LEDgreen=6;
int LEDred=7;
int LEDyellow1=11;
int LEDyellow2=12;

void setup() {
  // put your setup code here, to run once:
pinMode(pwm1, OUTPUT);
pinMode(dir1, OUTPUT);
pinMode(dir2, OUTPUT);
pinMode(pwm2, OUTPUT);
pinMode(LEDgreen, OUTPUT);
pinMode(LEDred, OUTPUT);
pinMode(LEDyellow1, OUTPUT);
pinMode(LEDyellow2, OUTPUT);
pinMode(triggerPin, OUTPUT);
pinMode(echoPin, INPUT);
pinMode(buzzerPin, OUTPUT);
pinMode(joystickVert, INPUT);
pinMode(joystickHort, INPUT);

//initially set to forward mode with no motion
digitalWrite(pwm1, 0);
digitalWrite(dir1, 1);
digitalWrite(dir2, 1);
digitalWrite(pwm2, 0);

Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
joystickPosVert = analogRead(joystickVert);
joystickPosHort = analogRead(joystickHort);

if(joystickPosVert < 237){    //giving it some clearance of 52(about 10%)
  // This is backward motion
  Serial.println("vert reverse: ");
  Serial.println(joystickPosVert);
  //delay(1000);
  //set right wheel to move backward
  digitalWrite(dir1, 0);
  //set left wheel to move backward
  digitalWrite(dir2, 0);  
  //turn on red LED
  digitalWrite(LEDred, HIGH);
  digitalWrite(LEDgreen, LOW);
  digitalWrite(LEDyellow1, LOW);
  digitalWrite(LEDyellow2, LOW);
  
  joystickPosVert = joystickPosVert - 237;
  joystickPosVert = joystickPosVert * -1;
  
  motorSpeed1 = map(joystickPosVert, 0, 237, 0, 200);
  motorSpeed2 = map(joystickPosVert, 0, 237, 0, 200); 
  Serial.println("Yay!!! i am reversing");
  //delay(50);
  //code for obstacle detection

  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);

  //Measure the response from the HC-SR04 Echo pin
  duration = pulseIn(echoPin, HIGH);

  //determine distance for duration
  //use 0.0343cm/s as speed of sound in air
 
  distance = (duration/2) * 0.0343; 

  //send results to serial monitor
  Serial.print("Distance =: ");
  if(distance >=400 || distance <=2){
    Serial.println("Out of range");
  } else{
    Serial.print(distance);
    Serial.println(" cm");
  }
  if(distance  <= 40){
    Serial.println("Beware, obstacle ahead!!!");
    tone(buzzerPin, 300);
    delay(400);
    noTone(buzzerPin);
    delay(400);
   }
  }
else if(joystickPosVert > 537){
  //This is forward motion
  //set right wheel to move forward
  digitalWrite(dir1, 1);
  //set left wheel to move backward
  digitalWrite(dir2, 1);

  //turn on green LED
  digitalWrite(LEDred, LOW);
  digitalWrite(LEDgreen, HIGH);
  digitalWrite(LEDyellow1, LOW);
  digitalWrite(LEDyellow2, LOW);

  motorSpeed1 = map(joystickPosVert, 537, 1023, 0, 100);
  motorSpeed2 = map(joystickPosVert, 537, 1023, 0, 100); 
  Serial.println("Yay!!! i am moving forward"); 
  Serial.println(joystickPosVert);  
  //delay(50);
  }
 else{ 
//  digitalWrite(dir1,X);
//  digitalWrite(dir2,X);
  motorSpeed1;
  motorSpeed2;
  if(motorSpeed1<0) motorSpeed1=0;
  if(motorSpeed2<0) motorSpeed2=0;
   digitalWrite(LEDred, LOW);
   digitalWrite(LEDgreen, LOW);
   digitalWrite(LEDyellow1, LOW);
   digitalWrite(LEDyellow2, LOW);
   //delay(50);
  // the wheels wont move between 460-563
  Serial.print(" I stop moving");
  } 

 //setting up the left and right movement

if(joystickPosHort < 237){
  Serial.println(joystickPosHort);
   // This is left motion
   // take reverse readings  
  joystickPosHort = joystickPosHort - 237;
  joystickPosHort = joystickPosHort * -1;

  joystickPosHort = map(joystickPosHort, 0, 237, 0, 100);

   motorSpeed1 =  motorSpeed1 - joystickPosHort;
   motorSpeed2 =  motorSpeed2 + joystickPosHort;

   //turn on yellow1 (left yellow) LED
   digitalWrite(LEDred, LOW);
   digitalWrite(LEDgreen, LOW);
   digitalWrite(LEDyellow1, HIGH);
   digitalWrite(LEDyellow2, LOW);
   

   //Don't exceed range of 0-255 for motor speeds 
   if(motorSpeed1 < 0) {
    motorSpeed1 = 0;
   }
   if(motorSpeed2 > 100) {
    motorSpeed2 = 100;
   }
   Serial.print("Yay!!! i'm moving to the left");
   //delay(50);
 }
else if(joystickPosHort > 660){
   // This is right motion
   Serial.println(joystickPosHort);
   joystickPosHort = map(joystickPosHort, 660, 1023, 0, 95);

   motorSpeed1 =  motorSpeed1 + joystickPosHort;
   motorSpeed2 =  motorSpeed2 - joystickPosHort;

   //Don't exceed range of 0-255 for motor speeds 
   if(motorSpeed1 > 100) {
    motorSpeed1 = 100;
   }
   if(motorSpeed2 < 0) {
    motorSpeed2 = 0;
   }
   //turn on yellow2 (left yellow) LED
   digitalWrite(LEDred, LOW);
   digitalWrite(LEDgreen, LOW);
   digitalWrite(LEDyellow1, LOW);
   digitalWrite(LEDyellow2, HIGH);
   //delay(50);
}

 if(joystickPosHort >= 237 && joystickPosHort <= 660 && joystickPosVert >= 237 && joystickPosVert <= 537){
   motorSpeed1;
   motorSpeed2;
   if(motorSpeed1<0) motorSpeed1=0;
   if(motorSpeed2<0) motorSpeed2=0;
}

 
    //Adjust to prevent buzzling at very low speed
if(motorSpeed1 < 8) motorSpeed1 = 0;
if(motorSpeed2 < 8) motorSpeed2 = 0;

   //set the motor speeds
analogWrite(pwm1, motorSpeed1);
analogWrite(pwm2, motorSpeed2);

} 
