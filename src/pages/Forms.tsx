import { useNavigate, useParams } from "react-router-dom";
import { Endpoints, editFormFn, getFormById } from "../components/Endpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/whiteloader";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { TypeOf, object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputs from "../components/FormInputs";
import { useDispatch } from "react-redux";
import { getloaderstate } from "../store/slice/loaderstate";
import { FaArrowLeft } from "react-icons/fa";

const formSchema = object({
  title: string().min(1, "Title is required").max(100),
  description: string().min(1, "Description is required"),
});

export type FormInput = TypeOf<typeof formSchema>;

const Forms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { formId } = useParams();
  const formIdAsString = String(formId);

  const methods = useForm<FormInput>({
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit } = methods;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery(["getFormDataById", formId], () => getFormById(formIdAsString), {
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        console.error(err);

        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        }
      } else {
        console.error(err);
      }
    },
  });

  const { mutate: editForm } = useMutation(
    (userData: FormInput) => editFormFn(formId, userData),
    {
      onMutate() {
        dispatch(getloaderstate(true));
      },
      onSuccess() {
        dispatch(getloaderstate(false));
        queryClient.invalidateQueries(["getData"]);
        queryClient.invalidateQueries(["getFormDataById"]);
        toast.success("You have successfully updated a note!");
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

  const deleteNotes = async () => {
    try {
      await axios.delete(`${Endpoints.delete_form}/${formId}`).then(() => {
        toast.success("You have successfully deleted a note!");
        navigate(-1);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const convertDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const onSubmitHandler: SubmitHandler<FormInput> = (values) => {
    console.log(values);
    editForm(values);
  };

  return (
    <>
      {isError ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-center">Error loading note</p>
        </div>
      ) : (
        <>
          {!isLoading ? (
            <div className="w-full h-screen flex justify-center bg-[#E5E5E5]">
              <div className="flex flex-col h-screen relative w-[500px] bg-white overflow-y-auto pb-20 px-6">
                <div className="flex items-center my-4">
                  <button onClick={() => navigate(-1)}>
                    <FaArrowLeft />
                  </button>
                </div>

                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitHandler)} className="">
                    <FormInputs
                      className="h-14 w-full rounded-[5px] outline-none text-lg capitalize mb-6 hover:bg-gray-50"
                      label=""
                      name="title"
                      value={note?.title}
                    />
                    <FormInputs
                      className="w-full h-auto resize-none roboto text-[#000000BA] font-light overflow-hidden outline-none rounded-[5px] cursor-text hover:bg-gray-50"
                      label=""
                      name="description"
                      value={note?.description}
                      type="textarea"
                    />

                    <div className="flex justify-end pr-6 mt-16 mb-8">
                      <button className="bg-green-500 text-white px-6 py-2 rounded-[5px] ">
                        Save changes
                      </button>
                    </div>
                  </form>
                </FormProvider>

                <div className="flex justify-end pr-6 mb-8">
                  <button
                    className="bg-red-500 text-white px-6 py-2 rounded-[5px] "
                    onClick={deleteNotes}
                  >
                    Delete note
                  </button>
                </div>

                <div className="md:flex items-center justify-between">
                  <span className="flex items-center gap-2 pb-2">
                    <button className="bg-[#FA9F5E] rounded-[25px] text-[8px] px-2 py-1 text-white">
                      Created
                    </button>
                    <p className="text-[8px]">{convertDate(note?.createdAt)}</p>
                  </span>
                  {note?.updatedAt && (
                    <span className="flex items-center gap-2 pb-2">
                      <button className="bg-[#FA9F5E] rounded-[25px] text-[8px] px-2 py-1 text-white">
                        Last updated
                      </button>
                      <p className="text-[8px]">
                        {convertDate(note?.updatedAt)}
                      </p>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </>
      )}
    </>
  );
};

export default Forms;
