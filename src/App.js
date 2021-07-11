import './App.css';
import React,{useState} from 'react'
import {v4} from 'uuid'
import {DragDropContext,Draggable,Droppable} from "react-beautiful-dnd";
import _ from 'lodash'

function App() {
  const item={
    id:v4(),
    name:'Clean the house'
  }
  const item2={
    id:v4(),
    name:'Wash the car'
  }

  const [state,setState]=useState({
    todo:{
      title:'Todo',
      item:[item,item2]
    },
    inProgress:{
      title:'In Progress',
      item:[]
    },
    done:{
      title:'Completed',
      item:[]
    }
  })

  const [text,setText]=useState('')

  const dndHandler=(result)=>{
    const {destination,source}=result
    if(!destination){
      return console.log('out')
    }
    if(source.droppableId!==destination.droppableId){
      const sourceList=state[source.droppableId]
      const destList=state[destination.droppableId]
      const sourceItem=[...sourceList.item]
      const destItem=[...destList.item]
      const [removed]=sourceItem.splice(source.index,1)
      destItem.splice(destination.index,0,removed)
      setState({
        ...state,
        [source.droppableId]:{
          ...sourceList,
          item:sourceItem
        },
        [destination.droppableId]:{
          ...destList,
          item:destItem
        }
      })
    }else {
        const list=state[source.droppableId]
        const itemCopy=[...list.item]
        const [removed]=itemCopy.splice(source.index,1)
        itemCopy.splice(destination.index,0,removed)
        setState({
          ...state,
          [source.droppableId]:{
            ...list,
            item:itemCopy
          }
        })
    }


  }
  const inputHandler=(event)=>{
    setText(event.target.value)
  }

  const addHandler=()=>{
    setState({
      ...state,
      todo:{
        ...state.todo,
        item: [...state.todo.item,{id:v4(),name: text}]
      }
    })
  }


  return (
      <React.Fragment>
        <div className="App">
          <DragDropContext onDragEnd={(result)=>dndHandler(result)}>
            {_.map(state,(data,key)=>{
              return(
                  <div className={'list'}>
                    <span style={{fontWeight:'bold',fontSize:16}}>{data.title}</span>
                    <Droppable droppableId={key}>
                      {(provided,snapshot)=>{
                        return(
                            <div ref={provided.innerRef}
                                 {...provided.droppableProps}
                            >
                              {data.item.map((item,index)=>{
                                return(
                                    <Draggable draggableId={item.id} index={index} key={item.id}>
                                      {(provided,snapshot)=>{
                                        return (
                                            <div ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 {...provided.dragHandleProps}
                                                 className={'item'}
                                            >
                                              {item.name}
                                            </div>
                                        )
                                      }}
                                    </Draggable>
                                )
                              })}
                              {provided.placeholder}
                            </div>
                        )
                      }}
                    </Droppable>
                  </div>

              )
            })}
          </DragDropContext>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:'200px'}}>
          <input type="text" value={text} onChange={inputHandler}/>
          <button onClick={addHandler}>add</button>
        </div>
      </React.Fragment>
  );
}

export default App;
