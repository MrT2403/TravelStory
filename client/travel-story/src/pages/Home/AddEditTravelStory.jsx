import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/input/DateSelector";
import { useState } from "react";
import ImageSelector from "../../components/input/ImageSelector";
import TagInput from "../../components/input/TagInput";
import imageApi from "../../api/modules/image.api";
import moment from "moment";
import { toast } from "react-toastify";
import storyApi from "../../api/modules/story.api";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStory,
}) => {
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [error, setError] = useState();

  const resetState = () => {
    setVisitedDate(null);
    setStoryImg(null);
    setStory("");
    setVisitedLocation([]);
    setTitle("");
  };

  const updateTravelStory = async () => {
    try {
      let imageUrl = storyInfo?.imageUrl || "";

      if (storyImg && storyImg !== storyInfo?.imageUrl) {
        const imgUploadRes = await imageApi.uploadImage(storyImg);
        if (imgUploadRes?.imageUrl) {
          imageUrl = imgUploadRes.imageUrl;
        } else {
          throw new Error("Image upload failed.");
        }
      }

      const updatedStoryData = {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };

      const response = await storyApi.editStory(
        storyInfo._id,
        updatedStoryData
      );

      if (response?.response?.story) {
        toast.success("Story updated successfully!");

        await getAllTravelStory();
        resetState();
        onClose();
      } else {
        throw new Error(response?.error || "Failed to update story.");
      }
    } catch (error) {
      console.error("Error updating travel story:", error);
      toast.error(error.message || "Failed to update story. Please try again.");
    }
  };

  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const imgUploadRes = await imageApi.uploadImage(storyImg);
        if (imgUploadRes?.imageUrl) {
          imageUrl = imgUploadRes.imageUrl;
        } else {
          throw new Error("Image upload failed.");
        }
      }

      const storyData = {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };

      const response = await storyApi.addStory(storyData);

      if (response?.response?.story) {
        toast.success("Story added successfully!");

        await getAllTravelStory();
        resetState();
        onClose();
      } else {
        throw new Error(response?.error || "Failed to add story.");
      }
    } catch (error) {
      console.error("Error adding travel story:", error);
      toast.error(error.message || "Failed to add story. Please try again.");
    }
  };

  const handleAddOrUpdateClick = async () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!story) {
      setError("Please enter the story");
      return;
    }

    setError("");

    if (type === "edit") {
      await updateTravelStory();
    } else {
      await addNewTravelStory();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" />
                ADD STORY
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdUpdate className="text-lg" />
                  UPDATE STORY
                </button>
                <button className="btn-small btn-delete" onClick={onClose}>
                  <MdDeleteOutline className="text-lg" />
                  DELETE
                </button>
              </>
            )}
            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A Day At The Great Wall"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="my-3">
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>

        <ImageSelector image={storyImg} setImage={setStoryImg} />

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">STORY</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded"
            placeholder="Your Story"
            rows={10}
            value={story}
            onChange={(e) => setStory(e.target.value)}
          ></textarea>
        </div>

        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
      </div>
    </div>
  );
};

export default AddEditTravelStory;
