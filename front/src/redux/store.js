import { createStore } from 'redux';
import initialState from './state';
import { loadState, saveState } from './local';
import reducer from './reducer';

let store;

store = createStore(
    reducer,
    { ...loadState() || initialState },
);

store.subscribe(() => {
    saveState(store.getState());
});

export default store;