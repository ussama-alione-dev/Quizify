import { useForm } from "react-hook-form";

import Button from "../ui/Button";
import FormRow from "../ui/FormRow";

function RegisterForm() {
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;

  function onSubmit(data) {
    console.log(data);

    reset();
  }

  return (
    <form
      className="flex flex-col gap-2 px-3.5"
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

      <FormRow label="set up password" error={errors?.password?.message}>
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

      <FormRow
        label="confirm password"
        error={errors?.confirmedPassword?.message}
      >
        <input
          className="input md:text-sm"
          type="password"
          placeholder="Your Password"
          {...register("confirmedPassword", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password ||
              "Confirmation password is incorrect",
          })}
        />
      </FormRow>
      <Button type="primary">Register</Button>
    </form>
  );
}

export default RegisterForm;
