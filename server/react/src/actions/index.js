export const updateLogin = payload => ({
    type: 'UPDATE_LOGIN',
    payload,
});

export const updateCreatures = (id, key, value) => ({
    type: 'UPDATE_CREATURES',
    payload: {id, key, value},
});

export const updateInit = (id, key, value) => ({
    type: 'UPDATE_INIT',
    payload: {id, key, value},
});

export const sortInit = () => ({
    type: 'SORT_INIT',
});

export const addCreature = () => ({
    type: 'ADD_CREATURE',
});
