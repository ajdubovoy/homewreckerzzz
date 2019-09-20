var socket = io();
var numUsers = 0;
var currRoom = [];
var limit = 0;
var fundamental = 220;
var clickFreq = 4000;
// stored amps of each section of the piece (sines, clicks, rand)
var past = [0.001, 0.001, 0.001];
var ratios = [[1, 1],  [81, 80], [33, 32], [21, 20], [16, 15], [12, 11], 
[11, 10], [10, 9], [9, 8], [8, 7], [7, 6], [32, 27], [6, 5], [11, 9], [5, 4], 
[14, 11], [9, 7], [21, 16], [4, 3], [27, 20], [11, 8], [7, 5], [10, 7], 
[16, 11], [40, 27], [3, 2], [32, 21], [14, 9], [11, 7], [8, 5], [18, 11], 
[5, 3], [27, 16], [12, 7], [7, 4], [16, 9], [9, 5], [20, 11], [11, 6], [15, 8],
[40, 21], [64, 33], [160, 81], [2, 1]];
var limits = {
    3: [0, 25, 18, 43],
    5: [14, 12, 29, 31],
    7: [34, 21, 10, 33, 22, 9],
    11: [28, 6, 13, 20, 15, 5, 30, 23, 37]
};
var bell = [
    1,
    1.183,
    1.506,
    2,
    2.514,
    2.662,
    3.011,
    4.166,
    5.433,
    6.796,
    8.215
];
var normal = [
    1,
    1.2,
    1.50,
    2,
    2.5,
    2.667,
    3.0,
    4.0,
    5.333,
    6.667,
    8.0
];
var degree = 0.0;
var harmonics = [3,5,7,11];
var intervals = [505, 410, 333, 255];
var clickFreqs = [2000, 2500, 3000, 3200];
var colors = ["red", "#00B2FF", "#00FF00", "#FFD900"];
var color = "red";
var init = false;
var ready = false;
var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

var context= null, usingWebAudio = true;
//need this block of code to unlock web audio on iphones
try {
  if (typeof AudioContext !== 'undefined') {
      context = new AudioContext();
  } else if (typeof webkitAudioContext !== 'undefined') {
      context = new webkitAudioContext();
  } else {
      usingWebAudio = false;
  }
} catch(e) {
    usingWebAudio = false;
}

// context state at this time is `undefined` in iOS8 Safari
// basically coaxes iphone into activating web audio with a touch listener...
if (usingWebAudio && context.state === 'suspended') {
  var resume = function () {
    context.resume();

    setTimeout(function () {
      if (context.state === 'running') {
        document.body.removeEventListener('touchstart', resume, false);
      }
    }, 0);
  };

  document.body.addEventListener('touchstart', resume, false);
}
var compressor = 0;
var osc = new Array(3);
var osc2 = 0;
var sines = 0;
var rand = 0;
var clicks = 0;
var shift = 0;
var date = new Date();
var delay = date.getTime() % 1000;
var interval = 0;
var mode = 1;
var metroFunction, metroFunction2;

function setupRoutingGraph () {
    
    var modGain3 = context.createGain(),
        modMod = context.createOscillator(),
        modGain = context.createGain(),
        modulator = context.createOscillator(),
        currTime = context.currentTime,
        modGain2 = context.createGain();
    sines = context.createGain();
    shift = context.createGain();
    compressor = context.createDynamicsCompressor();
    clicks = context.createGain();
    rand = context.createGain();
    
    // make connections
    clicks.connect(compressor);
    sines.connect(compressor);
    rand.connect(compressor);
    shift.connect(compressor);
    modGain3.connect(sines);
    modulator.connect(modGain2);
    modGain2.connect(modGain3.gain);
    modMod.connect(modGain);
    modGain.connect(modulator.frequency);
    
    //initialize LFO
    modulator.start(0);
    modMod.start(0);
    modGain2.gain.setValueAtTime(0.5, currTime);
    modGain.gain.setValueAtTime(0.1, currTime);
    modMod.frequency.setValueAtTime(0.11, currTime);
    modulator.frequency.setValueAtTime(0.1, currTime);
    
    var nextNoteTime = 50.0 + delay;
    var scheduleAheadTime = 100.0;
    //var interval = Math.random() * 3 * 100 + 200;
    interval = isMobile ? 375.0 : 625.0;
    setInterval(function() {
        while (nextNoteTime < context.currentTime*1000 + scheduleAheadTime ) {
            if(mode===2) {
                scheduleNote(nextNoteTime/1000);
            }
            nextNoteTime += interval;
        }
    }, 50);
    // Create, connect, start a few sources.
    for(var i = 0; i < 3; i++) {
        var sound = context.createOscillator();
        var gain = context.createGain();
        gain.gain.setValueAtTime(0.33, context.currentTime);
        sound.connect(gain);
        gain.connect(modGain3);
        osc[i] = {};
        osc[i].sound = sound;
        osc[i].gain = gain;
        osc[i].ratio = [1,1];
        osc[i].sound.start(0);
    }
    
    randomFreqs();
    compressor.connect(context.destination);
    sines.gain.setValueAtTime(0.001, currTime);
    rand.gain.setValueAtTime(0.001, currTime);
    clicks.gain.setValueAtTime(0.001, currTime);
    shift.gain.setValueAtTime(0.001, currTime);
}

//click listeners
$("#start").on("click", function() {
    if(!init) {
        context.resume();
        setupRoutingGraph();
        socket.emit("start");
        ready = true;
        $("#container-outer").css("display", "none");
        jQuery("body").animate({backgroundColor: "#FF0000"}, 1000);
    } else {
        sines.gain.exponentialRampToValueAtTime(0.9, context.currentTime + 1);
    }
});

function randomFreqs() {
    var scale = isMobile ? 1800.0 : 940.0;
    var offset = isMobile ? 200.0 : 60.0;
    osc.forEach(function(el) {
        var rand = Math.random() * scale + offset;
        el.sound.frequency.setValueAtTime(rand, context.currentTime);
    });
}

function addOsc(harm) {
    var gain = context.createGain(0.001);
    var sound = context.createOscillator();
    sound.connect(gain);
    gain.connect(sines);
    var freq = fundamental * harm;
    sound.frequency.setValueAtTime(freq, context.currentTime);
    sound.start(0);
    var newOsc = {};
    newOsc.sound = sound;
    newOsc.ratio = [1,1];
    newOsc.gain = gain;
    osc.push(newOsc);
}


function setFreqs(time) {
    limits[limit] = shuffle(limits[limit]);
    console.log(limits[limit]);
    osc.forEach(function(el, i) {
        var ratio = ratios[limits[limit][i]];
        var freq = fundamental * parseFloat(ratio[0]/ratio[1]);
        el.ratio = ratio;
        el.sound.frequency.exponentialRampToValueAtTime(freq, time);
    });
}
// takes in a fundamental and a multiplier to make dense sine clouds
function sineNoise(fund, ratio, xfade) {
    var freqs = new Array(10);
    var last = fund;
    freqs[0] = last;
    for(var i = 1; i < 10; i++) {
        freqs[i] = freqs[i-1] * ratio;
    }
    shuffle(freqs);
    osc.forEach(function(el, i) {
        el.sound.frequency.exponentialRampToValueAtTime(freqs[i], xfade);
    });
}
function bellHarm(start, time) {
    osc[0].sound.frequency.exponentialRampToValueAtTime(fundamental, time);
    var ratio = (normal[start] - bell[start]) * ((4-degree)/4) + normal[start];
    var freq = fundamental * ratio;
    console.log("bell freq: " + freq + ", " + ratio);
    osc[1].sound.frequency.exponentialRampToValueAtTime(freq, time);
    ratio = parseFloat((normal[start+1%11] - bell[start+1%11]) * (degree/4) + bell[start+1%11]);
    freq = fundamental * ratio;
    osc[2].sound.frequency.exponentialRampToValueAtTime(freq, time);
}

function randMetro(density, pitch) {
    var gain, time, gain2;
    var osc2 = new Array(5);
    for(var i = 0; i < density; i++) {
        gain2 = Math.random() * 0.5 + 0.3;
        gain = context.createGain();
        time = context.currentTime + Math.random();
        gain.connect(rand);
        for(var j = 0; j < 5; j++) {
            osc2[j] = context.createOscillator();
            osc2[j].frequency.setValueAtTime(pitch * (j+1), context.currentTime);
            osc2[j].connect(gain);
            osc2[j].start(time);
            osc2[j].stop(time + 0.3);
        }
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(gain2, time + 0.02);
        gain.gain.linearRampToValueAtTime(gain2, time + 0.04);
        gain.gain.linearRampToValueAtTime(0.001, time + 0.08);
    }
}

function randGliss(avgTime, end) {
    var time;
    osc.forEach(function(el, i) {
        time = avgTime + ((Math.random()-0.5) * (avgTime * 0.5));
        el.sound.frequency.exponentialRampToValueAtTime(end, time);
    });
}

function harmShift(harm, xfade) {
    var harms = [[0,1,2], [3,4,5], [6,7,8], [9,10,11]];
    osc2 = new Array(12);
    for(var i = 0; i < 12; i++) {
        var gain = context.createGain();
        gain.gain.setValueAtTime(0.000001, context.currentTime);
        var sound = context.createOscillator();
        sound.connect(gain);
        gain.connect(shift);
        var freq = fundamental * (i+1);
        sound.frequency.setValueAtTime(freq, context.currentTime);
        sound.start(0);
        var newOsc = {};
        newOsc.sound = sound;
        newOsc.ratio = [1,1];
        newOsc.gain = gain;
        osc2[i] = newOsc;
    }
    var length = 3;
    var lastTime = context.currentTime + 0.1;
    metroFunction2 = setInterval(function() {
        harms[harm].forEach(function(el, i) {
            osc2[el].gain.gain.linearRampToValueAtTime(0.3, lastTime);
            osc2[el].gain.gain.linearRampToValueAtTime(0.000001, lastTime + length);
        });
        lastTime = lastTime + length;
        harm = (harm + 1) % 4;
        // if(count % 4 === 0 && count != 0) {
        //     length = length * 0.95;
        // }
    }, 500);
}
// convenience method for finding fractional values between click periods
function intervalCalc(fund) {
    var frac = fund % 1;
    var first, second;
    if(frac === 0) {
        interval = intervals[fund];
    } else {
        first = intervals[Math.ceil(fund-1)];
        second = intervals[Math.ceil(fund)];
        interval = first - ((first-second) * frac);
    }
}
function adjustGains() {
    osc.forEach(function(el) {
        el.gain.gain.value = (1.0/osc.length);
    });
}
//function for shuffling elements in an array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//websocket things
function setUsername() {
    socket.emit("add user");
}

function scheduleNote(time) {
    var osc = context.createOscillator();
    var gain = context.createGain();
    osc.connect(gain);
    gain.connect(clicks);
    osc.frequency.setValueAtTime(clickFreq, context.currentTime);
    osc.start(time);
    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.000000001, time + 0.1);
    osc.stop(time + 0.3);
}
//socket stuff!
setUsername();

socket.on("new user", function(data) {
    console.log(data.username + " has joined");
    numUsers = data.numUsers;
});

socket.on("user left", function(data) {
    numUsers = data.numUsers;
    console.log(data.username + " left");
});

socket.on("fundamental", function(data) {
    fundamental = data.fundamental;
    setFreqs(1 + context.currentTime);
});


socket.on("makeNoise", function(data) {
    if((socket.id === data.id) && ready) {
        console.log("all good");
        fundamental = data.fundamental;
        limit = harmonics[data.limit];
        interval = intervals[data.limit];
        clickFreq = clickFreqs[data.limit];
        ready = false;
        init = true;
    }
});

socket.on("mute", function() {
    sines.gain.setValueAtTime(past[0], context.currentTime);
    sines.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1);
    clicks.gain.setValueAtTime(past[1], context.currentTime);
    clicks.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1);
    rand.gain.setValueAtTime(past[2], context.currentTime);
    rand.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1);
});

socket.on("add", function() {
    addOsc(true);
});


socket.on("color", function(data) {
    $("body").animate({backgroundColor: colors[data.color]}, 1000);
    color = colors[data.color];
});

socket.on("flash", function(data) {
    var isWhite = true;
    var count = 0;
    $("body").css("background-color", "white");
    var func = setInterval(function() {
        if(isWhite) {
            $("body").css("background-color", color);
            isWhite = false;
        } else {
            $("body").css("background-color", "white");
            isWhite = true;
        }
        count++;
        if(count > 6) {
            clearInterval(func);
        }
    }, 125);
});

socket.on("finale", function(data) {
    clearInterval(metroFunction);
    var time = context.currentTime + data;
    osc2.forEach(function(el) {
        el.sound.frequency.exponentialRampToValueAtTime(5000, time);
    });
    shift.gain.linearRampToValueAtTime(0.9, context.currentTime);
    shift.gain.exponentialRampToValueAtTime(0.95, context.currentTime + data/6);
    shift.gain.exponentialRampToValueAtTime(0.0001, time);
    past[0] = 0.0001;
    setTimeout(() => {
        $("#thanks").removeClass("hidden");
        $("#white").addClass("hidden");
        $("#gray").addClass("hidden");
    }, data*750);
    setInterval(() => {
        $("#thanks h1").toggleClass("white_text");
    }, 250);
});
function flash(newColor) {
    var isWhite = true;
    var count = 0;
    $("body").css("background-color", "white");
    var func = setInterval(function() {
        if(isWhite) {
            $("body").css("background-color", color);
            isWhite = false;
        } else {
            $("body").css("background-color", "white");
            isWhite = true;
        }
        count++;
        if(count > 6) {
            clearInterval(func);
            $("body").animate({backgroundColor: colors[newColor]}, 1000);
            color = colors[newColor];
        }
    }, 125);
    
}
socket.on("level", function(data) {
    if(data.level > 3) {
        $("#white").removeClass("hidden");
    }
    if(data.level > 9) {
        $("#gray").removeClass("hidden");
    }
    mode = data.mode;
    clearInterval(metroFunction);
    var xfade = data.xfade + context.currentTime;
    if(mode===1) { //regular ass sines
        sines.gain.setValueAtTime(past[0], context.currentTime);
        sines.gain.exponentialRampToValueAtTime(0.9, xfade);
        clicks.gain.setValueAtTime(past[1], context.currentTime);
        clicks.gain.exponentialRampToValueAtTime(0.001, xfade);
        rand.gain.setValueAtTime(past[2], context.currentTime);
        rand.gain.exponentialRampToValueAtTime(0.001, xfade);
        past = [0.9, 0.001, 0.001];
        fundamental = data.fundamental;
        setFreqs(xfade);
    } else if (mode===2) { //clicks
        sines.gain.setValueAtTime(past[0], context.currentTime);
        sines.gain.exponentialRampToValueAtTime(0.001, xfade);
        clicks.gain.setValueAtTime(past[1], context.currentTime);
        clicks.gain.exponentialRampToValueAtTime(0.9, xfade);
        rand.gain.setValueAtTime(past[2], context.currentTime);
        rand.gain.exponentialRampToValueAtTime(0.001, xfade);
        past = [0.001, 0.9, 0.001];
        intervalCalc(data.fundamental);
    } else if (mode===3) {
        //sineNoise stuff
        sines.gain.setValueAtTime(past[0], context.currentTime);
        sines.gain.exponentialRampToValueAtTime(0.9, xfade);
        clicks.gain.setValueAtTime(past[1], context.currentTime);
        clicks.gain.exponentialRampToValueAtTime(0.001, xfade);
        rand.gain.setValueAtTime(past[2], context.currentTime);
        rand.gain.exponentialRampToValueAtTime(0.001, xfade);
        past = [0.9, 0.001, 0.001];
        sineNoise(data.fundamental, data.other, xfade);
    } else if (mode===4) { //rand metro mode
        sines.gain.setValueAtTime(past[0], context.currentTime);
        sines.gain.exponentialRampToValueAtTime(0.001, xfade);
        clicks.gain.setValueAtTime(past[1], context.currentTime);
        clicks.gain.exponentialRampToValueAtTime(0.001, xfade);
        rand.gain.setValueAtTime(past[2], context.currentTime);
        rand.gain.exponentialRampToValueAtTime(0.9, xfade);
        past = [0.001, 0.001, 0.9];
        fundamental = data.fundamental;
        var pitch = fundamental;
        metroFunction = setInterval(function() {
            randMetro(data.other, pitch);
        }, 1000);
    } else if (mode===5) { //bell mode
        sines.gain.setValueAtTime(past[0], context.currentTime);
        sines.gain.exponentialRampToValueAtTime(0.9, xfade);
        clicks.gain.setValueAtTime(past[1], context.currentTime);
        clicks.gain.exponentialRampToValueAtTime(0.001, xfade);
        rand.gain.setValueAtTime(past[2], context.currentTime);
        rand.gain.exponentialRampToValueAtTime(0.001, xfade);
        past = [0.9, 0.001, 0.001];
        fundamental = data.fundamental;
        if (data.degree) {
            degree = data.degree;
        }
        bellHarm(data.other, xfade); //here data.other = start index of harmonic
    } else if (mode===6) { //multiple gliss mode
        sines.gain.setValueAtTime(past[0], context.currentTime);
        sines.gain.exponentialRampToValueAtTime(0.9, xfade);
        clicks.gain.setValueAtTime(past[1], context.currentTime);
        clicks.gain.exponentialRampToValueAtTime(0.001, xfade);
        rand.gain.setValueAtTime(past[2], context.currentTime);
        rand.gain.exponentialRampToValueAtTime(0.001, xfade);
        past = [0.9, 0.001, 0.001];
        randGliss(xfade, data.other);
    } else if (mode===7) { //final harmonic shifting mode
        sines.gain.setValueAtTime(past[0], context.currentTime);
        sines.gain.exponentialRampToValueAtTime(0.001, xfade);
        clicks.gain.setValueAtTime(past[1], context.currentTime);
        clicks.gain.exponentialRampToValueAtTime(0.001, xfade);
        rand.gain.setValueAtTime(past[2], context.currentTime);
        rand.gain.exponentialRampToValueAtTime(0.001, xfade);
        past = [0.001, 0.001, 0.001];
        fundamental = data.fundamental;
        setTimeout(function() {
            clearInterval(metroFunction);
        }, data.xfade*1500);
        shift.gain.setValueAtTime(0.001, context.currentTime);
        shift.gain.linearRampToValueAtTime(0.9, xfade);
        harmShift(data.other, xfade);
    } else if (mode == 0) {
        //nothing!!!
    }
    flash(data.color);
});
