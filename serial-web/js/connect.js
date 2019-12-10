var serial;
var portName = '/dev/tty.usbmodem14201';
var inData, canvas;
var jab_value, cross_value, hook_value, uppercut_value;
let jab_count = 0;
let cross_count = 0;
let hook_count = 0;
let uppercut_count = 0;
let data_array = [];
let jab_target = 10;
let hook_target = 5;
let uppercut_target = 7;
let action_music;
let gif;
let time_remaining = 90;

function preload() {
 action_music = loadSound('./audio/blue-monday.mp3');
}

function setup() {
  console.log("action_music loaded");
  for (var i = 0; i < 21; i++) data_array[i] = 'pav';

  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event

  // canvas = createCanvas(windowWidth / 2, windowHeight);
  // canvas.position(windowWidth / 2, 0);
  canvas = createCanvas(windowWidth, 200);
  canvas.position(0, windowHeight- 250);
  // serial.on('connected', serverConnected); // callback for connecting to the server
  // serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  // serial.on('close', portClose);
  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port

  togglePlaying();
  // setTimeout(togglePlaying, 300);
  gif = document.getElementById('boxing-gif')
  gif.src = 'https://media.giphy.com/media/26tPrcX6EfSj5N0HK/giphy.gif';
}


function togglePlaying() {
 if (!action_music.isPlaying()) {
   // action_music.play();
   action_music.loop();
 }

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
  data_array.splice(0, 1);

  let previous_gesture = 'oobla';


  if (outputGesture21 == 'jab') {
    setTimeout(function() {
      jab_count = jab_count + 1 / 20;
      document.getElementById('punch-type').style.textDecorationColor = "#f50057";
      gif.src = 'https://media.giphy.com/media/iIpfUUTOdEdqf2lzlc/giphy.gif';
    }, 100)
  } else if (outputGesture21 == 'cross') {
    setTimeout(function() {
      cross_count = cross_count + 1 / 20;
    }, 100);
  } else if (outputGesture21 == 'hook') {
    setTimeout(function() {
      hook_count = hook_count + 1 / 20;
      gif.src = 'https://media.giphy.com/media/l41lIUvOqOtlGjpwQ/giphy.gif';
    document.getElementById('punch-type').style.textDecorationColor = "#00c853";
    }, 100);
  } else if (outputGesture21 == 'uppercut') {
    setTimeout(function() {
      uppercut_count = uppercut_count + 1 / 20;
      gif.src = 'https://media.giphy.com/media/64MtWNuafNhZk62sXF/giphy.gif';
document.getElementById('punch-type').style.textDecorationColor = "#3d5afe";
    }, 100);
  }

  previous_gesture = outputGesture21;


  // console.log("I think this was a: " + outputGesture21);
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
  background(0);
  noStroke();
  textSize(20);
  textFont('Poppins');

  let jab_width = map(jab_count, 0, jab_target, 10, 320);
  let hook_width = map(hook_count, 0, hook_target, 10, 320);
  let uppercut_width = map(uppercut_count, 0, uppercut_target, 10, 320);

  if(jab_width > 320){
    jab_width = 320;
  }

  if(hook_width > 320){
    hook_width = 320;
  }

  if(uppercut_width > 320){
    uppercut_width = 320;
  }

  // Jab data
  fill(255);
  text("Jabs thrown: " + floor(jab_count) + " / " + jab_target, 20, 64);
  fill(120, 80);
  rect(20, 84, 320, 40, 2);
  fill(245,0,87);
  rect(20, 84, jab_width, 40, 2);

  // Hook Data
  fill(255);
  text("Hooks thrown: " + floor(hook_count) + " / " + hook_target, 420,64);
  fill(120, 80);
  rect(420, 84, 320, 40, 2);
  fill(0,200,83);
  rect(420, 84, hook_width, 40, 2);

  // Uppercut data
  fill(255);
  text("Uppercuts thrown: " + floor(uppercut_count) + " / " + uppercut_target, 820, 64);
  fill(120, 80);
  rect(820, 84, 320, 40, 2);
  fill(61,90,254);
  rect(820, 84, uppercut_width, 40, 2);

  //Timer
  let mapped_time = map(time_remaining, 90, 0, width - 40, 0);
  fill(255, 220);
  textSize(16);
  text("Time remaining " + time_remaining , 20, 180);
  fill(255, 196, 0);
  rect(20, 190, mapped_time, 10, 2);

  if( frameCount % 60 === 0 && time_remaining > 0){
    time_remaining--;
  }



  // if(jab_count > 0 || hook_count > 0 || uppercut_count > 0){
  //   togglePlaying();
  // }

  if (jab_count >= 10 && hook_count >= 5 && uppercut_count >= 7){
    fill(255);
    text("Congratulations, now wait for Atharva to program more levels", width/2, 150);
  }
  if (time_remaining == 0){
    fill(255);
    text("Oops times up. Better luck next time", 20, 150);
  }
}

function serialError() {
  console.error("Something went wrong");
  // alert('Serial communication broken, initiate debug protocol');
}
