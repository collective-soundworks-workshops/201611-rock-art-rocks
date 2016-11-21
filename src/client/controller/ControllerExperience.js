import * as soundworks from 'soundworks/client';

class ControllerExperience extends soundworks.BasicSharedController {
  constructor() {
    super();

    // buffers
    this.setGuiOptions('simpleBuffer', { type: 'buttons' });
    this.setGuiOptions('cyclicBuffer', { type: 'buttons' });

    // granular options
    this.setGuiOptions('periodAbs', { type: 'slider', size: 'large' });
    this.setGuiOptions('durationAbs', { type: 'slider', size: 'large' });
    this.setGuiOptions('positionVar', { type: 'slider', size: 'large' });
    this.setGuiOptions('gainMult', { type: 'slider', size: 'large' });

    this.setGuiOptions('playerEnabled', { show: false });
    this.setGuiOptions('performerEnabled', { show: false });
  }
}

export default ControllerExperience;
