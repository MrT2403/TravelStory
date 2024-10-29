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

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allStory, setAllStory] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
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
      console.log("Getting Delete Error: ", error);
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
                      title={item.title}
                      imgUrl={item.imageUrl}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavorite={item.isFavorite}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    ></TravelStoryCard>
                  );
                })}
              </div>
            ) : (
              <EmptyCard
                openAddModal={() =>
                  setOpenAddModal({ isShown: true, type: "add", data: null })
                }
              ></EmptyCard>
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
