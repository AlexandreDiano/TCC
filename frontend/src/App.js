import React from "react";
import { Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { hot } from "react-hot-loader/root";
import { ThemeProvider, StylesProvider } from "@material-ui/styles";
import { PersistGate } from "redux-persist/integration/react";
import GlobalStyle from "./styles/global";
import { Wrapper } from "./styles/components";
import Routes from "./routes";
import { store, persistor } from "./store";
import defaultTheme from "./styles/theme";
import history from "~/routes/history";

function App() {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={defaultTheme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router history={history}>
              <>
                <Wrapper>
                  <Routes />
                </Wrapper>
                <ToastContainer />
                <GlobalStyle />
              </>
            </Router>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </StylesProvider>
  );
}

export default process.env.NODE_ENV === "development" ? hot(App) : App;
// export default App;
