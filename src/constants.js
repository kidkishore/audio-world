export const BASS = 0;
export const LOMID = 1;
export const MID = 2;
export const HIMID = 3;
export const TREBLE = 4;

export const MAXINT = 999999999;

export const defaultColor = 0x4D4D4D;

export const responses = [
  {
    key: 0,
    text: 'Bass',
    value: 0,
    damping: 200
  },
  {
    key: 1,
    text: 'loMid',
    value: 1,
    damping: 160
  },
  {
    key: 2,
    text: 'Mid',
    value: 2,
    damping: 130
  },
  {
    key: 3,
    text: 'hiMid',
    value: 3,
    damping: 100
  },
  {
    key: 4,
    text: 'Treble',
    value: 4,
    damping: 80
  },
];

export const scenes = [
  {
    key: '0',
    text: 'Goomba',
    value: 'Goomba',
  },
  {
    key: '1',
    text: 'Munnar',
    value: 'Munnar',
  },
  {
    key: '2',
    text: 'World',
    value: 'World',
  },
  {
    key: '3',
    text: 'Pineapple',
    value: 'Pineapple',
  }
]

export const backgrounds = [
  {
    key: '0',
    text: 'Space',
    value: 'space.jpeg',
  },
  {
    key: '1',
    text: 'Snow',
    value: 'snow.jpg',
  },
  {
    key: '2',
    text: 'Tea',
    value: 'munnar.JPG',
  },
  {
    key: '3',
    text: 'Water',
    value: 'water.jpg',
  }
]

export const sceneDetail = {
  World: {
    Background: 'space.jpeg',
    Center: 'Earth',
    Orbit: 'Duck'
  },
  Pineapple: {
    Background: 'water.jpg',
    Center: 'Pineapple',
    Orbit: 'Starfish'
  },
  Munnar: {
    Background: 'munnar.JPG',
    Center: 'Helmet',
    Orbit: 'BrainStem'
  },
  Goomba: {
    Background: 'snow.jpg',
    Center: 'Creature',
    Orbit: 'speaker'
  },

};

export const objects = [
  {
    key: 0,
    text: 'Earth',
    value: 'Earth',
  },
  {
    key: 1,
    text: 'Pineapple',
    value: 'Pineapple',
  },
  {
    key: 2,
    text: 'BrainStem',
    value: 'BrainStem',
  },
  {
    key: 3,
    text: 'Starfish',
    value: 'Starfish',
  },
  {
    key: 4,
    text: 'Helmet',
    value: 'Helmet',
  },
  {
    key: 5,
    text: 'Duck',
    value: 'Duck',
  },
  {
    key: 6,
    text: 'Creature',
    value: 'Creature',
  },
  {
    key: 7,
    text: 'Plumber',
    value: 'Plumber',
  },
  {
    key: 8,
    text: 'Cesium',
    value: 'Cesium',
  },
  {
    key: 9,
    text: 'Speaker',
    value: 'speaker',
  }
];

export const streams = [
  {
    key: 0,
    text: ' MICROPHONE',
    value: 'MICROPHONE',
  },
  {
    key: 1,
    text: '    FILE',
    value: 'FILE',
  },
  {
    key: 2,
    text: ' DRIVER',
    value: 'DRIVER',
  }


];

