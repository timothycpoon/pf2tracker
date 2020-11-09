import React, { useMemo, memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTable } from 'react-table';
import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Button,
} from '@material-ui/core';
import {
	addCreature,
	updateInit,
	sortInit,
} from '../actions';

import HPCell from './initiativeCells/HPCell';
import InitiativeCell from './initiativeCells/InitiativeCell';
import EditableCell from './initiativeCells/EditableCell';

const Initiative = () => {
	const creatures = useSelector(state => state.creatures);
	const columns = useMemo(() => ([
	{
		accessor: "name",
		Header: "Name",
		Cell: ({
			row: {
				index,
			},
			value,
		}) => <EditableCell id={index} allowText accessor="name" value={value} />,
	},
	{
		accessor: "hp",
		Header: "HP",
		Cell: ({
			row: {
				index,
			},
			value: {
				maxHP,
				currHP,
			},
		}) => <HPCell id={index} maxHP={maxHP} currHP={currHP} />,
	},
	{
		accessor: "ac",
		Header: "AC",
		Cell: ({
			row: {
				index,
			},
			value,
		}) => <EditableCell id={index} accessor="ac" value={value} />,
	},
	{
		accessor: "fortitude",
		Header: "Fortitude",
		Cell: ({
			row: {
				index,
			},
			value,
		}) => <EditableCell id={index} accessor="fortitude" value={value} />,
	},
	{
		accessor: "reflex",
		Header: "Reflex",
		Cell: ({
			row: {
				index,
			},
			value,
		}) => <EditableCell id={index} accessor="reflex" value={value} />,
	},
	{
		accessor: "will",
		Header: "Will",
		Cell: ({
			row: {
				index,
			},
			value,
		}) => <EditableCell id={index} accessor="will" value={value} />,
	},
	{
		accessor: "initiative",
		Header: "Initiative",
		Cell: ({
			row: {
				index,
			},
			value,
		}) => <InitiativeCell id={index} initiative={value} />,
	},
	]), []);
	const data = useMemo(() => creatures, [creatures]);
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns,
		data,
	});
	const dispatch = useDispatch();
	const rollInit = useCallback(() => {
		creatures.forEach((creature, idx) => {
			const initMod = creature.initiative[creature.initiative.initSkill] || 0;
			const initRoll = Math.floor(Math.random() * 19) + initMod + 1;
			dispatch(updateInit(idx, 'rolled', initRoll));
		});
		dispatch(sortInit());
	}, [creatures, dispatch]);

	return (
		<React.Fragment>
			<Table {...getTableProps()}>
				<TableHead>
				{headerGroups.map(headerGroup => (
					<TableRow {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map(column => (
						<TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
						))}
					</TableRow>
					))}
				</TableHead>
				<TableBody {...getTableBodyProps()}>
				{rows.map((row, i) => {
					prepareRow(row)
					return (
						<TableRow hover {...row.getRowProps()}>
						{row.cells.map(cell => {
							return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
						})}
						</TableRow>
					);
				})}
				</TableBody>
			</Table>
			<Button
				variant="outlined"
				onClick={() => dispatch(addCreature())}
			>
				+
			</Button>
			<Button
				variant="outlined"
				onClick={rollInit}
			>
				Roll Initiative!
			</Button>
		</React.Fragment>
	);
}

export default memo(Initiative);

