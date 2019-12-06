#include <SPI.h>
// Using the ArduinoBLE library for Bluetooth communication by advertising Arduino as a discoverable peripheral
#include <ArduinoBLE.h>
#include <Arduino_LSM9DS1.h>

BLEService punchService("19b10010-e8f2-537e-4f6c-d104768a1214");

BLEByteCharacteristic punchCharacteristic("6635d693-9ad2-408e-ad48-4d8f88810dee", BLERead | BLENotify);

int THRESHOLD = 1.2;


void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);
  Serial.println("Setup started...");


  //  while (!Serial);

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
  float aSum;

  // poll for BLE events
  BLE.poll();

  // check if both new acceleration and gyroscope data is
  // available

  //  while (samplesRead < numSamples) {
  if (IMU.accelerationAvailable() && IMU.gyroscopeAvailable()) {
    // read the acceleration and gyroscope data
    IMU.readAcceleration(aX, aY, aZ);
    IMU.readGyroscope(gX, gY, gZ);

    // print the data in CSV format
    //      Serial.println(aX, 3);

    aSum = fabs(aX) + fabs(aY) + fabs(aZ);

//    int accVal = (int) aSum;

    

    //      if (valueChanged(accVal)) {
    //        punchCharacteristic.writeValue(accVal);
    //      }

//    if (millis() % 100 == 0) {
      
      Serial.println(aSum);
      if (aSum > 1.6) {
        punchCharacteristic.writeValue(0);
      } else if (aSum <= 1.6) {
        punchCharacteristic.writeValue(1);
      }

//    }
//  }

    }


}

boolean valueChanged(int videoScrub) {
  return (
           (videoScrub < (punchCharacteristic.value() - THRESHOLD)) ||
           (videoScrub > (punchCharacteristic.value() + THRESHOLD))
         );
}
