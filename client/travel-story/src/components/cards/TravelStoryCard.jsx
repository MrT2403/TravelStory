import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
import moment from "moment";

const TravelStoryCard = ({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavorite,
  onFavouriteClick,
  onClick,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
      <img
        src={imgUrl}
        alt={title}
        className="w-full h-56 object-cover rounded-lg"
        onClick={onClick}
      />

      <button
        className="w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4"
        onClick={onFavouriteClick}
      >
        <FaHeart
          className={`icon-btn ${isFavorite ? "text-red-500" : "text-white"}`}
        ></FaHeart>
      </button>

      <div className="p-4" onClick={onClick}>
        <div className="flex items-center font-medium">
          <div className="flex-1">
            <h6 className="text-sm font-medium">{title}</h6>
            <span className="text-sx text-slate-500">
              {date ? moment(date).format("Do MMM YYYY") : "-"}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-2">{title}</p>

        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
          <GrMapLocation className="text-sm"></GrMapLocation>
          {visitedLocation.map((item, index) => (
            <span key={index}>
              {item}
              {index < visitedLocation.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
