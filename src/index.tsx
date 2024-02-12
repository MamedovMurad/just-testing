import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store";
import AsanLogin from "./AsanLogin";
import reportWebVitals from "./reportWebVitals";

import { getIsDarkMode } from "utils/localStorage";

AsanLogin();

document.querySelector("body")?.classList.add(getIsDarkMode() ? "dark" : "light");

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</BrowserRouter>
	</Provider>,
	document.getElementById("root")
);

reportWebVitals();
