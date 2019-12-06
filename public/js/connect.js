const SERVICE_UUID = "19b10010-e8f2-537e-4f6c-d104768a1214";
let punchCharacteristic;
let punchValue = 0;
let punchBLE;

function setup() {
  noCanvas();
  punchBLE = new p5ble();
  console.log('Setup complete');
  document.getElementById('button').addEventListener('click', connectToPunch);
}

function connectToPunch() {
  console.log('Connecting to UUID');
  punchBLE.connect(SERVICE_UUID, gotCharacteristics);
}

function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log('characteristics: ', characteristics);
  punchCharacteristic = characteristics[0];

  punchBLE.read(punchCharacteristic, punchVal);
}

function punchVal(error, value) {
  if (error) console.log('error: ', error);
  console.log('Value Notification: ', value);
  punchValue = value;
  setInterval(function() {
    punchBLE.startNotifications(punchCharacteristic, handleNotifications);
  }, 2000);
}

function handleNotifications(data) {
  setInterval(function() {
    console.log('Data Notification: ', data);
    punchValue = data;
  }, 2000);
  // console.log('Data Notification: ', data);
  // punchValue = data;
}
