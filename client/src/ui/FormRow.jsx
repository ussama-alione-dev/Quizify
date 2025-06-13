import Error from "./Error";

function FormRow({ label, children, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-md text-gray-800 font-semibold capitalize">
        {label}
      </label>
      {children}
      <Error error={error} />
    </div>
  );
}

export default FormRow;
