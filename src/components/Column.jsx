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
		<div className='flex-1 bg-white p-4 rounded-lg shadow-md m-2' 
		  ref={columnInnerRef}
		>
			<div className='mb-4'>
				<h3>{column.title}</h3>
			</div>
			<div className="overflow-y-auto min-h-[480px] max-h-[480px] max-sm:min-h-24 max-sm:max-h-[200px]" >
				{column.items.map((item) => {
					return <Card onDelete={removeCard} item={item} key={item.itemId} />
				})}
			</div>
		</div>
	);
});