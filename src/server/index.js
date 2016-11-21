// enable source-maps in node
import 'source-map-support/register';
// import soundworks (server-side) and experience
import * as soundworks from 'soundworks/server';
import GrainfieldExperience from './GrainfieldExperience';
import ControllerExperience from './ControllerExperience';
// import leap service
// import '../shared/service/Leap';

import defaultConfig from './config/default';


let config = null;

switch(process.env.ENV) {
  default:
    config = defaultConfig;
    break;
}

process.env.NODE_ENV = config.env;

// config.midiController = 'LPD8';
// config.bpm = 60;
// config.recordPeriod = 60 / config.bpm;
// config.recordDuration = 2 * config.recordPeriod;
// config.baseNote = 44;
// config.steps = 8;

config.resamplingVarMax = 1200;

config.recordings = {
  cyclic: {
    duration: 4,
    period: 2,
    num: 4,
    cyclic: true,
  },
}

// initialize the server with configuration informations
soundworks.server.init(config);

// define the configuration object to be passed to the `.ejs` template
soundworks.server.setClientConfigDefinition((clientType, config, httpRequest) => {
  return {
    clientType: clientType,
    websockets: config.websockets,
    appName: config.appName,
    version: config.version,
    defaultType: config.defaultClient,
    assetsDomain: config.assetsDomain,
  };
});

const sharedParams = soundworks.serviceManager.require('shared-params');

sharedParams.addText('numPlayers', 'num players', 0, ['controller']);
sharedParams.addEnum('cyclicBuffer', 'Cyclic Buffer', ['record', 'stop'], 'stop');
// granular engine params
sharedParams.addNumber('periodAbs', 'periodAbs', 0.02, 0.2, 0.001, 0.05, 'player');
sharedParams.addNumber('durationAbs', 'durationAbs', 0.01, 0.5, 0.001, 0.2, 'player');
sharedParams.addNumber('positionVar', 'positionVar', 0.01, 0.5, 0.001, 0.02, 'player');
sharedParams.addNumber('gainMult', 'gainMult', 0.1, 10, 0.01, 0.25, 'player');
// soloist
sharedParams.addBoolean('playerEnabled', 'playerEnabled', false, ['player', 'soloist', 'performer']);
sharedParams.addBoolean('performerEnabled', 'performerEnabled', false, ['player', 'soloist', 'performer']);

// create the common server experience for both the soloists and the players
const controller = new ControllerExperience('controller');
const soundfieldExperience = new GrainfieldExperience(['player', 'performer', 'recorder', 'soloist']);

// start the application
soundworks.server.start();
