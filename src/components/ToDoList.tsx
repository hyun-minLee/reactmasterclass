import { useRecoilState, useRecoilValue } from "recoil";
import { Catagories, categoriesState, toDoSelector, toDoState } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";
import CreateCategory from "./CreateCategory";

function ToDoList() {
  // const toDos = useRecoilValue(toDoState);

  const toDos = useRecoilValue(toDoSelector);
  const [catagory, setCatagory] = useRecoilState(categoriesState);
  let selectValue;
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    selectValue = event.currentTarget.value;
  };
  console.log("selectValue", selectValue);

  return (
    <div>
      <h1>New Category </h1>
      <hr />
      <CreateCategory />
      <h1>To dos</h1>
      <hr />

      <select value={selectValue} onChange={onInput}>
        {Object.keys(catagory).map((key) => (
          <option key={key} value={key}>
            {catagory[key as keyof typeof catagory]}
          </option>
        ))}
      </select>
      <CreateToDo />
      {toDos?.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
}

export default ToDoList;
