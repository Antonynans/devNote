import line from "/line.svg";
import { toast } from "react-toastify";
import axios from "axios";
import { addFormFn, editFormFn } from "./Endpoints";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";
import FormInputs from "./FormInputs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getloaderstate } from "../store/slice/loaderstate";
import { RootState } from "../store/Store";

interface Props {
  setModal: (modal: boolean) => void;
  isEdit: boolean;
  noteId?: string;
}

const formSchema = object({
  title: string().min(1, "Title is required").max(100),
  description: string().min(1, "Description is required"),
  userId: string().optional(),
});

export type FormInput = TypeOf<typeof formSchema>;

const AddNotes: React.FC<Props> = ({ setModal, isEdit, noteId }) => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const userDetails = useSelector((state: RootState) => state.users);
  const userId = userDetails.user?._id;

  const methods = useForm<FormInput>({
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit } = methods;

  const { mutate: addForm } = useMutation(
    (userData: FormInput) => addFormFn(userData),
    {
      onMutate() {
        dispatch(getloaderstate(true));
      },
      onSuccess() {
        dispatch(getloaderstate(false));
        queryClient.invalidateQueries(["getData"]);
        toast.success("You have successfully added a new note!");
        setModal(false);
      },
      onError(err) {
        if (axios.isAxiosError(err)) {
          console.error(err);

          if (err.response?.data?.message) {
            toast.error("Error creating a note");
          }
        } else {
          console.error(err);
        }
      },
      onSettled() {
        dispatch(getloaderstate(false));
      },
    }
  );

  const { mutate: editForm } = useMutation(
    (userData: FormInput) => editFormFn(noteId, userData),
    {
      onMutate() {
        dispatch(getloaderstate(true));
      },
      onSuccess() {
        dispatch(getloaderstate(false));
        queryClient.invalidateQueries(["getData"]);

        toast.success("You have successfully updated a note!");
        setModal(false);
      },
      onError(err) {
        if (axios.isAxiosError(err)) {
          console.error(err);

          if (err.response?.data?.message) {
            toast.error("Error updating a note");
          }
        } else {
          console.error(err);
        }
      },
      onSettled() {
        dispatch(getloaderstate(false));
      },
    }
  );

  const onSubmitHandler: SubmitHandler<FormInput> = (values) => {
    const newNotes = { ...values, userId: userId };
    isEdit ? editForm(newNotes) : addForm(newNotes);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="">
          <FormInputs
            className="h-14 w-full rounded-[5px] outline-none px-6"
            label="| Title"
            name="title"
          />
          <img src={line} alt="" className="mb-2 mt-3 w-full" />
          <FormInputs
            className="w-full min-h-14 max-h-40 overflow-auto px-6 outline-none rounded-[5px] cursor-text"
            label="| Description"
            name="description"
            type="textarea"
          />

          <div className="flex justify-end pr-6 mt-8">
            <button className="bg-[#FB6900] text-white px-6 py-2 rounded-[5px] ">
              {isEdit ? "Modify" : "Save"}
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
export default AddNotes;
