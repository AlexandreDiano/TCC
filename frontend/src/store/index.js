import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import reducers from "./combineReducers";
import sagas from "./combineSagas";

const persistConfig = {
  key: "persistRoot",
  storage,
  whitelist: ["authentication"], // only navigation will be persisted
};

const middlewares = [];

// const sagaMonitor =
//   process.env.NODE_ENV === 'development'
//     ? console.tron.createSagaMonitor()
//     : null;

// const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
const sagaMiddleware = createSagaMiddleware();

// const tronMiddleware =
//   process.env.NODE_ENV === 'development'
//     ? console.tron.createEnhancer
//     : () => {};

middlewares.push(sagaMiddleware);

const persistedReducer = persistReducer(persistConfig, reducers);

const conditionStore =
  process.env.NODE_ENV === "development"
    ? createStore(
        persistedReducer,
        composeWithDevTools(applyMiddleware(...middlewares))
      )
    : createStore(persistedReducer, applyMiddleware(...middlewares));

const store = conditionStore;

const persistor = persistStore(store);

sagaMiddleware.run(sagas);

export { store, persistor };
