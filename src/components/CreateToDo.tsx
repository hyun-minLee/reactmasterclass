import { useForm } from "react-hook-form";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { categoryState, toDoState } from "../atoms";

interface IForm {
  toDo: string;
}

function CreateToDo() {
  const ToDos = useRecoilValue(toDoState);
  const setToDos = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  console.log("catagory", category);
  const onSubmit = ({ toDo }: IForm) => {
    setToDos((oldtoDos) => [
      { text: toDo, category: category, id: Date.now() },
      ...oldtoDos,
    ]);
    setValue("toDo", "");
  };
  console.log("ToDos", ToDos);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <input
        {...register("toDo", {
          required: "Please Write to do ",
        })}
        placeholder="Write Todo "
      />
      <button>Add </button>
    </form>
  );
}
export default CreateToDo;
