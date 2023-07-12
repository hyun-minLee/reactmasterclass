import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export enum Catagories {
  "TODO" = "TODO",
  "DOING" = "DOING",
  "DONE" = "DONE",
}

export interface ITodo {
  text: string;
  category: string;
  id: number;
}

// export const catagoryState = atom<Catagories>({
//   key: "catagory",
//   default: Catagories.TODO,
// });

export const categoryState = atom({
  key: "categoryState",
  default: "TODO",
  effects_UNSTABLE: [persistAtom],
});

export const categoriesState = atom<string[]>({
  key: "categoriesState",
  default: ["TODO", "DOING", "DONE"],
  effects_UNSTABLE: [persistAtom],
});

export const toDoState = atom<ITodo[]>({
  key: "toDo",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const toDoSelector = selector({
  key: "toDoSelector",
  get: ({ get }) => {
    const toDos = get(toDoState);
    const selectedCategory = get(categoryState);
    return toDos.filter((todo) => todo.category === selectedCategory);
  },
});
