import * as soundworks from 'soundworks/client';

const template = `
  <div class="foreground">
    <div class="section-top"></div>
    <div class="section-center">
      <% if (performerBtnEnabled) { %>
        <button class="btn active" id="performer-btn">Performers Playing</button>
      <% } else { %>
        <button class="btn" id="performer-btn">Performers Muted</button>
      <% } %>

      <% if (playerBtnEnabled) { %>
        <button class="btn active" id="player-btn">Players Playing</button>
      <% } else { %>
        <button class="btn" id="player-btn">Players Muted</button>
      <% } %>
    </div>
    <div class="section-bottom"></div>
  </div>
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
  }

  init() {
    this.viewTemplate = template;
    this.viewOptions = {
      ratios: {
        '.section-top': 0.1,
        '.section-center': 0.8,
        '.section-bottom': 0.1,
      }
    }
    this.viewCtor = soundworks.SegmentedView;
    this.viewContent = {
      playerBtnEnabled: this.playerBtnEnabled, // Playing
      performerBtnEnabled: this.performerBtnEnabled, // Playing
    };

    this.viewEvents = {
      'touchstart #player-btn': this.onPlayerBtnClick.bind(this),
      'touchstart #performer-btn': this.onPerformerBtnClick.bind(this),
    };

    this.view = this.createView();
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.sharedParams.addParamListener('playerEnabled', (value) => {
      this.playerBtnEnabled = value;
      this.view.content.playerBtnEnabled = this.playerBtnEnabled;
      this.view.render();
    });

    this.sharedParams.addParamListener('performerEnabled', (value) => {
      this.performerBtnEnabled = value;
      this.view.content.performerBtnEnabled = this.performerBtnEnabled;
      this.view.render();
    });

    this.show();
  }

  onPlayerBtnClick() {
    this.playerBtnEnabled = !this.playerBtnEnabled;
    this.sharedParams.update('playerEnabled', this.playerBtnEnabled);

    this.view.content.playerBtnEnabled = this.playerBtnEnabled;
    this.view.render();
  }

   onPerformerBtnClick() {
    this.performerBtnEnabled = !this.performerBtnEnabled;
    this.sharedParams.update('performerEnabled', this.performerBtnEnabled);

    this.view.content.performerBtnEnabled = this.performerBtnEnabled;
    this.view.render();
  }
}

export default SoloistExperience;
