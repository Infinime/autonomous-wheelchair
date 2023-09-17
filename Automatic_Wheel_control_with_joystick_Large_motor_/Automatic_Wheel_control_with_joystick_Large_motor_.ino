/* code for automatic wheel chair using irf3205 motor driver with 24V power supply
   using joystick control for mechatronics system design 2, department of mechatronics engr
   Federal University of Technology, Minna
   Course facilitated by Engr. Adeyinka A.
 */

// initiate right wheel control pin
int pwm1 = 3;  // PWM pin
int dir1 = 2;

// initiate left wheel control pin
int pwm2 = 5;  // PWM pin
int dir2 = 4;

// initiate joystick control pin
#define joystickVert A0
#define joystickHort A1

#define RXp2 0
#define TXp2 1

// initiate position
int joyY = 512;
int joyX = 512;

float speedRatio;
float speed;

// initiate vJoystick
int vjoyY = 512;
int vjoyX = 512;

// initiate motor speed
int rightMotorSpeed = 0;
int leftMotorSpeed = 0;

bool voiceControlAllowed = 0;
bool ignoreVoice = 0;

// initiate ultrasonic sensor
int triggerPin = 8;
int echoPin = 9;
float duration, distance;

// initiate buzzer;
int buzzerPin = 10;

void setup() {
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

  Serial.begin(115200, SERIAL_8N1);
}
// ---------------- Helper functions to control wheelchair ---------------------
void stopMotion() {
  rightMotorSpeed = 0;
  leftMotorSpeed = 0;
  Serial.print("Stop moving");
}

void setSpeed(float speed, float speedRatio) {
  if (speed > 0) {
    //  forward motion

    // set right wheel to move forward
    digitalWrite(dir1, 1);
    // set left wheel to move forward
    digitalWrite(dir2, 1);
    rightMotorSpeed = speedRatio * speed;
    leftMotorSpeed = (1 - speedRatio) * speed;
  } else {
    //  backward motion

    // set right wheel to move forward
    digitalWrite(dir1, 0);
    // set left wheel to move forward
    digitalWrite(dir2, 0);
    rightMotorSpeed = -speedRatio * speed;
    leftMotorSpeed = -(1 - speedRatio) * speed;

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
    if (distance >= 400 || distance <= 2) {
      Serial.println("Out of range");
    } else {
      Serial.print(distance);
      Serial.println(" cm");
    }
    if (distance <= 40) {
      tone(buzzerPin, 300);
      delay(400);
      noTone(buzzerPin);
      delay(400);
    }
  }
}


String last_esp_command = "";
int last_command_time_ms = 0;
void voiceControl(String esp_command) {
  if (esp_command.indexOf("Moving Forward") >= 0) {
    setSpeed(100, 0.5);
  }
  if (esp_command.indexOf("Moving Backward") >= 0) {
    setSpeed(-100, 0.5);
  }
  if (esp_command.indexOf("Turning Left") >= 0) {
    setSpeed(100, 0.75);
  }
  if (esp_command.indexOf("Turning Right") >= 0) {
    setSpeed(100, 0.25);
  }
  if (esp_command.indexOf("Stopping") >= 0) {
    stopMotion();
  }
  if (esp_command.indexOf("Speeding Up") >= 0) {
    leftMotorSpeed += 50;
    rightMotorSpeed += 50;
  }
  if (esp_command.indexOf("Slowing Down") >= 0) {
    leftMotorSpeed -= 50;
    rightMotorSpeed -= 50;
  }
}

void loop() {
  String esp_command = Serial.readString();
  Serial.print(esp_command);

  // put your main code here, to run repeatedly:
  joyY = analogRead(joystickVert);
  joyX = analogRead(joystickHort);

  if (joyX >= 462 && joyX <= 562 && joyY >= 462 && joyY <= 562) {
    // DMZ where no input is taken and the program can listen to the voice
    // If not voice control, stop motion
    if (not voiceControlAllowed) {
      stopMotion();
      voiceControlAllowed = 1;
    }
    // voice shit can happen now
    else {
      if (last_esp_command != esp_command) {
        last_command_time_ms = millis();
        voiceControl(esp_command);
        last_esp_command = esp_command;
      }
      else if ((last_command_time_ms+60000)>millis()>0){
        stopMotion();
      }
    }
  }

  else {
    // manual control
    voiceControlAllowed = 0;
    speed = map(joyY, 0, 1024, -200, 200);
    speedRatio = joyX / 1024;
    setSpeed(speed, speedRatio);
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
