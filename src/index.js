import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {HashRouter} from 'react-router-dom';

import {GlobalStyles} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import App from './react/modules/App';
import {store, sagaMiddleware} from './react/store';
import rootSaga from './react/rootSaga';
import {theme} from './react/theme/muiTheme';
import {BACKGROUND_COLOR} from './react/theme/constants';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <GlobalStyles styles={{body: {backgroundColor: BACKGROUND_COLOR}}} />
          <App />
        </ThemeProvider>
      </Provider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

sagaMiddleware.run(rootSaga);
