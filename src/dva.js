import {create} from 'dva-core';
import createLoading from 'dva-loading';
import immer from 'dva-immer';
import {createLogger} from 'redux-logger';

let app;
let store;
let dispatch;
let registered = false;

function createApp(opt) {
  // redux 的日志
  if (__DEV__) {
    opt.onAction = [createLogger()];
  }
  app = create(opt);
  app.use(immer());
  app.use(createLoading());
  app.use({
    onError(err) {
      console.warn('dvaError', err);
    },
  });
  // if (!registered) {
  opt.models.forEach(model => {
    app.model(model);
  });
  // }
  // registered = true;
  app.start();
  store = app._store;
  app.getStore = () => store;
  dispatch = store.dispatch;
  app.dispatch = dispatch;
  if (global) {
    global.dva_app = app;
  }
  return app;
}

export default {
  createApp,
  getDispatch() {
    return app.dispatch;
  },
};
