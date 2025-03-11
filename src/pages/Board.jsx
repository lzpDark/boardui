import React, { useEffect, useRef } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Column } from '../components/Column';
import useGlobalState from '../shared/state.js'

export default function Board() {
 
	const globalState = useGlobalState();
	const data = globalState.data;
	const reorderCard = globalState.reorderCard;
	const moveCard = globalState.moveCard;
	const addCard = globalState.addCard;
	const loadData = globalState.loadData;
	const removeCard = globalState.removeCard;

	useEffect(() => {
		loadData();
	}, [])

	useEffect(() => {
		return combine(
			monitorForElements({
				// source.data is data from 'draggable::getInitialData' of 'dragging element'
				// location.initial.dropTargets -> targets of 'drag from', in this case include : 1. card, 2. column
				// location.current.dropTargets -> targets of 'drag to', in this case include : 1. card 2. column
				onDrop({ location, source }) {
					if (location.current.dropTargets.length < 1) {
						return;
					}
					if (location.current.dropTargets.length == 1) { // drag to place where only exists column, so: 1.no cards in column 2. or drag to column bottom
						const [, columnSourceTarget] = location.initial.dropTargets;
						const [columnDestinationTarget] = location.current.dropTargets;
						const fromColumnId = columnSourceTarget.data.columnId;
						const fromItemId = source.data.itemId;
						const fromIndex = data.columnMap[fromColumnId].items.findIndex(i => i.itemId === fromItemId);
						const toColumnId = columnDestinationTarget.data.columnId;
						const toIndex = data.columnMap[toColumnId].items.length;
						if (fromColumnId !== toColumnId) {
							// move card
							moveCard({
								startColumnId: fromColumnId,
								finishColumnId: toColumnId,
								itemIndexInStartColumn: fromIndex,
								itemIndexInFinishColumn: toIndex,
							})
						} else {
							// drap to bottom in current column, do nothing
						}

					} else { // drag to place where exists column and card.
						const [, columnSourceTarget] = location.initial.dropTargets;
						const [cardDestinationTarget, columnDestinationTarget] = location.current.dropTargets;

						const fromColumnId = columnSourceTarget.data.columnId;
						const fromItemId = source.data.itemId;
						const fromIndex = data.columnMap[fromColumnId].items.findIndex(i => i.itemId === fromItemId);
						const toColumnId = columnDestinationTarget.data.columnId;
						const toItemId = cardDestinationTarget.data.itemId;
						const toIndex = data.columnMap[toColumnId].items.findIndex(i => i.itemId === toItemId);

						if (fromColumnId == toColumnId) {
							// reorder card
							reorderCard({
								columnId: fromColumnId,
								startIndex: fromIndex,
								finishIndex: toIndex,
							})
						} else {
							// move card
							moveCard({
								startColumnId: fromColumnId,
								finishColumnId: toColumnId,
								itemIndexInStartColumn: fromIndex,
								itemIndexInFinishColumn: toIndex,
							})
						}
					}
				}
			})
		);
	}, [data, moveCard, reorderCard]);

	const CardInput = ({ addCard }) => {
		const descriptionRef = useRef(null);
		const handleClick = (e) => {
			addCard({
				columnId: "TODO",
				description: descriptionRef.current.value,
			})
		}
		return (
			<div className="flex justify-center items-center w-full">
				<input
					type='text'
					className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					placeholder='任务描述'
					ref={descriptionRef} />


				<button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
					onClick={handleClick}>
					添加
				</button>
			</div>
		);
	}

	return (
		<div className='container'>
			<div className='menu'>
				<CardInput addCard={addCard} />
			</div>
			<div className="boardStyles">
				{data.orderedColumnIds.map((columnId) => {
					return <Column removeCard={removeCard} column={data.columnMap[columnId]} key={columnId} />;
				})}
			</div>
		</div>

	);
}
