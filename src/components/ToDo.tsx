import { useSetRecoilState } from "recoil";
import { ITodo, toDoState } from "../atoms";

function ToDo({ text, catagory, id }: ITodo) {
  const setToDos = useSetRecoilState(toDoState);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;
    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((toDo) => toDo.id === id);
      const newToDo = { text, id, catagory: name as any };
      return [
        ...oldToDos.slice(0, targetIndex),
        newToDo,
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };
  return (
    <li>
      {text}

      {catagory !== "TODO" && (
        <button name="TODO" onClick={onClick}>
          ToDo{" "}
        </button>
      )}
      {catagory !== "DOING" && (
        <button name="DOING" onClick={onClick}>
          Doing{" "}
        </button>
      )}
      {catagory !== "DONE" && (
        <button name="DONE" onClick={onClick}>
          DONE{" "}
        </button>
      )}
    </li>
  );
}

export default ToDo;
