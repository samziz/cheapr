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
    case 'SET_START_DATE':
        return {
            ...state,
            dates: {
            	start: {
            		...state.start,
            		date: action.payload
            	}
            }
        }
    case 'SET_START_MARGIN':
    	return {
            ...state,
            dates: {
            	start: {
            		...state.start,
            		giveOrTake: action.payload
            	}
            }
        }
    default:
        return state;
    }
}