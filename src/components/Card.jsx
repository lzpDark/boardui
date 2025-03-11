import React, {
	memo,
	useEffect,
	useRef,
} from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { CiTrash } from "react-icons/ci";

export const Card = memo(function Card({ item, onDelete }) {
	const ref = useRef(null);
	const { itemId, description, id } = item;

	useEffect(() => {
		const element = ref.current;
		return combine(
			draggable({
				element: element,
				getInitialData: () => ({ itemId: itemId }),
			}),
			dropTargetForElements({
				element: element,
				getData: () => ({ itemId: itemId }),
			}),
		);
	}, [itemId]);

	const handleClick = (e)=> {
		onDelete(id);
	}

	return (
		<div className="card" ref={ref}>
			<div className='flex flex-row justify-between items-end'>
				<div>{description}</div>
				<button onClick={handleClick}><CiTrash /></button>
			</div>
		</div>
	);
});
