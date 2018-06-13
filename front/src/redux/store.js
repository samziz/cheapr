import { createStore } from 'redux';
import reducer from './reducer';
import { loadState, saveState } from './local';

let store;

store = createStore(
    reducer,
    { ...loadState() },
);

store.subscribe(() => {
    saveState(store.getState());
});

export default store;