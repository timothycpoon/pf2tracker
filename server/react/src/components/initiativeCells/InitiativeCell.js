import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    TextField,
    Select,
    MenuItem,
} from '@material-ui/core';
import {
    updateInit,
} from '../../actions';

const InitiativeCell = ({
    id,
    initiative: {
        initSkill,
        rolled,
        ...skills
    },
}) => {
    const dispatch = useDispatch();

    return (
        <div className="cell initiative-cell">
            <Select
                className="init-input"
                classes={{
                    root: 'MuiOutlinedInput-inputMarginDense',
                }}
                variant="outlined"
                size="small"
                onChange={(e) => dispatch(updateInit(id, 'initSkill', e.target.value))}
                value={initSkill}
            >
                {Object.keys(skills).map(skill => <MenuItem className="skill-option" key={skill} value={skill}>{skill}</MenuItem>)}
            </Select>
            <TextField
                className="init-input num-field"
                type="number"
                variant="outlined"
                size="small"
                label="Bonus:"
                onChange={(e) => dispatch(updateInit(id, initSkill, parseInt(e.target.value)))}
                value={skills[initSkill] || 0}
            />
            <TextField
                className="init-input num-field"
                type="number"
                variant="outlined"
                size="small"
                label="Result:"
                onChange={(e) => dispatch(updateInit(id, 'rolled', parseInt(e.target.value)))}
                value={rolled || 0}
            />
        </div>
    );
}

export default InitiativeCell;
