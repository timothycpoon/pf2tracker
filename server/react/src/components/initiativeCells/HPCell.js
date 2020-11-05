import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TextField } from '@material-ui/core';
import { updateCreatures } from '../../actions';

const HPCell = ({
    id,
    maxHP,
    currHP,
}) => {
    const dispatch = useDispatch();
    const updateHP = useCallback((id, key, value) => {
        const hp = {
            maxHP: maxHP,
            currHP: currHP,
            [key]: value,
        }
        dispatch(updateCreatures(id, 'hp', hp));
    }, [dispatch, currHP, maxHP]);

    return (
        <div className="cell hp-cell">
            <TextField
                className="num-field"
                size="small"
                type="number"
                variant="outlined"
                value={currHP}
                onChange={e => updateHP(id, 'currHP', parseInt(e.target.value))}
            />
            <span className="hp-slash">/</span>
            <TextField
                className="num-field"
                size="small"
                type="number"
                variant="outlined"
                value={maxHP}
                onChange={e => updateHP(id, 'maxHP', parseInt(e.target.value))}
            />
        </div>
    );
}

export default HPCell;
