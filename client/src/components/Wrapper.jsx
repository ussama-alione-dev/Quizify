function Wrapper({ children }) {
  return (
    <div className="flex flex-col justify-between space-y-4 md:h-screen md:flex-row md:items-center md:px-12">
      {children}
    </div>
  );
}

export default Wrapper;
