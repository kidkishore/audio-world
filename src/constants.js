export const BASS = 0;
export const LOMID = 1;
export const MID = 2;
export const HIMID = 3;
export const TREBLE = 4;

export const MAXINT = 999999999;

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
    damping: 200
  },
  {
    key: 2,
    text: 'Mid',
    value: 2,
    damping: 200
  },
  {
    key: 3,
    text: 'hiMid',
    value: 3,
    damping: 200
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
    text: 'World',
    value: 'World',
  },
  {
    key: '1',
    text: 'Pineapple',
    value: 'Pineapple',
  },
  {
    key: '2',
    text: 'Goomba',
    value: 'Goomba',
  },
  {
    key: '3',
    text: 'Munnar',
    value: 'Munnar',
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
    Center: 'Earth.glb',
    Orbit: 'Duck.glb'
  },
  Pineapple: {
    Background: 'water.jpg',
    Center: 'Pineapple.glb',
    Orbit: 'Starfish.glb'
  },
  Munnar: {
    Background: 'munnar.JPG',
    Center: 'DamagedHelmet.glb',
    Orbit: 'BrainStem.glb'
  },
  Goomba: {
    Background: 'snow.jpg',
    Center: 'Creature.glb',
    Orbit: 'Plumber.glb'
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
    text: 'Duck',
    value: 'Duck',
  },
  {
    key: 2,
    text: 'Pineapple',
    value: 'Pineapple',
  },
  {
    key: 3,
    text: 'Starfish',
    value: 'Starfish',
  },
  {
    key: 4,
    text: 'DamagedHelmet',
    value: 'DamagedHelmet',
  },
  {
    key: 5,
    text: 'BrainStem',
    value: 'BrainStem',
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

