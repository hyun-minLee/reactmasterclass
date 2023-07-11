import { useForm } from "react-hook-form";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { catagoryState, toDoState } from "../atoms";

interface IForm {
  toDo: string;
}

function CreateToDo() {
  const setToDos = useSetRecoilState(toDoState);
  const catagory = useRecoilValue(catagoryState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  //   const [toDos, setToDos] = useRecoilState(toDoState);
  const onSubmit = ({ toDo }: IForm) => {
    setToDos((oldtoDos) => [
      { text: toDo, catagory: catagory, id: Date.now() },
      ...oldtoDos,
    ]);
    setValue("toDo", "");
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <input
        {...register("toDo", {
          required: "Please Write to do ",
        })}
        placeholder="Email "
      />
      <button>Add </button>
    </form>
  );
}
export default CreateToDo;
