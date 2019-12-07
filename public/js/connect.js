let serviceUuid = "19b10010-e8f2-537e-4f6c-d104768a1214";
let punchCharacteristic;
let punchValue = 0;
let punchBLE;

function setup() {
  noCanvas();
  punchBLE = new p5ble();
  console.log('Setup complete');
  document.getElementById('button').addEventListener('click', connectToPunch);
}

async function connectToPunch() {
  await console.log('Connecting to UUID');
  await punchBLE.connect(serviceUuid, gotCharacteristics);
}

 function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
   console.log('Connected to Punch');
   console.log('characteristics: ', characteristics);
   punchCharacteristic =  characteristics[0];

   punchBLE.read(punchCharacteristic, punchVal);
}

async function punchVal(error, value) {
  if (error) console.error('error: ', error);
   await console.log('Value Notification: ', value);
   punchValue =  await value;
  // setInterval(function() {
   punchBLE.startNotifications(punchCharacteristic, handleNotifications);
   punchBLE.read(punchCharacteristic, punchVal);
  // }, 2000);
}

function handleNotifications(data) {
  // setInterval(function() {
    console.log('Data Notification: ', data);
    punchValue = data;
  // }, 2000);
  // console.log('Data Notification: ', data);
  // punchValue = data;
}
