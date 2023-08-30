# 1 "C:\\Users\\Ebun\\source\\repos\\autonomous-wheelchair\\Automatic_Wheel_control_with_joystick_Large_motor_\\Automatic_Wheel_control_with_joystick_Large_motor_.ino"
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



//initialte position
int joystickPosVert=437;
int joystickPosHor=343;

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
pinMode(pwm1, 0x1);
pinMode(dir1, 0x1);
pinMode(dir2, 0x1);
pinMode(pwm2, 0x1);
pinMode(LEDgreen, 0x1);
pinMode(LEDred, 0x1);
pinMode(LEDyellow1, 0x1);
pinMode(LEDyellow2, 0x1);
pinMode(triggerPin, 0x1);
pinMode(echoPin, 0x0);
pinMode(buzzerPin, 0x1);
pinMode(A0, 0x0);
pinMode(A1, 0x0);

//initially set to forward mode with no motion
digitalWrite(pwm1, 0);
digitalWrite(dir1, 1);
digitalWrite(dir2, 1);
digitalWrite(pwm2, 0);

Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
joystickPosVert = analogRead(A0);
joystickPosHor = analogRead(A1);

if(joystickPosVert < 237){ //giving it some clearance of 52(about 10%)
  // This is backward motion
  Serial.println("vert reverse: ");
  Serial.println(joystickPosVert);
  //delay(1000);
  //set right wheel to move backward
  digitalWrite(dir1, 0);
  //set left wheel to move backward
  digitalWrite(dir2, 0);
  //turn on red LED
  digitalWrite(LEDred, 0x1);
  digitalWrite(LEDgreen, 0x0);
  digitalWrite(LEDyellow1, 0x0);
  digitalWrite(LEDyellow2, 0x0);

  joystickPosVert = joystickPosVert - 237;
  joystickPosVert = joystickPosVert * -1;

  motorSpeed1 = map(joystickPosVert, 0, 237, 0, 200);
  motorSpeed2 = map(joystickPosVert, 0, 237, 0, 200);
  Serial.println("Yay!!! i am reversing");
  //delay(50);
  //code for obstacle detection

  digitalWrite(triggerPin, 0x0);
  delayMicroseconds(2);
  digitalWrite(triggerPin, 0x1);
  delayMicroseconds(10);
  digitalWrite(triggerPin, 0x0);

  //Measure the response from the HC-SR04 Echo pin
  duration = pulseIn(echoPin, 0x1);

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
  if(distance <= 40){
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
  digitalWrite(LEDred, 0x0);
  digitalWrite(LEDgreen, 0x1);
  digitalWrite(LEDyellow1, 0x0);
  digitalWrite(LEDyellow2, 0x0);

  motorSpeed1 = map(joystickPosVert, 537, 1023, 0, 100);
  motorSpeed2 = map(joystickPosVert, 537, 1023, 0, 100);
  Serial.println("Yay!!! i am moving forward");
  Serial.println(joystickPosVert);
  //delay(50);
  }
 else{
//  digitalWrite(dir1,X);
//  digitalWrite(dir2,X);
  motorSpeed1--; // @remind @test
  motorSpeed2--; // @remind @test
  motorSpeed1 = ((motorSpeed1)>(0)?(motorSpeed1):(0));
  motorSpeed2 = ((motorSpeed2)>(0)?(motorSpeed2):(0));
   digitalWrite(LEDred, 0x0);
   digitalWrite(LEDgreen, 0x0);
   digitalWrite(LEDyellow1, 0x0);
   digitalWrite(LEDyellow2, 0x0);
   //delay(50);
  // the wheels wont move between 460-563
  Serial.print(" I stop moving");
  }

 //setting up the left and right movement

if(joystickPosHor < 237){
  Serial.println(joystickPosHor);
   // This is left motion
   // take reverse readings  
  joystickPosHor = joystickPosHor - 237;
  joystickPosHor = joystickPosHor * -1;

  joystickPosHor = map(joystickPosHor, 0, 237, 0, 100);

   motorSpeed1 = motorSpeed1 - joystickPosHor;
   motorSpeed2 = motorSpeed2 + joystickPosHor;

   //turn on yellow1 (left yellow) LED
   digitalWrite(LEDred, 0x0);
   digitalWrite(LEDgreen, 0x0);
   digitalWrite(LEDyellow1, 0x1);
   digitalWrite(LEDyellow2, 0x0);


   //Don't exceed range of 0-255 for motor speeds 

   motorSpeed1 = ((motorSpeed1)>(0)?(motorSpeed1):(0));
   motorSpeed2 = ((motorSpeed2)<(100)?(motorSpeed2):(100));

   Serial.print("Yay!!! i'm moving to the left");
   //delay(50);
 }
else if(joystickPosHor > 660){
   // This is right motion
   Serial.println(joystickPosHor);
   joystickPosHor = map(joystickPosHor, 660, 1023, 0, 95);

   motorSpeed1 = motorSpeed1 + joystickPosHor;
   motorSpeed2 = motorSpeed2 - joystickPosHor;

   //Don't exceed range of 0-255 for motor speeds 

   motorSpeed1 = ((motorSpeed1)<(100)?(motorSpeed1):(100));

    motorSpeed2 = ((motorSpeed2)>(0)?(motorSpeed2):(0));
   //turn on yellow2 (left yellow) LED
   digitalWrite(LEDred, 0x0);
   digitalWrite(LEDgreen, 0x0);
   digitalWrite(LEDyellow1, 0x0);
   digitalWrite(LEDyellow2, 0x1);
   //delay(50);
}

 if(joystickPosHor >= 237 && joystickPosHor <= 660 && joystickPosVert >= 237 && joystickPosVert <= 537){
   motorSpeed1--;// @remind
   motorSpeed2--;// @remind
   motorSpeed1 = ((motorSpeed1)>(0)?(motorSpeed1):(0));
   motorSpeed2 = ((motorSpeed2)>(0)?(motorSpeed2):(0));
}

    //Adjust to prevent buzzling at very low speed
if(motorSpeed1 < 8) motorSpeed1 = 0;
if(motorSpeed2 < 8) motorSpeed2 = 0;

   //set the motor speeds
analogWrite(pwm1, motorSpeed1);
analogWrite(pwm2, motorSpeed2);

}
