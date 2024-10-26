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

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allStory, setAllStory] = useState([]);
  const [openAddModal, setOpenAddModal] = useState({
    isShown: false,
    type: "add",
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

  const handleEdit = (data) => {};

  const handleViewStory = (data) => {};

  const updateIsFavourite = async (storyData) => {
    try {
      const updatedStories = allStory.map((story) =>
        story._id === storyData._id
          ? { ...story, isFavourite: !story.isFavourite }
          : story
      );
      setAllStory(updatedStories);

      const updateStoryData = await storyApi.updateFavourite({
        storyId: storyData._id,
      });

      console.log("updatestorydata: ", updateStoryData);

      if (updateStoryData.response && updateStoryData.response.story) {
        toast.success("Story updated successfully");
        getTravelStory();
      }

      if (updateStoryData.error) {
        const revertedStories = allStory.map((story) =>
          story._id === storyData._id
            ? { ...story, isFavourite: story.isFavourite }
            : story
        );
        setAllStory(revertedStories);

        console.error("Failed to update favourite:", updateStoryData.error);
      }
    } catch (error) {
      console.error("Error updating favourite:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
    getTravelStory();
  }, []);

  return (
    <>
      {loading ? <p>Loading...</p> : <Navbar userInfo={userInfo?.user} />}
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStory.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {allStory.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    ></TravelStoryCard>
                  );
                })}
              </div>
            ) : (
              <>Empty Card Here</>
            )}
          </div>
          <div className="w-[320px]"></div>
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
