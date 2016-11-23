import * as soundworks from 'soundworks/client';


const template = `
  <div class="section-top"></div>
  <div class="section-center">
    <div class="refresh-wrapper">
      <!--
      <% if (performerBtnEnabled) { %>
        <button class="btn active" id="performer-btn">Performers Playing</button>
      <% } else { %>
        <button class="btn" id="performer-btn">Performers Muted</button>
      <% } %>
      -->

      <% if (playerBtnEnabled) { %>
        <button class="btn active" id="player-btn">Playing</button>
      <% } else { %>
        <button class="btn" id="player-btn">Muted</button>
      <% } %>
    </div>

    <label>
      Output Gain
      <input class="slider" type="range" id="output-gain" min="-17" max="26" step="1" />
    </label>

    <button class="btn" id="force-mute">Force Mute</button>
    <button class="btn" id="reset">Reset</button>
  </div>
  <div class="section-bottom"></div>
`;

class SoloistExperience extends soundworks.Experience {
  constructor() {
    super();

    this.sharedParams = this.require('shared-params');
    this.sharedConfig = this.require('shared-config', {
      items: ['recordings'],
    });

    this.playerBtnEnabled = false;
    this.performerBtnEnabled = false;

    this.defaults = {
      outputGain: -6, // dB
    }
  }

  init() {
    this.viewTemplate = template;
    this.viewOptions = {
      ratios: {
        '.section-top': 0.05,
        '.section-center': 0.9,
        '.section-bottom': 0.05,
      }
    }
    this.viewCtor = soundworks.SegmentedView;
    this.viewContent = {
      playerBtnEnabled: this.playerBtnEnabled, // Playing
      performerBtnEnabled: this.performerBtnEnabled, // Playing
    };

    this.viewEvents = {
      'touchstart #player-btn': this.onPlayerBtnTouch.bind(this),
      'touchstart #performer-btn': this.onPerformerBtnTouch.bind(this),

      // gains
      'input #output-gain': this.onOutputGainInput.bind(this),

      // danger zone
      'touchstart #force-mute': this.onForceMuteTouch.bind(this),
      'touchstart #reset': this.onResetTouch.bind(this),
    };

    this.view = this.createView();
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.show();

    this.sharedParams.addParamListener('playerEnabled', (value) => {
      this.playerBtnEnabled = value;
      this.view.content.playerBtnEnabled = this.playerBtnEnabled;
      this.view.render('.refresh-wrapper');
    });

    this.sharedParams.addParamListener('performerEnabled', (value) => {
      this.performerBtnEnabled = value;
      this.view.content.performerBtnEnabled = this.performerBtnEnabled;
      this.view.render('.refresh-wrapper');
    });

    this.sharedParams.addParamListener('outputGain', (value) => {
      this._setOutputGain(value);
    });

    // // set default value
    // this._setOutputGain(this.defaults.outputGain);
  }

  onPlayerBtnTouch() {
    this.playerBtnEnabled = !this.playerBtnEnabled;
    this.sharedParams.update('playerEnabled', this.playerBtnEnabled);

    this.view.content.playerBtnEnabled = this.playerBtnEnabled;
    this.view.render('.refresh-wrapper');
  }

  onPerformerBtnTouch() {
    this.performerBtnEnabled = !this.performerBtnEnabled;
    this.sharedParams.update('performerEnabled', this.performerBtnEnabled);

    this.view.content.performerBtnEnabled = this.performerBtnEnabled;
    this.view.render('.refresh-wrapper');
  }

  onForceMuteTouch() {
    this._forceMute();
  }

  _forceMute() {
    this.playerBtnEnabled = false;
    this.performerBtnEnabled = false;

    this.sharedParams.update('playerEnabled', this.playerBtnEnabled);
    this.sharedParams.update('performerEnabled', this.performerBtnEnabled);

    this.view.content.playerBtnEnabled = this.playerBtnEnabled;
    this.view.content.performerBtnEnabled = this.performerBtnEnabled;
    this.view.render('.refresh-wrapper');
  }


  onOutputGainInput(e) {
    const gain = e.target.value;
    this.sharedParams.update('outputGain', gain);
  }

  onResetTouch() {
    const gain = this.defaults.outputGain;
    this._setOutputGain(gain);
    this.sharedParams.update('outputGain', gain);

    this._forceMute();
  }

  _setOutputGain(value) {
    const $outputGain = this.view.$el.querySelector('#output-gain');
    $outputGain.value = value;
  }
}

export default SoloistExperience;
