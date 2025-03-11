import React, { memo, useEffect, useRef } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Card } from './Card';


export const Column = memo(({column, removeCard}) => {
	const columnId = column.columnId;
	const columnInnerRef = useRef(null);

	useEffect(() => {
		return combine(
			dropTargetForElements({
				element: columnInnerRef.current,
				getData: () => ({ columnId }),
			}),
		);
	}, [columnId]);

	return (
		<div className="min-h-24 column" ref={columnInnerRef}>
			<div className='mb-4'>
				<h3>{column.title}</h3>
			</div>
			<div >
				{column.items.map((item) => {
					return <Card onDelete={removeCard} item={item} key={item.itemId} />
				})}
			</div>
		</div>
	);
});