import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
// eslint-disable-next-line no-unused-vars
import {Task} from 'redux-saga';
import {HashRouter} from 'react-router-dom';
import {ScopedCssBaseline} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import App from './react/modules/App';
import {initStore, initSagas} from './react/store';
import rootSaga from './react/rootSaga';
import {theme} from './react/theme/muiTheme';
import {setAppConfig} from './react/modules/App/actions';
import {setDataFile} from './react/views/Visualization/modules/Upload/actions';
import {
  updateCurrentFrameIdx,
  updateCurrentFrameIdxToThree
} from './react/views/Visualization/modules/AnimationControls/actions';

/**
 * @class
 */
class AnimationTool {
  _store;
  _sagaMiddleware;

  /**
   *
   * @type {boolean}
   * @private
   */
  _isCreated = false;

  /**
   * @type {HTMLElement}
   * @private
   */
  _container = document.getElementById('root');

  /**
   * @type {HTMLElement | undefined}
   * @private
   */
  _dataSetFileInput = undefined;

  /**
   *
   * @type {{standalone: boolean}}
   * @private
   */
  _config = {
    standalone: true
  };

  /**
   *
   * @type {Task}
   * @private
   */
  _rootSagaTask;

  /**
   * Can be used to update anything in external context when three js renders new animation frame
   * @param {number} frameIdx
   * @public
   */
  frameUpdateCallback(frameIdx) {}

  /**
   * @type {number}
   * @private
   */
  _frameUpdateCallbackThrottleTimeout;

  /**
   * Can be called from external context to update the index of the frame currently being rendered
   * @param {number} frameIdx
   * @public
   */
  updateFrameIdx(frameIdx) {
    this._store.dispatch(updateCurrentFrameIdx(frameIdx));
    this._store.dispatch(updateCurrentFrameIdxToThree(frameIdx));
  }

  constructor(
    {
      container = undefined,
      appConfig = undefined,
      dataSetFileInput = undefined,
      frameUpdateCallback = () => {},
      frameUpdateCallbackThrottleTimeout = 1000
    } = {
      container: undefined,
      appConfig: undefined,
      dataSetFileInput: undefined,
      frameUpdateCallback: () => {},
      frameUpdateCallbackThrottleTimeout: 1000
    }
  ) {
    if (container !== undefined) {
      container =
        typeof container === 'object' && container.nodeType !== undefined
          ? container
          : document.querySelector(container);

      this._container = container || this._container;
      this.frameUpdateCallback = frameUpdateCallback;
      this._frameUpdateCallbackThrottleTimeout =
        frameUpdateCallbackThrottleTimeout;
    }

    this._dataSetFileInput = dataSetFileInput;
    this._sagaMiddleware = initSagas();
    this._store = initStore(this._sagaMiddleware);
    this.config = appConfig || this._config;

    // create global variable to access this instance from external context
    window._AnimationToolInstance = this;
    return this;
    this._frameUpdateCallbackThrottleTimeout =
      frameUpdateCallbackThrottleTimeout;
  }

  /**
   * @public
   * @returns {AnimationTool}
   */
  create() {
    if (!this._container || !this._container instanceof HTMLElement) {
      console.error('You need to set container for the animation tool first.');
      return this;
    }

    this.configureDataSetFileInput();

    ReactDOM.render(
      <React.StrictMode>
        <HashRouter>
          <Provider store={this._store}>
            <ScopedCssBaseline style={{height: '100%'}}>
              <ThemeProvider theme={theme}>
                <App />
              </ThemeProvider>
            </ScopedCssBaseline>
          </Provider>
        </HashRouter>
      </React.StrictMode>,
      this.container
    );

    this._rootSagaTask = this._sagaMiddleware.run(rootSaga);
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
   * @returns {{standalone: boolean}}
   */
  get config() {
    return this._config;
  }

  /**
   * @public
   * @param {{standalone: boolean}} value
   */
  set config(value) {
    this._config = {...this._config, ...value};
    this._store.dispatch(setAppConfig(this._config));
  }

  /**
   * @public
   * @returns {number}
   */
  get frameUpdateCallbackThrottleTimeout() {
    return this._frameUpdateCallbackThrottleTimeout;
  }

  /**
   * @public
   * @param {number} value
   */
  set frameUpdateCallbackThrottleTimeout(value) {
    this._frameUpdateCallbackThrottleTimeout = value;
  }

  /**
   * If provided through {AnimationTool} constructor or as method parameter,
   * this method configures external file input to act as dataset input element
   *
   * @param {HTMLElement | string} [value]
   * @returns {AnimationTool}
   */
  configureDataSetFileInput(value) {
    if (value) this._dataSetFileInput = value;

    let fileInputEl;
    if (typeof this._dataSetFileInput === 'string') {
      fileInputEl = document.querySelector(this._dataSetFileInput);
    } else if (this._dataSetFileInput instanceof HTMLElement) {
      fileInputEl = this._dataSetFileInput;
    }

    if (fileInputEl) {
      fileInputEl.addEventListener('change', e => {
        this._store.dispatch(setDataFile(e.target.files[0]));
      });
    }
    return this;
  }
}

export default AnimationTool;
