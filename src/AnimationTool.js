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
import {setAppConfig} from './react/modules/App/actions';

export class AnimationTool {
  /**
   *
   * @type {boolean}
   * @private
   */
  _isCreated = false;

  /**
   * @type {HTMLElement | null}
   * @private
   */
  _container = document.getElementById('root');

  /**
   *
   * @type {{withAppBar: boolean, standalone: boolean}}
   * @private
   */
  _config = {
    standalone: true,
    withAppBar: true
  };

  /**
   *
   * @type {Task}
   * @private
   */
  _rootSagaTask;

  constructor(
    {container = undefined, appConfig = undefined} = {
      container: undefined,
      appConfig: undefined
    }
  ) {
    if (container !== undefined) {
      container =
        typeof container === 'object' && container.nodeType !== undefined
          ? container
          : document.querySelector(container);

      this._container = container || this._container;
    }

    this.config = appConfig || this._config;

    this.create();
  }

  /**
   * @public
   * @returns {AnimationTool}
   */
  create() {
    if (!this.container || !this.container instanceof HTMLElement) {
      console.error('You need to set container for the animation tool first.');
      return this;
    }

    ReactDOM.render(
      <React.StrictMode>
        <HashRouter>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <GlobalStyles
                styles={{body: {backgroundColor: BACKGROUND_COLOR}}}
              />
              <App />
            </ThemeProvider>
          </Provider>
        </HashRouter>
      </React.StrictMode>,
      this.container
    );

    this._rootSagaTask = sagaMiddleware.run(rootSaga);
    this._isCreated = true;
    return this;
  }

  /**
   * @public
   * @returns {AnimationTool}
   */
  destroy() {
    ReactDOM.unmountComponentAtNode(this.container);
    this._rootSagaTask.cancel();
    this._isCreated = false;
    return this;
  }

  /**
   * @public
   * @returns {HTMLElement|null}
   */
  get container() {
    return this._container;
  }

  /**
   * @public
   * @param {HTMLElement|null} value
   */
  set container(value) {
    this._container = value;
  }

  /**
   * @public
   * @returns {{withAppBar: boolean, standalone: boolean}}
   */
  get config() {
    return this._config;
  }

  /**
   * @public
   * @param {{withAppBar: boolean, standalone: boolean}} value
   */
  set config(value) {
    this._config = {...this._config, ...value};
    store.dispatch(setAppConfig(this._config));
  }
}

export default AnimationTool;

// create global variable for manual instantiation of the app
window.AnimationTool = AnimationTool;
