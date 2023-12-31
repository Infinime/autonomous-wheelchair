// Load Wi-Fi library
#include <WiFi.h>

#include <WebServer.h>

#include <LiquidCrystal.h>
// #include <hd44780.h>
// #include <hd44780ioClass/hd44780_pinIO.h>


// initiate battery reading pin\


// Replace with your network credentials
const char* ssid = "Quincy";
const char* password = "etesians";

// current screen turanci
char* currentScreen = "";
// Set web server port number to 80
WebServer server(80);
String SendHTML() {
  String ptr = "<!DOCTYPE html> <html>\n";
  ptr += "<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">\n";
  ptr += "<title>LED Control</title>\n";
  ptr += "<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}\n";
  ptr += "body{margin-top: 50px;} h1 {color: #444444;margin: 50px auto 30px;} h3 {color: #444444;margin-bottom: 50px;}\n";
  ptr += ".button {display: block;width: 80px;background-color: #3498db;border: none;color: white;padding: 13px 30px;text-decoration: none;font-size: 25px;margin: 0px auto 35px;cursor: pointer;border-radius: 4px;}\n";
  ptr += ".button-on {background-color: #3498db;}\n";
  ptr += ".button-on:active {background-color: #2980b9;}\n";
  ptr += ".button-off {background-color: #34495e;}\n";
  ptr += ".button-off:active {background-color: #2c3e50;}\n";
  ptr += "p {font-size: 14px;color: #888;margin-bottom: 10px;}\n";
  ptr += "</style>\n";
  ptr += "</head>\n";
  ptr += "<body>\n";
  ptr += "<h1>ESP32 Web Server</h1>\n";
  ptr += "<h3>Using Station(STA) Mode</h3>\n";

  ptr += "HELLO WORLD";
  ptr += "</body>\n";
  ptr += "</html>\n";
  return ptr;
}

LiquidCrystal lcd(19, 23, 18, 17, 16, 15);

void updateScreen(char* message = "Ready") {
  if (message != currentScreen) {
    lcd.clear();
    int voltReading = analogRead(34);  // pin 34 is battery
    int volts = map(voltReading, 676, 1023, 0, 100);
    lcd.setCursor(0, 0);
    lcd.print("Battery:");
    if (volts == 100) {
      lcd.setCursor(12, 0);

      lcd.print(volts);
      lcd.print("%");
    } else if (volts < 10) {
      lcd.setCursor(14, 0);
      lcd.print(volts);
      lcd.print("%");
    } else {
      lcd.setCursor(13, 0);
      lcd.print(volts);
      lcd.print("%");
    }
    lcd.setCursor(0, 1);
    lcd.print(message);
    currentScreen = message;
  }
}

void handle_OnConnect() {
  Serial.println("HomePage");

  updateScreen("Ready");
  server.send(200, "text/html", SendHTML());
}
void moveForward() {
  Serial.println("Moving Forward");
  updateScreen("Forwards");
  server.send(200, "text/html", SendHTML());
}
void moveBackward() {
  Serial.println("Moving Backward");
  updateScreen("Reverse");
  server.send(200, "text/html", SendHTML());
}
void turnLeft() {
  Serial.println("Turning Left");
  updateScreen("Left");
  server.send(200, "text/html", SendHTML());
}
void turnRight() {
  Serial.println("Turning Right");
  updateScreen("Right");
  server.send(200, "text/html", SendHTML());
}
void stop() {
  Serial.println("Stopping");

  updateScreen("Ready");
  server.send(200, "text/html", SendHTML());
}
void speedUp() {
  Serial.println("Speeding Up");
  updateScreen("Speed Up");
  server.send(200, "text/html", SendHTML());
}
void slowDown() {
  Serial.println("Slowing Down");
  updateScreen("Slow Down");
  server.send(200, "text/html", SendHTML());
}
void handle_NotFound() {
  server.send(404, "text/plain", "Not found");
}

void setup() {
  Serial.begin(115200);
  delay(100);

  // initialize LCD
  lcd.noBlink();
  lcd.begin(16, 2);
  // pinMode(battPin, INPUT);

  // Connect to Wi-Fi network with SSID and password
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // WiFi.config(IPAddress(192,168,1,10), IPAddress(192,168,1,1), IPAddress(255,255,255,0), IPAddress(192,168,1,1), IPAddress(192,168,1,1));

  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/", HTTP_GET, handle_OnConnect);
  server.on("/m/f", HTTP_GET, moveForward);
  server.on("/m/b", HTTP_GET, moveBackward);
  server.on("/t/l", HTTP_GET, turnLeft);
  server.on("/t/r", HTTP_GET, turnRight);
  server.on("/stop", HTTP_GET, stop);
  server.on("/s/u", HTTP_GET, speedUp);
  server.on("/s/d", HTTP_GET, slowDown);
  server.onNotFound(handle_NotFound);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}
