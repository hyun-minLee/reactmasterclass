import { atom, selector } from "recoil";

export interface ITodo {
  text: string;
  catagory: "TODO" | "DOING" | "DONE";
  id: number;
}

export const catagoryState = atom({
  key: "catagory",
  default: "TODO",
});

export const toDoState = atom<ITodo[]>({
  key: "toDo",
  default: [],
});

export const toDoSelector = selector({
  key: "toDoSelector",
  get: ({ get }) => {
    const toDos = get(toDoState);
    const catagory = get(catagoryState);
    return toDos.filter((todo) => todo.catagory === catagory);
  },
});
