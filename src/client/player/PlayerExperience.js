import * as soundworks from 'soundworks/client';
import Synth from './Synth';
import Renderer from './Renderer';
import PitchAndRollEstimator from '../shared/PitchAndRollEstimator.js';

// html template used by `View` of the `PlayerExperience`
const template = `
  <canvas class="background"></canvas>
  <div class="foreground">
    <div class="section-top"></div>
    <div class="section-center flex-center">
      <p class="big">
        <% if (state === 'listen') { %>
          Ecoutez
        <% } else if (state === 'attention') { %>
          Attention...
        <% } else if (state === 'play') { %>
          Jouez !
        <% } %>
      </p>
    </div>
    <div class="section-bottom"></div>
  </div>
`;


const files = ['/sounds/beats-hh.wav', '/sounds/beats-sd.wav'];
//const files = ['/sounds/mindbox-extract.mp3'];
const client = soundworks.client;

const colors = [
  '#dd0085', // 'pink'
  '#ee0000', // 'red'
  '#ff7700', // 'orange'
  '#ffaa00', // 'yellow'
  '#43af00', // 'green'
  '#0062e2', // 'darkBlue'
  '#009ed8', // 'lightBlue'
  '#6b7884', // 'grey'
  '#6700f7', // 'purple'
];

export default class PlayerExperience extends soundworks.Experience {
  constructor(kind = 'player') {
    super();

    this.kind = kind;

    this.platform = this.require('platform', { features: 'web-audio' });
    // this.require('locator');
    this.checkin = this.require('checkin');
    this.audioBufferManager = this.require('audio-buffer-manager', { files });
    this.sharedParams = this.require('shared-params');

    this.sharedConfig = this.require('shared-config', {
      items: ['recordings']
    });

    this.motionInput = this.require('motion-input', {
      descriptors: ['accelerationIncludingGravity'],
    });

    this.sharedRecorder = this.require('shared-recorder', { recorder: false });

    this.processAccelerationData = this.processAccelerationData.bind(this);
    this.onCyclicBuffer = this.onCyclicBuffer.bind(this);
  }

  init() {
    this.synth = new Synth();
    this.pitchAndRoll = new PitchAndRollEstimator();

    // configure and instanciate the view of the experience
    this.viewContent = { state: 'listen' };
    this.viewTemplate = template;
    this.viewCtor = soundworks.CanvasView;
    this.view = this.createView();

    this.currentColorIndex = null;
    this.renderer = new Renderer();
  }


  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.show();

    // setup socket listeners for server messages
    this.sharedParams.addParamListener('periodAbs', (value) => {
      this.synth.setPeriodAbs(value);
    });

    this.sharedParams.addParamListener('durationAbs', (value) => {
      this.synth.setDurationAbs(value);
    });

    this.sharedParams.addParamListener('positionVar', (value) => {
      this.synth.setPositionVar(value);
    });

    this.sharedParams.addParamListener('gainMult', (value) => {
      this.synth.setGain(value);
    });

    const playParamName = (this.kind === 'player') ? 'playerEnabled' : 'performerEnabled';

    this.sharedParams.addParamListener(playParamName, (value) => {
      value ? this.enablePlay() : this.disablePlay();
    });

    this.motionInput.addListener('accelerationIncludingGravity', this.processAccelerationData);
  }

  processAccelerationData(data) {
    const accX = data[0];
    const accY = data[1];
    const accZ = data[2];

    const pitchAndRoll = this.pitchAndRoll;
    pitchAndRoll.estimateFromAccelerationIncludingGravity(accX, accY, accZ);

    const cutoffFactor = 1 - Math.max(0, Math.min(90, pitchAndRoll.pitch)) / 90;

    const maxRoll = 65;
    let positionFactor = Math.max(-maxRoll, Math.min(maxRoll, pitchAndRoll.roll)) / maxRoll;

    this.synth.setCutoffFactor(cutoffFactor);
    this.synth.setPositionFactor(positionFactor);

    this.renderer.setPosition(positionFactor);
  }

  enablePlay() {
    const recordingsConfig = this.sharedConfig.get('recordings');
    const numGroups = recordingsConfig.cyclic.num;

    this.sharedRecorder.addListener('cyclic', [client.index % numGroups], this.onCyclicBuffer);

    this.view.content.state = 'attention';
    this.view.render('.foreground');
  }

  disablePlay() {
    this.sharedRecorder.removeListener('cyclic');

    this.synth.stop(2);

    this.view.content.state = 'listen';
    this.view.render('.foreground');

    this.view.$el.style.backgroundColor = '#000000';
    this.currentColorIndex = undefined;

    this.view.removeRenderer(this.renderer);
  }

  onCyclicBuffer(buffer, phase) {
    this.synth.setBuffer(buffer);

    if (!this.synth.hasStarted) {
      this.synth.start();
      this.view.addRenderer(this.renderer);
    }

    // pick a new color
    let newColorIndex = Math.floor(Math.random() * colors.length);
    while (newColorIndex === this.currentColorIndex)
      newColorIndex  = Math.floor(Math.random() * colors.length);

    const backgroundColor = colors[newColorIndex];
    this.view.$el.style.backgroundColor = backgroundColor;
    this.currentColorIndex = newColorIndex;

    this.view.content.state = 'play';
    this.view.render('.foreground');
  }
}
