#include <SPI.h>
// Using the ArduinoBLE library for Bluetooth communication by advertising Arduino as a discoverable peripheral
#include <ArduinoBLE.h>
#include <Arduino_LSM9DS1.h>

BLEService punchService("19b10010-e8f2-537e-4f6c-d104768a1214");

BLEByteCharacteristic punchCharacteristic("6635d693-9ad2-408e-ad48-4d8f88810dee", BLERead | BLENotify);

int POT_THRESHOLD = 50;

void setup() {
  // put your setup code here, to run once:

  Serial.println("Setup started...");

  Serial.begin(9600);
  while (!Serial);

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }


  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    //    while (1);
  } else {

    BLE.setLocalName("Punch");

    Serial.println("Local name set...");

    // set the UUID for the service this peripheral advertises:
    BLE.setAdvertisedService(punchService);

    punchService.addCharacteristic(punchCharacteristic);


    // add the service
    BLE.addService(punchService);

    Serial.println("Service added...");


    punchCharacteristic.writeValue(100);

    // start advertising
    BLE.advertise();

    Serial.println("Bluetooth device active, waiting for connections...");

  }

}

void loop() {
  // put your main code here, to run repeatedly:
  float aX, aY, aZ, gX, gY, gZ;

  // poll for BLE events
  BLE.poll();

    // check if both new acceleration and gyroscope data is
    // available
    if (IMU.accelerationAvailable() && IMU.gyroscopeAvailable()) {
      // read the acceleration and gyroscope data
      IMU.readAcceleration(aX, aY, aZ);
      IMU.readGyroscope(gX, gY, gZ);

      // print the data in CSV format
      Serial.println(aX*100, 3);

      int videoScrubState = aX*100;

        if (videoScrubValueChanged(videoScrubState)) {
//      Serial.print("Video Scrub ");
//      Serial.println(videoScrubState);
      punchCharacteristic.writeValue(videoScrubState);
  }
    }


}

boolean videoScrubValueChanged(int videoScrub) {
  return (
    (videoScrub < (punchCharacteristic.value() - POT_THRESHOLD)) ||
    (videoScrub > (punchCharacteristic.value() + POT_THRESHOLD))
  );
}
