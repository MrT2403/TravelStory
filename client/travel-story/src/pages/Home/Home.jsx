import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import userApi from "../../api/modules/user.api";
import { useEffect, useState } from "react";
import storyApi from "../../api/modules/story.api";
import TravelStoryCard from "../../components/cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/cards/EmptyCard";
import { useSearch } from "../../contexts/SearchContext";
import { DayPicker } from "react-day-picker";
import moment from "moment";

const Home = () => {
  const { searchResults, searchQuery, isSearching } = useSearch();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allStory, setAllStory] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [openAddModal, setOpenAddModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    const userData = await userApi.getInfo();
    if (userData.error) {
      localStorage.clear();
      navigate("/login");
    } else {
      setUserInfo(userData);
    }
    setLoading(false);
  };

  const getTravelStory = async () => {
    const storyData = await storyApi.getAllStory();
    if (storyData.response && storyData.response.stories) {
      setAllStory(storyData.response.stories);
    }
  };

  const handleEdit = (data) => {
    setOpenAddModal({ isShown: true, type: "edit", data: data });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const deleteData = await storyApi.deleteStory(storyId);
      if (deleteData.message) {
        toast.success(deleteData.message);
        setOpenViewModal({ isShown: false, data: null });
        await getTravelStory();
      }
    } catch (error) {
      console.log("Error deleting story:", error);
      toast.error("Failed to delete story");
    }
  };

  const updateIsFavourite = async (storyData) => {
    if (isUpdating) return;
    try {
      setIsUpdating(true);

      const updatedStories = allStory.map((story) =>
        story._id === storyData._id
          ? { ...story, isFavorite: !story.isFavorite }
          : story
      );
      setAllStory(updatedStories);

      const updateStoryData = await storyApi.updateFavourite(
        storyData._id,
        !storyData.isFavorite
      );

      if (updateStoryData.response && updateStoryData.response.story) {
        toast.success("Story updated successfully");
      } else if (updateStoryData.error) {
        throw new Error(updateStoryData.error);
      }
    } catch (error) {
      console.error("Error updating favourite:", error);
      toast.error("Failed to update favourite");
    } finally {
      setIsUpdating(false);
    }
  };

  const filterStoriesByDate = async (day) => {
    try {
      if (!day?.from && !day?.to) {
        await getTravelStory();
        return;
      }

      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      const response = await storyApi.filterByDate(startDate, endDate);
      if (response && response.stories) {
        setAllStory(response.stories);
      } else {
        console.log("No stories found for the selected date range.");
        setAllStory([]);
      }
    } catch (error) {
      console.error("Error filtering stories by date:", error);
    }
  };

  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserInfo();
      await getTravelStory();
    };
    fetchData();
  }, []);

  const renderStories = (stories) => (
    <div className="grid grid-cols-4 gap-4">
      {stories.map((item) => (
        <TravelStoryCard
          key={item._id}
          title={item.title}
          imgUrl={item.imageUrl}
          story={item.story}
          date={item.visitedDate}
          visitedLocation={item.visitedLocation}
          isFavorite={item.isFavorite}
          onClick={() => handleViewStory(item)}
          onFavouriteClick={() => updateIsFavourite(item)}
        />
      ))}
    </div>
  );

  return (
    <>
      {loading ? <p>Loading...</p> : <Navbar userInfo={userInfo} />}
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between gap-2">
              {dateRange?.from || dateRange?.to ? (
                <div className="flex items-center gap-2">
                  {allStory.length > 0 ? (
                    <p className="text-lg">
                      Showing {allStory.length} result
                      {allStory.length > 1 ? "s" : ""} from{" "}
                      {moment(dateRange.from || dateRange.to).format(
                        "MMMM Do YYYY"
                      )}
                      {dateRange.to && dateRange.from
                        ? ` to ${moment(dateRange.to).format("MMMM Do YYYY")}`
                        : ""}
                      .
                    </p>
                  ) : (
                    <p className="text-lg">
                      Showing 0 result from{" "}
                      {moment(dateRange.from || dateRange.to).format(
                        "MMMM Do YYYY"
                      )}
                      {dateRange.to && dateRange.from
                        ? ` to ${moment(dateRange.to).format("MMMM Do YYYY")}`
                        : ""}
                      .
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setDateRange({ from: null, to: null });
                      filterStoriesByDate({ from: null, to: null });
                    }}
                    className="ml-12 text-sm hover:text-gray-700 p-3 bg-red-500 text-white rounded-md"
                  >
                    Clear Date Filter
                  </button>
                </div>
              ) : null}
            </div>

            {searchQuery ? (
              isSearching ? (
                <p>Searching...</p>
              ) : searchResults.length > 0 ? (
                <>
                  <h2 className="text-2xl font-medium mb-4">Search Results</h2>
                  {renderStories(searchResults)}
                </>
              ) : (
                <p className="text-gray-500 text-center mt-12">
                  No search results found.
                </p>
              )
            ) : (
              <>
                <h2 className="text-2xl font-medium mb-4">All Stories</h2>
                {allStory.length > 0 ? (
                  renderStories(allStory)
                ) : (
                  <EmptyCard
                    openAddModal={() =>
                      setOpenAddModal({
                        isShown: true,
                        type: "add",
                        data: null,
                      })
                    }
                  />
                )}
              </>
            )}
          </div>

          <div className="w-[340px] mt-12">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pageNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {openAddModal.isShown && (
        <Modal
          isOpen={openAddModal.isShown}
          onRequestClose={() =>
            setOpenAddModal({ isShown: false, type: "add", data: null })
          }
          appElement={document.getElementById("#root")}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
              zIndex: 999,
            },
          }}
          className="model-box"
        >
          <AddEditTravelStory
            type={openAddModal.type}
            storyInfo={openAddModal.data}
            onClose={() =>
              setOpenAddModal({ isShown: false, type: "add", data: null })
            }
            getAllTravelStory={getTravelStory}
          />
        </Modal>
      )}

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() =>
          setOpenAddModal({
            isShown: false,
            type: "add",
            data: null,
          })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          type={openViewModal.type}
          storyInfo={openViewModal.data || null}
          onClose={(prevState) =>
            setOpenViewModal({ ...prevState, isShown: false })
          }
          onDeleteClick={() => handleDeleteStory(openViewModal.data._id)}
          onEditclick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
        ></ViewTravelStory>
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() =>
          setOpenAddModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;
