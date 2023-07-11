import { useRecoilState, useRecoilValue } from "recoil";
import { catagoryState, toDoSelector, toDoState } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

function ToDoList() {
  // const toDos = useRecoilValue(toDoState);
  const toDos = useRecoilValue(toDoSelector);
  const [catagory, setCatagory] = useRecoilState(catagoryState);
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setCatagory(event.currentTarget.value);
  };
  console.log(catagory);

  return (
    <div>
      <h1>To dos</h1>
      <hr />
      <select value={catagory} onInput={onInput}>
        <option value={"DOING"}>Doing</option>
        <option value={"DONE"}>Done</option>
        <option value={"TODO"}>To Do</option>
      </select>
      <CreateToDo />
      {toDos?.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
}

export default ToDoList;
