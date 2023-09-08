import React from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  label: string;
  name: string;
  type?: string;
  className?: string;
  value?: string;
};

const FormInputs: React.FC<Props> = ({
  label,
  name,
  type = "text",
  className,
  value,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const autoResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  return (
    <div className="flex flex-col gap-4">
      {type === "textarea" ? (
        <textarea
          placeholder={label}
          defaultValue={value}
          onFocus={autoResize}
          onInput={autoResize}
          className={`${
            className
              ? className
              : "w-full overflow-hidden block resize-none h-auto outline-none rounded-[5px] cursor-text"
          }`}
          {...register(name)}
        />
      ) : (
        <input
          type={type}
          placeholder={label}
          defaultValue={value}
          className={`${
            className
              ? className
              : "h-14 border border-[#FB6900] rounded-[5px] outline-none px-6"
          }`}
          {...register(name)}
        />
      )}

      {errors[name] && (
        <span className="text-red-500 text-xs pt-1 block">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInputs;
