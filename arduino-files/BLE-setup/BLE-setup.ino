#include <SPI.h>
// Using the ArduinoBLE library for Bluetooth communication by advertising Arduino as a discoverable peripheral
#include <ArduinoBLE.h>

BLEService punchService("19b10010-e8f2-537e-4f6c-d104768a1214");

BLEByteCharacteristic videoScrubCharacteristic("6635d693-9ad2-408e-ad48-4d8f88810dee", BLERead | BLENotify);
//BLEDescriptor videoScrubDescriptor("2901", "Video Scrub");
BLEByteCharacteristic audioScrubCharacteristic("099af204-5811-4a15-8ffb-4f127ffdfcd7", BLERead | BLENotify);
//BLEDescriptor audioScrubDescriptor("2901", "Volume");

const int videoScrubPin = A3;   // to scrub the video based on the chain position on the apron
const int audioScrubPin = A4;   // to control the audio of the iOS device.



void setup() {
  // put your setup code here, to run once:

  Serial.println("Setup started...");

    pinMode(videoScrubPin, INPUT); // use the slide potentiometer as a input
  pinMode(audioScrubPin, INPUT); // use the slide potentiometer as a input

    // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    //    while (1);
  } else {

    BLE.setLocalName("Punch Rev");

    Serial.println("Local name set...");

  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(punchService);

  punchService.addCharacteristic(videoScrubCharacteristic);
//  videoScrubCharacteristic.addDescriptor(videoScrubDescriptor);
  punchService.addCharacteristic(audioScrubCharacteristic);
//  audioScrubCharacteristic.addDescriptor(audioScrubDescriptor);


  // add the service
  BLE.addService(punchService);

  Serial.println("Service added...");


  videoScrubCharacteristic.writeValue(100);
  audioScrubCharacteristic.writeValue(99);

    // start advertising
  BLE.advertise();

  Serial.println("Bluetooth device active, waiting for connections...");

  }

}

void loop() {
  // put your main code here, to run repeatedly:

  // poll for BLE events
  BLE.poll();

}
