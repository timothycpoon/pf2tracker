import { combineReducers } from 'redux';
import { getDefaultCreature } from '../utils';

const updateLogin = (state={}, {type, payload}) => {
    switch (type) {
        case 'UPDATE_LOGIN':
            return payload;
        default:
            return state;
    }
}

const updateCreatures = (state = [], {type, payload}) => {
    let id, key, value;
    switch (type) {
        case 'ADD_CREATURE':
            return [
                ...state,
                getDefaultCreature(),
            ]
        case 'UPDATE_CREATURES':
            ({
                id,
                key,
                value,
            } = payload);
            return [
                ...state.slice(0, id),
                {
                    ...state[id],
                    [key]: value,
                },
                ...state.slice(id + 1),
            ];
        case 'UPDATE_INIT':
            ({
                id,
                key,
                value,
            } = payload);
            return [
                ...state.slice(0, id),
                {
                    ...state[id],
                    initiative: {
                        ...state[id].initiative,
                        [key]: value,
                    },
                },
                ...state.slice(id + 1),
            ];
        case 'SORT_INIT':
            return state.slice().sort((a, b) => (b.initiative.rolled || 0) - (a.initiative.rolled || 0));
        default:
            return state;
    }
}

export default combineReducers({
  login: updateLogin,
  creatures: updateCreatures,
});
