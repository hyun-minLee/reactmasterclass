import { atom, selector } from "recoil";

export enum Catagories {
  "TODO" = "TODO",
  "DOING" = "DOING",
  "DONE" = "DONE",
}

export interface ITodo {
  text: string;
  catagory: Catagories;
  id: number;
}

export const catagoryState = atom<Catagories>({
  key: "catagory",
  default: Catagories.TODO,
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
