import { Link } from "react-router-dom";

function Button({ children, to, disabled, type, onClick }) {
  const styles = {
    primary: "primary-button ",
    secondary: "secondary-button ",
    link: "text-primary-600 cursor-pointer text-lg font-semibold",
  };

  if (to) {
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles[type]} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
