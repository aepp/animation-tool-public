import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './modules/App';
import {store, sagaMiddleware} from './store';
import rootSaga from './rootSaga';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

sagaMiddleware.run(rootSaga);
