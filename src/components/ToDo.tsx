import { useSetRecoilState, useRecoilValue } from "recoil";
import { categoriesState, ITodo, toDoState } from "../atoms";

function ToDo({ text, category, id }: ITodo) {
  const setToDos = useSetRecoilState(toDoState);
  const categories = useRecoilValue(categoriesState);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;
    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((toDo) => toDo.id === id);
      const newToDo = { text, id, category: name as any };
      return [
        ...oldToDos.slice(0, targetIndex),
        newToDo,
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };
  return (
    <li>
      <span>{text}</span>
      {categories.map(
        (item) =>
          item !== category && (
            <button key={item} name={item} onClick={onClick}>
              {item}
            </button>
          )
      )}
    </li>
  );
}

export default ToDo;
