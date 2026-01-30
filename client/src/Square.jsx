function Square({ value, onClick, highlight }) {
  return (
    <button
      onClick={onClick}
      className={highlight ? "square highlight" : "square"}
    >
      {value}
    </button>
  );
}

export default Square;
