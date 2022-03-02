document.addEventListener('DOMContentLoaded', function () {
  new window.AnimationTool({
    container: document.getElementById('theVideo'),
    dataSetFileInput: document.getElementById('sessionFile'),
    appConfig: {
      standalone: false
    },
    frameUpdateCallback: frameIdx =>
      window.chart.xgrids([
        {
          value: Math.floor(frameIdx / 30),
          class: 'currentTime'
        }
      ])
  });
  window._AnimationToolInstance.create();
});
