const EmptyCard = ({ openAddModal }) => {
  return (
    <div className="text-center font-medium ">
      <p className="text-xl">
        You don't have any post yet, wanna show us your enchanting world ?{" "}
        <strong
          onClick={openAddModal}
          className="text-cyan-500 cursor-pointer hover:bg-cyan-500 hover:text-white"
        >
          Let's create the first one
        </strong>{" "}
      </p>
    </div>
  );
};

export default EmptyCard;
