import { useCallback, useState } from 'react';
import { baseUrl } from './constant'
import useApi from './api'

const useGlobalState = () => {

    const Api = useApi();

    function getBasicData() {
        const columnMap = {
            TODO: {
                title: '待完成📝',
                columnId: 'TODO',
                items: [],
            },
            Inprogress: {
                title: '进行中🔄',
                columnId: 'Inprogress',
                items: []
            },
            Done: {
                title: '已完成✅',
                columnId: 'Done',
                items: []
            },
        };

        const orderedColumnIds = ['TODO', 'Inprogress', 'Done'];

        return {
            columnMap,
            orderedColumnIds,
        };
    }

    const stateOfColumnId = {
        'TODO': 0,
        'Inprogress': 1,
        'Done': 2,
    };

    const [data, setData] = useState(() => {
        return getBasicData();
    });

    const reorderCard = useCallback(
        ({
            columnId,
            startIndex,
            finishIndex
        }) => {
            // call update task api
            fetch(`${baseUrl}/task/reorder`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    state: stateOfColumnId[columnId],
                    fromId: data.columnMap[columnId].items[startIndex].id,
                    toId: data.columnMap[columnId].items[finishIndex].id,
                }),
                credentials: 'include',
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`reorder failed: ${response.status}`)
                    }
                })
                .then(json => {
                    // successful update db, update state
                    setData((data) => {
                        // swap
                        const columnData = data.columnMap[columnId];
                        const newItems = [...columnData.items];
                        [newItems[startIndex], newItems[finishIndex]] = [newItems[finishIndex], newItems[startIndex]];
                        // update to state
                        return {
                            ...data,
                            columnMap: {
                                ...data.columnMap,
                                [columnId]: {
                                    ...data.columnMap[columnId],
                                    items: newItems,
                                },
                            },
                        }
                    })
                })

        },
        [data]
    );

    const moveCard = useCallback(
        ({
            startColumnId,
            finishColumnId,
            itemIndexInStartColumn,
            itemIndexInFinishColumn,
        }) => {
            fetch(`${baseUrl}/task/moveitem`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fromState: stateOfColumnId[startColumnId],
                    toState: stateOfColumnId[finishColumnId],
                    fromId: data.columnMap[startColumnId].items[itemIndexInStartColumn].id,
                    toId: data.columnMap[finishColumnId].items.length <= itemIndexInFinishColumn ? null : data.columnMap[finishColumnId].items[itemIndexInFinishColumn].id
                }),
                credentials: 'include',
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`move item failed: ${response.status}`)
                }
            })
                .then(json => {
                    setData((data) => {
                        // move item in state
                        const startColumnItems = [...data.columnMap[startColumnId].items];
                        const finishColumnItems = [...data.columnMap[finishColumnId].items];
                        const startItem = startColumnItems[itemIndexInStartColumn];
                        startColumnItems.splice(itemIndexInStartColumn, 1);
                        finishColumnItems.splice(itemIndexInFinishColumn, 0, startItem);
                        // update to state
                        return {
                            ...data,
                            columnMap: {
                                ...data.columnMap,
                                [startColumnId]: {
                                    ...data.columnMap[startColumnId],
                                    items: startColumnItems,
                                },
                                [finishColumnId]: {
                                    ...data.columnMap[finishColumnId],
                                    items: finishColumnItems,
                                }
                            }
                        }
                    })
                })
        },
        [data]
    );

    const addCard = useCallback(
        ({ columnId, description }) => {

            // call api to add item
            fetch(`${baseUrl}/task`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    state: stateOfColumnId[columnId],
                    description: description,
                }),
                credentials: 'include',
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`add item failed, ${response.status}`);
                    }
                })
                .then(json => {
                    const columnData = data.columnMap[columnId];
                    const newItems = columnData.items.concat({
                        ...json,
                        itemId: json.id,
                    })
                    setData((data) => ({
                        ...data,
                        columnMap: {
                            ...data.columnMap,
                            [columnId]: {
                                ...data.columnMap[columnId],
                                items: newItems,
                            }
                        }
                    }))
                });
        },
        [data]
    );

    const removeCard = useCallback((id) => {
        fetch(`${baseUrl}/task/${id}`, {
            method: "DELETE",
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    return "success";
                } else {
                    throw new Error(`delete item succeed, ${response.status}`);
                }
            })
            .then(res => {
                // update state
                let state;
                let columnId;
                const inTodo = data.columnMap.TODO.items.filter(i => i.id === id);
                if (inTodo.length > 0) {
                    state = 0;
                    columnId = 'TODO';
                }
                const inProgress = data.columnMap.Inprogress.items.filter(i => i.id === id);
                if (inProgress.length > 0) {
                    state = 1;
                    columnId = 'Inprogress';
                }
                const inDone = data.columnMap.Done.items.filter(i => i.id === id);
                if (inDone.length > 0) {
                    state = 2;
                    columnId = 'Done';
                }
                const newItems = data.columnMap[columnId].items.filter(i => i.id !== id);
                setData((data) => {
                    const x = {
                        ...data,
                        columnMap: {
                            ...data.columnMap,
                            [columnId]: {
                                ...data.columnMap[columnId],
                                items: newItems,
                            }
                        }
                    }
                    return x;
                })
            })
    }, [data]);

    const loadData = useCallback(() => {
        Api.getAllTask({
            onSucceed: (taskList) => {
                const exchange = (originList, state) => {
                    if(originList == null || originList.length === 0) {
                        return [];
                    }
                    return originList
                        .filter(i => i.state === state)
                        .map(i => ({
                            ...i,
                            itemId: i.id,
                        }))
                        .sort((a, b) => a.positionId - b.positionId);
                }
                const todoTaskList = exchange(taskList, 0);
                const inprogressTaskList = exchange(taskList, 1);
                const doneTaskList = exchange(taskList, 2);
                setData((data) => {
                    return {
                        ...data,
                        columnMap: {
                            TODO: {
                                ...data.columnMap.TODO,
                                items: todoTaskList,
                            },
                            Inprogress: {
                                ...data.columnMap.Inprogress,
                                items: inprogressTaskList,
                            },
                            Done: {
                                ...data.columnMap.Done,
                                items: doneTaskList,
                            }
                        }
                    }
                })
            },
        })
    }, [data])



    return {
        data,
        reorderCard,
        moveCard,
        addCard,
        removeCard,
        loadData,
    }
}


export default useGlobalState;