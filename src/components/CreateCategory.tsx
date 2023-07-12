import { useForm } from "react-hook-form";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { categoriesState, toDoState } from "../atoms";

interface ICategory {
  NEW_CATEGORY: string;
}

interface IForm {
  toDo: string;
}

function CreateCategory() {
  const setcategories = useSetRecoilState(categoriesState);
  const category = useRecoilValue(categoriesState);
  const { register, handleSubmit, setValue } = useForm<ICategory>();
  //   const [toDos, setToDos] = useRecoilState(toDoState);
  const addNewCategory = (data: ICategory) => {
    const { NEW_CATEGORY } = data;

    setcategories((prevCategories) => [...prevCategories, NEW_CATEGORY]);
    setValue("NEW_CATEGORY", "");
  };
  return (
    <form
      onSubmit={handleSubmit(addNewCategory)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <input
        {...register("NEW_CATEGORY", {
          required: "Please Write to do ",
        })}
        placeholder="Category "
      />
      <button>Add </button>
    </form>
  );
}
export default CreateCategory;
