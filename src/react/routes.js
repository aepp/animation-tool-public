const externalLocationSameOrigin = path => `${window.location.origin}/${path}`;

export const routes = {
  root: '/',
  estimate: '/estimateFromVideo',
  external: {
    demo: externalLocationSameOrigin('integrations-demo'),
    docs: externalLocationSameOrigin('jsdoc')
  }
};

export default routes;

export const routeLabels = {
  [routes.root]: '',
  [routes.estimate]: 'Estimate pose from video'
};
