import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import userApi from "../../api/modules/user.api";
import { useEffect, useState } from "react";
import storyApi from "../../api/modules/story.api";
import TravelStoryCard from "../../components/cards/TravelStoryCard";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allStory, setAllStory] = useState([]);

  const getUserInfo = async () => {
    const data = await userApi.getInfo();
    console.log("API Response:", data);
    if (data.error) {
      localStorage.clear();
      navigate("/login");
    } else {
      setUserInfo(data);
    }
    setLoading(false);
  };

  const getTravelStory = async () => {
    const data = await storyApi.getAllStory();
    if (data && data.stories) {
      setAllStory(data.stories);
    }
  };

  const handleEdit = (data) => {};

  const handleViewStory = (data) => {};

  const updateIsFavourite = async (storyData) => {};

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
              <div className="grid grid-cols-2 gap-4">
                {allStory.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.title}
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
        </div>
      </div>
    </>
  );
};

export default Home;
