/* code for automatic wheel chair using irf3205 motor driver with 24V power supply
   using joystick control for mechatronics system design 2, department of mechatronics engr
   Federal University of Technology, Minna
   Course facilitated by Engr. Adeyinka A.
 */
#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

// initiate right wheel control pin
int pwm1 = 3; // PWM pin
int dir1 = 2;

// initiate left wheel control pin
int pwm2 = 5; // PWM pin
int dir2 = 4;

// initiate joystick control pin
#define joystickVert A0
#define joystickHort A1

// initiate battery reading pin
#define battPin A2

// initialte position
int joyY = 512;
int joyX = 512;

// initiate vJoystick
int vjoyY = 512;
int vjoyX = 512;

// initiate motor speed
int rightMotorSpeed = 0;
int leftMotorSpeed = 0;

bool voiceControlAllowed = 0;

// initiate ultrasonic sensor
int triggerPin = 8;
int echoPin = 9;
float duration, distance;

int speedSetting = 1;

// initiate buzzer;
int buzzerPin = 10;

void setup()
{
  pinMode(pwm1, OUTPUT);
  pinMode(dir1, OUTPUT);
  pinMode(dir2, OUTPUT);
  pinMode(pwm2, OUTPUT);
  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(joystickVert, INPUT);
  pinMode(joystickHort, INPUT);

  // initially set to forward mode with no motion
  digitalWrite(pwm1, 0);
  digitalWrite(dir1, 1);
  digitalWrite(dir2, 1);
  digitalWrite(pwm2, 0);

  // initialize LCD
  lcd.begin(16, 2);
  lcd.noBlink();
  pinMode(battPin, INPUT);

  Serial.begin(9600);
}
// ---------------- Helper functions to control wheelchair ---------------------
void updateScreen(const char *message = "Ready")
{
  lcd.clear();
  int voltReading = analogRead(battPin);
  int volts = (voltReading / 1023) * 100;
  lcd.setCursor(0, 0);
  lcd.print("Battery:");
  if (volts == 100)
  {
    lcd.setCursor(12, 0);

    lcd.print(volts);
    lcd.print("%");
  }
  else if (volts < 10)
  {
    lcd.setCursor(14, 0);
    lcd.print(volts);
    lcd.print("%");
  }
  else
  {
    lcd.setCursor(13, 0);
    lcd.print(volts);
    lcd.print("%");
  }
  lcd.setCursor(0, 1);
  lcd.print(message);
}

void stopMotion()
{
  rightMotorSpeed = 0;
  leftMotorSpeed = 0;
  Serial.print("Stop moving");
  updateScreen("Ready")
}

void loop()
{
  // put your main code here, to run repeatedly:
  joyY = analogRead(joystickVert);
  joyX = analogRead(joystickHort);

  if (joyX >= 462 && joyX <= 562 && joyY >= 462 && joyY <= 562)
  {
    // DMZ where no input is taken and the program can listen to the voice
    // If not voice control, stop motion
    if (not voiceControlAllowed) {stopMotion();}
    // voice shit can happen now
    voiceControlAllowed = 1;
  }

  else
  {
    // manual control
    voiceControlAllowed = 0;
    speed = map(joyY, 0, 1024, -200, 200);
    speedRatio = joyX/1024;
    if (speed>0){
    //  forward motion

    // set right wheel to move forward
    digitalWrite(dir1, 1);
    // set left wheel to move forward
    digitalWrite(dir2, 1);
    rightMotorSpeed = speedRatio*speed;
    leftMotorSpeed = (1-speedRatio)*speed;
    updateScreen("Forwards");
    }
    else{
    //  backward motion

    // set right wheel to move forward
    digitalWrite(dir1, 0);
    // set left wheel to move forward
    digitalWrite(dir2, 0);
    rightMotorSpeed = -speedRatio*speed;
    leftMotorSpeed = -(1-speedRatio)*speed;
    updateScreen("Reverse");
  // delay(50);
  // code for obstacle detection

  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);

  // Measure the response from the HC-SR04 Echo pin
  duration = pulseIn(echoPin, HIGH);

  // determine distance for duration
  // use 0.0343cm/s as speed of sound in air

  distance = (duration / 2) * 0.0343;

  // send results to serial monitor
  Serial.print("Distance =: ");
  if (distance >= 400 || distance <= 2)
  {
    Serial.println("Out of range");
  }
  else
  {
    Serial.print(distance);
    Serial.println(" cm");
  }
  if (distance <= 40)
  {
    updateScreen("Obstacle");
    tone(buzzerPin, 300);
    delay(400);
    noTone(buzzerPin);
    delay(400);
  }
    }
  }

  // Adjust to prevent buzzling at very low speed
  if (rightMotorSpeed < 8)
    rightMotorSpeed = 0;
  if (leftMotorSpeed < 8)
    leftMotorSpeed = 0;

  // set the motor speeds
  analogWrite(pwm1, rightMotorSpeed);
  analogWrite(pwm2, leftMotorSpeed);
}
