document.addEventListener('DOMContentLoaded', function () {
  const animationToolInstance = new window.AnimationTool({
    container: document.getElementById('theVideo'),
    dataSetFileInput: document.getElementById('sessionFile'),
    appConfig: {
      standalone: false
    },
    frameUpdateCallback: async frameIdx => {
      window.chart.xgrids([
        {
          value: frameIdx / 30,
          class: 'currentTime'
        }
      ]);
    }
  });
  animationToolInstance.create();
});
