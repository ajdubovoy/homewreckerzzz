export default [
  {
    id: 'colors0',
    title: 'Colors 0',
    question: "cHooz a color:",
    answers: [
      'blue',
      'bluish',
      'purple',
      'lightttt'
    ],
    colors: [
      240,260,271,210
    ],
    class: 'colors',
    visualization: 'colors',
    quantity: 'multiple',
    duration: 30000
  },
  {
    id: 'colors1',
    title: 'Colors 1',
    question: "cHooz a color:",
    answers: [
      'blue',
      'green',
      'purple',
      'yellow'
    ],
    colors: [
      240,138,271,60
    ],
    class: 'colors',
    visualization: 'colors',
    quantity: 'multiple',
    duration: 30000,
    event: {
      piano: true
    }
  },
  {
    id: 'colors2',
    title: 'Colors 2',
    question: "cHooz a color:",
    answers: [
      'red',
      'pink',
      'purple',
      'yellow'
    ],
    colors: [
      1,300,271,60
    ],
    class: 'colors',
    visualization: 'colors',
    quantity: 'multiple',
    duration: 30000,
    event: {
      sax: true
    }
  },
  {
    id: 'colors3',
    title: 'Colors 3',
    question: "cHooz a color:",
    answers: [
      'red',
      'pink',
      'purple',
      'redder'
    ],
    colors: [
      10,300,271,1
    ],
    class: 'colors',
    visualization: 'colors',
    quantity: 'multiple',
    duration: 30000,
    event: {
      curves: true
    }
  },
  {
    id: 'emoji',
    title: 'Emoji',
    question: "Please select an emoji:",
    answers: [
      '😍',
      '🤓',
      '🤗',
      '🤯'
    ],
    colors: [
      1,300,20,60
    ],
    class: 'doughnuts',
    visualization: 'emoji',
    quantity: 'multiple',
    duration: 30000
  },
  {
    id: 'emoji2',
    title: 'Emoji 2',
    question: "Please select an emoji:",
    answers: [
      '🐣',
      '🍡',
      '🦖',
      '🤯'
    ],
    colors: [
      1,300,20,60
    ],
    class: 'doughnuts',
    visualization: 'emoji',
    quantity: 'multiple',
    duration: 20000
  },
  {
    id: 'emoji3',
    title: 'Emoji 3',
    question: "Please select an emoji:",
    answers: [
      '🙌',
      '🤟',
      '🦶',
      '👀'
    ],
    colors: [
      1,300,20,60
    ],
    class: 'doughnuts',
    visualization: 'emoji',
    quantity: 'multiple',
    duration: 20000
  },
  {
    id: 'numbers1',
    title: 'Numbers 1',
    question: "Please select a number:",
    answers: [
      '0',
      '1'
    ],
    colors: [],
    class: 'numbers',
    visualization: 'numbers',
    quantity: 'single',
    duration: 5000,
    event: {
      piano: false,
      sax: false,
      curves: false,
      emoji: false
    }
  },
  {
    id: 'numbers2',
    title: 'Numbers 2',
    question: "Please select a number:",
    answers: [
      '0',
      '1',
      '2'
    ],
    colors: [],
    class: 'numbers',
    visualization: 'numbers',
    quantity: 'single',
    duration: 5000
  },
  {
    id: 'numbers3',
    title: 'Numbers 3',
    question: "Please select a number:",
    answers: [
      '1',
      '2',
      '3',
    ],
    colors: [],
    class: 'numbers',
    visualization: 'numbers',
    quantity: 'single',
    duration: 5000
  },
  {
    id: 'numbers4',
    title: 'Numbers 4',
    question: "Please select a number:",
    answers: [
      '2',
      '3',
      '4',
      '8'
    ],
    colors: [],
    class: 'numbers',
    visualization: 'numbers',
    quantity: 'single',
    duration: 5000
  },
  {
    id: 'numbers5',
    title: 'Numbers 5',
    question: "Please select a number:",
    answers: [
      '9',
      '16',
      '40',
      '2'
    ],
    colors: [],
    class: 'numbers',
    visualization: 'numbers',
    quantity: 'single',
    duration: 5000
  },
  {
    id: 'numbers6',
    title: 'Numbers 6',
    question: "Please select a number:",
    answers: [
      '100',
      '1000',
      'a gazillion',
      '12093847'
    ],
    colors: [],
    class: 'numbers',
    visualization: 'numbers',
    quantity: 'single',
    duration: 5000,
    event: {
      curves: true
    }
  },
  {
    id: 'numbers7',
    title: 'Numbers 7',
    question: "Please select a number:",
    answers: [
      'a smorgasbord',
      'a cornucopia',
      'a gazillion',
      'i dont like the question'

    ],
    colors: [],
    class: 'numbers',
    visualization: 'numbers',
    quantity: 'single',
    duration: 5000,
    event: {
      emoji: true
    }
  },
  {
    id: 'pickTeam',
    title: 'Pick a Team',
    question: "Which team are you on?",
    answers: [
      'Team Piano 🎹',
      'Team Sax 🎷'
    ],
    colors: [],
    class: 'team',
    visualization: 'emoji',
    quantity: 'single',
    duration: 20000,
    superpower: 'team'
  },
  {
    id: 'celloFun',
    title: 'Cello Fun',
    question: "do u waNt the CellISt to have more fUn?",
    answers: [
      'OFCOURSE',
      'omg ew no'
    ],
    colors: [230, 1],
    class: 'cello',
    visualization: '',
    quantity: 'single',
    duration: 15000,
    event: {
      curves: true
    }
  },
  {
    id: 'fasterPiano',
    title: 'Piano Fast',
    question: "🙄 that pianist is lookin' awful tired? shouldn't they play FASTER???",
    answers: [
      'go forrr it',
      'i really prefer a sustained effort'
    ],
    colors: [230, 1],
    class: 'piano',
    visualization: 'instrument', //if visualize is instrument, the details key is necessary
    details: {
      "instrument": "piano",
      "param": "speed" // piano/piano: [speed, texture, color, volume, emoji], emoji: [speed, volume], curves: [speed, color]
    },
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'louderPiano',
    title: 'Piano Loud',
    question: "i can barely hEar the haMMErs hit those Strings. Want them to play louder?",
    answers: [
      'GO FOR IT',
      'plz no stop urg garble'
    ],
    colors: [230, 1],
    class: 'piano',
    visualization: 'instrument', //if visualize is instrument, the details key is necessary
    details: {
      "instrument": "piano",
      "param": "volume" // piano/piano: [speed, texture, color, volume, emoji], emoji: [speed, volume], curves: [speed, color]
    },
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'texturePiano',
    title: 'Piano Texture',
    question: "this is feelin' awful samEY; how u wanna swItch it up?",
    answers: [
      'make it chunkier',
      'make it smoother'
    ],
    colors: [230, 1],
    class: 'piano',
    visualization: 'instrument', //if visualize is instrument, the details key is necessary
    details: {
      "instrument": "piano",
      "param": "texture" // piano/piano: [speed, texture, color, volume, emoji], emoji: [speed, volume], curves: [speed, color]
    },
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'colorPiano',
    title: 'Piano Color',
    question: "d0 u like a colOUR to repaint the PIANO?",
    answers: [
      'red',
      'pink',
      'purple',
      'blue',
    ],
    colors: [
      1,300,271,240
    ],
    class: 'piano',
    visualization: 'instrument', //if visualize is instrument, the details key is necessary
    details: {
      "instrument": "piano",
      "param": "color" // piano/piano: [speed, texture, color, volume, emoji], emoji: [speed, volume], curves: [speed, color]
    },
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'fasterCurve',
    title: 'Curve Fast',
    question: "plz can i has the SQUIGGLES speedier?",
    answers: [
      'sqoop more sqööpily',
      'stay slow young squiggleone'
    ],
    colors: [230, 1],
    class: 'piano',
    visualization: 'instrument', //if visualize is instrument, the details key is necessary
    details: {
      "instrument": "piano",
      "param": "speed" // piano/piano: [speed, texture, color, volume, emoji], emoji: [speed, volume], curves: [speed, color]
    },
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'curveColor',
    title: 'Curve Color',
    question: "i wanna make the sqÜÜIggles prettier; dont u?",
    answers: [
      'red',
      'pink',
      'purple',
      'blue',
    ],
    colors: [
      1,300,271,240
    ],
    class: 'piano',
    visualization: 'instrument', //if visualize is instrument, the details key is necessary
    details: {
      "instrument": "curve",
      "param": "color" // piano/piano: [speed, texture, color, volume, emoji], emoji: [speed, volume], curves: [speed, color]
    },
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'fasterSax',
    title: 'Sax Fast',
    question: "🙄 wow, what is this sax cat doing? shouldn't they play FASTER???",
    answers: [
      'i was thinking the same thing',
      'i don\'t agree, mean computer'
    ],
    colors: [230, 1],
    class: 'sax',
    visualization: 'instrument', //if visualize is instrument, the details key is necessary
    details: {
      "instrument": "sax",
      "param": "speed" // sax/piano: [speed, texture, color, volume, emoji], emoji: [speed, volume], curves: [speed, color]
    },
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'louderSax',
    title: 'Sax Loud',
    question: "that sax is aWfUl quIET;;;want them to SKRoNK?",
    answers: [
      'i\'ve been waiting für u to ask tHAt',
      'ew that sounds awfUL'
    ],
    colors: [230, 1],
    class: 'sax',
    visualization: 'instrument', //if visualize is instrument, the details key is necessary
    details: {
      "instrument": "sax",
      "param": "volume" // sax/piano: [speed, texture, color, volume, emoji], emoji: [speed, volume], curves: [speed, color]
    },
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'textureSax',
    title: 'Sax Texture',
    question: "which way do you want the sax to t00t that h0rn?",
    answers: [
      'skrrrrooooooouuuuuuuuuuunkkkkkkkkkk',
      'sm00th as a babys bottom'
    ],
    colors: [230, 1],
    class: 'sax',
    visualization: 'instrument', //if visualize is instrument, the details key is necessary
    details: {
      "instrument": "sax",
      "param": "texture" // sax/piano: [speed, texture, color, volume, emoji], emoji: [speed, volume], curves: [speed, color]
    },
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'colorSax',
    title: 'Sax Color',
    question: "d0 u like a colOUR to repaint the SAX?",
    answers: [
      'red',
      'pink',
      'purple',
      'blue'
    ],
    colors: [
      1,300,271,240
    ],
    class: 'sax',
    visualization: 'instrument', //if visualize is instrument, the details key is necessary
    details: {
      "instrument": "sax",
      "param": "color" // sax/piano: [speed, texture, color, volume, emoji], emoji: [speed, volume], curves: [speed, color]
    },
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'newSection',
    title: 'New section',
    question: "Would you like for a new section to start",
    answers: [
      'fo sho',
      'nO'
    ],
    colors: [230, 1],
    class: 'light',
    visualization: 'curve',
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'different',
    title: 'Something Different',
    question: "Should we do something dIFFerent?",
    answers: [
      'obvi',
      'naw'
    ],
    colors: [230, 1],
    class: 'light',
    visualization: 'curve',
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'repeat',
    title: 'Repeat?',
    question: "Should we do it again?",
    answers: [
      'yas',
      'nerp'
    ],
    colors: [230, 1],
    class: 'chart',
    visualization: 'curve',
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'checkNeighbor',
    title: 'Check your neighbor',
    question: "Does your neighbor's phOne say the sAme thing as yours? lOOk arOUnd u",
    answers: [
      'complete sAme',
      'omg totally dIffErent'
    ],
    colors: [230, 1],
    class: 'look',
    visualization: '',
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'control',
    title: 'Control?',
    question: "Are you in control right now?",
    answers: [
      'totes my goats',
      'noooooooOPE'
    ],
    colors: [230, 1],
    class: 'chart',
    visualization: 'pie',
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'moreControl',
    title: 'more control?',
    question: "do you want more control?",
    answers: [
      'oh yahhhhhhh',
      'tbh im fine'
    ],
    colors: [230, 1],
    class: 'chart',
    visualization: 'bubble',
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'controlAnother',
    title: 'Control someone else',
    question: "Do U want 2 contrOL someone eLse?",
    answers: [
      'of cOurse',
      'thx but naw'
    ],
    colors: [230, 1],
    class: 'chart',
    visualization: 'line',
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'stop',
    title: 'Stop?',
    question: "Do U wanT thIs to stop?",
    answers: [
      'omg plzzzzz',
      'naw keep goin'
    ],
    colors: [230, 1],
    class: 'stop',
    visualization: 'pie',
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'stopMore',
    title: 'Stop More?',
    question: "no srsly like we could END this. want us to StOP?",
    answers: [
      'yassssss',
      'im rly fine'
    ],
    colors: [230, 1],
    class: 'stop',
    visualization: 'bar',
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'moveAround',
    title: 'Move around',
    question: "u can mOve arOUnd now!",
    answers: [],
    colors: [],
    class: 'move',
    visualization: '',
    message: true,
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'sneeze',
    title: 'Sneeze',
    question: "it's srSLY fine if you need to sneeze",
    answers: [],
    colors: [],
    class: 'sneeze',
    visualization: '',
    message: true,
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'sorry',
    title: 'Sorry',
    question: "im hOnestly s0 sorry this had to happen...",
    answers: [],
    colors: [],
    class: 'sorry',
    visualization: '',
    message: true,
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'notPretty',
    title: 'Not Pretty',
    question: "i rLLy dont like musiK that isnt preTTy........😵",
    answers: [],
    colors: [],
    class: 'sorry',
    visualization: '',
    message: true,
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'agitated',
    title: 'Agitated',
    question: "tbh i feel kindA agitated n0w",
    answers: [],
    colors: [],
    class: 'sorry',
    visualization: '',
    message: true,
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'horrible',
    title: 'Horrible',
    question: "that was preTTy horRible pfffffff",
    answers: [],
    colors: [],
    class: 'amateur',
    visualization: '',
    message: true,
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'wishEnd',
    title: 'Wish for end',
    question: "I reaLLy wiSH this would END",
    answers: [],
    colors: [],
    class: 'stop',
    visualization: '',
    message: true,
    quantity: 'single',
    duration: 15000
  },
  {
    id: 'finale',
    title: 'Finale',
    question: "done...",
    answers: [],
    colors: [],
    class: '',
    visualization: '',
    message: true,
    quantity: 'single',
    duration: 1,
    event: {
      finale: true,
      sax: false,
      piano: false,
      curves: false,
      emoji: false
    }
  },
];
