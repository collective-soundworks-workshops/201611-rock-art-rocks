import * as soundworks from 'soundworks/client';

const template = `
  <div class="foreground">
    <div class="section-top"></div>
    <div class="section-center flex-center">
      <p><%= msg %></p>
    </div>
    <div class="section-bottom"></div>
  </div>
`;

class RecorderExperience extends soundworks.Experience {
  constructor() {
    super();

    this.sharedRecorder = this.require('shared-recorder', { recorder: true });
    this.sharedParams = this.require('shared-params');
    this.sharedConfig = this.require('shared-config', {
      items: ['recordings'],
    });

    this.onSimpleBufferEvent = this.onSimpleBufferEvent.bind(this);
    this.onCyclicBufferEvent = this.onCyclicBufferEvent.bind(this);
  }

  init() {
    this.viewTemplate = template;
    this.viewCtor = soundworks.SegmentedView;
    this.viewContent = {
      msg: 'wait',
    }

    this.view = this.createView();
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    const recordingsConfig = this.sharedConfig.get('recordings');

    for (let name in recordingsConfig) {
      const { duration, period, num, cyclic } = recordingsConfig[name];
      this.sharedRecorder.createBuffer(name, duration, period, num, cyclic);
    }

    this.show();

    this.sharedParams.addParamListener('simpleBuffer', this.onSimpleBufferEvent);
    this.sharedParams.addParamListener('cyclicBuffer', this.onCyclicBufferEvent);
  }

  onSimpleBufferEvent(value) {
    if (value === 'record')
      this.sharedRecorder.startRecord('simple');
    else
      this.sharedRecorder.stopRecord('simple');

    this.view.content.msg = `simple - ${value}`;
    this.view.render('.section-center');
  }

  onCyclicBufferEvent(value) {
    if (value === 'record')
      this.sharedRecorder.startRecord('cyclic');
    else
      this.sharedRecorder.stopRecord('cyclic');

    this.view.content.msg = `cyclic - ${value}`;
    this.view.render('.section-center');
  }
}

export default RecorderExperience;
