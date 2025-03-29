#include <ESP8266WiFi.h>  
#include <ESP8266WebServer.h>

#define PWM_CONTROL_PIN 14 // D5 -> enable pin
#define MOTOR_INA 12 // D6 -> motor input a 
// motor input b ground
#define DRIVER_POWER 13     // D7

const char* SSID = "Pixel_7413";     
const char* PASSWORD = "1234567899";  

ESP8266WebServer server(80);

// not done

// // Static IP Configuration  
// IPAddress local_IP(10, 203, 229, 100);
// IPAddress gateway(10, 203, 229, 200);
// IPAddress subnet(255, 255, 255, 0);

void setFanSpeed(int speed) {
    analogWrite(PWM_CONTROL_PIN, speed);
    digitalWrite(MOTOR_INA, HIGH); 
}

void handleRoot() {
    Serial.println("root");
    server.send(200, "text/html",
        "<h1>ESP8266 Motor Speed Control</h1>"
        "<p><a href='/low'>Low</a></p>"
        "<p><a href='/mid'>Mid</a></p>"
        "<p><a href='/high'>High</a></p>"
        "<p><a href='/stop'>Stop</a></p>");
}

void handleLow() {
    Serial.println("low");
    setFanSpeed(100);
    server.send(200, "text/plain", "Speed: LOW");
}

void handleMid() {
    Serial.println("mid");
    setFanSpeed(175);
    server.send(200, "text/plain", "Speed: MID");
}

void handleHigh() {
    Serial.println("high");
    setFanSpeed(255);
    server.send(200, "text/plain", "Speed: HIGH");
}



void handleStop() {
    Serial.println("stop");
    setFanSpeed(0);
    server.send(200, "text/plain", "Motor Stopped");
}


void setup() {
    Serial.begin(115200);
    WiFi.persistent(false);   // Avoid storing WiFi credentials in flash
    WiFi.mode(WIFI_STA);      // Set WiFi to station mode
    WiFi.setAutoReconnect(true); // Enable automatic reconnection
    WiFi.begin(SSID, PASSWORD);

    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\n✅ Connected to WiFi!");
    Serial.print("📶 IP Address: ");
    Serial.println(WiFi.localIP());

    pinMode(PWM_CONTROL_PIN, OUTPUT);
    pinMode(MOTOR_INA, OUTPUT);
    pinMode(DRIVER_POWER, OUTPUT);
    digitalWrite(DRIVER_POWER, HIGH); // Enable motor power

    server.on("/", handleRoot);
    server.on("/low", handleLow);
    server.on("/mid", handleMid);
    server.on("/high", handleHigh);
    server.on("/stop", handleStop);

    server.begin();
}

void loop() {
  server.handleClient();  
}

