import initialState from './state';

export default function (state = initialState, action) {
    switch (action.type) {
    case 'SET_ITEMS':
        return {
            ...state,
            cities: action.payload,
        };
    default:
        return state;
    }
}