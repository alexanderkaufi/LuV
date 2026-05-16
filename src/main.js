import { luvData } from "../data/luv-data.js";
import { AppState } from "./state/appState.js";
import { AppView } from "./views/appView.js";

const appState = new AppState(luvData);
const appView = new AppView(luvData, appState);

appView.start();
