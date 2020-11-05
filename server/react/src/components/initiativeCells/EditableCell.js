import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    TextField,
} from '@material-ui/core';
import {
    updateCreatures,
} from '../../actions';

const InitiativeCell = ({
    id,
    accessor,
    value,
    className,
    allowText,
}) => {
    const dispatch = useDispatch();

    return (
        <div className="cell editable-cell">
            <TextField
                className={allowText ? '' : 'num-field'}
                type={allowText ? 'input' : 'number'}
                variant="outlined"
                size="small"
                onChange={(e) => dispatch(updateCreatures(id, accessor, allowText ? e.target.value : parseInt(e.target.value)))}
                value={value}
            />
        </div>
    );
}

export default InitiativeCell;
