import { useRecoilState, useRecoilValue } from "recoil";
import { Catagories, catagoryState, toDoSelector, toDoState } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

function ToDoList() {
  // const toDos = useRecoilValue(toDoState);
  const toDos = useRecoilValue(toDoSelector);
  const [catagory, setCatagory] = useRecoilState(catagoryState);
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setCatagory(event.currentTarget.value as any);
  };
  console.log(toDos);

  return (
    <div>
      <h1>To dos</h1>
      <hr />
      <select value={catagory} onInput={onInput}>
        <option value={Catagories.DOING}>Doing</option>
        <option value={Catagories.DONE}>Done</option>
        <option value={Catagories.TODO}>To Do</option>
      </select>
      <CreateToDo />
      {toDos?.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
}

export default ToDoList;
