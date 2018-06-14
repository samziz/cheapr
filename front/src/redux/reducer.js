import initialState from './state';

export default function (state = initialState, action) {
    switch (action.type) {
    case 'SET_CITIES':
        return {
            ...state,
            cities: action.payload,
        };
    case 'SET_ROUTE':
    	return {
    		...state,
    		route: action.payload
    	};
    case 'SET_START':
        return {
            ...state,
            start: action.payload
        }
    case 'SET_END': 
        return {
            ...state,
            end: action.payload
        }
    default:
        return state;
    }
}