import React from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  label: string;
  name: string;
  type?: string;
};

const FormInputs: React.FC<Props> = ({ label, name, type = "text" }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="flex flex-col gap-4">
     
      <input
        type={type}
        placeholder={label}
        className="h-14 border border-[#FB6900] rounded-[5px] outline-none px-6"
        {...register(name)}
      />
      {errors[name] && (
        <span className="text-red-500 text-xs pt-1 block">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInputs;
