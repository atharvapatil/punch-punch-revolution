var serial; // variable to hold an instance of the serialport library
var portName = '/dev/tty.usbmodem14101'; // fill in your serial port name here
var inData;
var jab_value, cross_value, hook_value, uppercut_value;
let jab_count = 0;
let cross_count = 0;
let hook_count = 0;
let uppercut_count = 0;
let jab_old = 0;
let cross_old = 0;
let hook_old = 0;
let uppercut_old = 0;
let data_array = [];


function setup() {
  // noCanvas();
  for (var i = 0; i < 21; i++) data_array[i] = 'pav';

  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event

  createCanvas(400, 400);
  // serial.on('connected', serverConnected); // callback for connecting to the server
  // serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  // serial.on('close', portClose);      // callback for the port closing
  //
  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}

function serialEvent() {
  // inData = Number(serial.read());
  var inString = serial.readStringUntil('\r\n');


  if (inString.length > 0) {
    var sensors = split(inString, ','); // split the string on the commas
    if (sensors.length > 3) { // if there are three elements
      jab_value = sensors[0];
      cross_value = sensors[1];
      hook_value = sensors[2];
      uppercut_value = sensors[3];
    }
  }

  let outputGesture = largestNumber(jab_value, cross_value, hook_value, uppercut_value);

  data_array.push(outputGesture);

  let outputGesture21 = data_array[20];
  document.getElementById('punch-type').textContent = outputGesture21;
  data_array.splice(0,1);

  let previous_gesture = 'oobla';


  if (outputGesture21 == 'jab'){
    setTimeout(function(){ jab_count = jab_count + 1/20;}, 100)
  } else if (outputGesture21 == 'cross'){
    setTimeout(function(){ cross_count = cross_count + 1/20;}, 100);
  } else if (outputGesture21 == 'hook'){
    setTimeout(function(){ hook_count = hook_count + 1/20; }, 100);
  } else if(outputGesture21 == 'uppercut'){
    setTimeout(function(){ uppercut_count = uppercut_count + 1/20;}, 100);
  }

  previous_gesture = outputGesture21;


  console.log("I think this was a: " + outputGesture21);
  // document.getElementById('punch-type').textContent = outputGesture21;
  // console.log("jab_value: " + jab_value);
  // console.log("cross_value: " + cross_value);
  // console.log("hook_value: " + hook_value);
  // console.log("uppercut_value: " + uppercut_value);

}

function largestNumber(num1, num2, num3, num4) {

  let jab = 'jab';
  let cross = 'cross';
  let hook = 'hook';
  let uppercut = 'uppercut';

  if (num1 > num2 && num1 > num3 && num1 > num4) {
    return jab
  } else if (num2 > num1 && num2 > num3 && num2 > num4) {
    return cross
  } else if (num3 > num1 && num3 > num2 && num3 > num4) {
    return hook
  } else if (num4 > num1 && num4 > num2 && num4 > num3) {
    return uppercut
  }
}

function draw() {
  background(255);
  fill(0);
  textSize(24);
  text("Jab count: " + floor(jab_count), 30, 30);
  text("Cross count: " + floor(cross_count), 30, 80);
  text("Hook count: " + floor(hook_count), 30, 130);
  text("Uppercut count: " + floor(uppercut_count), 30, 180);
}

function serialError(){
  console.error("Something went wrong");
  alert('Serial communication broken, initiate debug protocol');
}
