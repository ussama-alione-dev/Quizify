import { useForm } from "react-hook-form";

import Button from "../ui/Button";
import FormRow from "../ui/FormRow";

function LoginForm() {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  function onSubmit(data) {
    console.log(data);

    reset();
  }

  return (
    <form
      className="flex flex-col gap-2.5 py-2 px-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormRow label="full name" error={errors?.fullName?.message}>
        <input
          className="input md:text-sm"
          type="text"
          placeholder="Your Full Name"
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="email" error={errors?.email?.message}>
        <input
          className="input md:text-sm"
          type="email"
          placeholder="Your Email"
          {...register("email", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="password" error={errors?.password?.message}>
        <input
          className="input md:text-sm"
          type="password"
          placeholder="Your Password"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password should be last or equal 6 characters",
            },
          })}
        />
      </FormRow>
      <Button type="primary">Login</Button>
    </form>
  );
}

export default LoginForm;
