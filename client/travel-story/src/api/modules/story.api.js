import privateClient from "../client/private.client";

const storyEndpoints = {
  getAllStory: "story/get-story",
  updateFavourite: (storyId) => `story/update-favorite/${storyId}`,
  addStory: "story/add-travel-story",
};

const storyApi = {
  getAllStory: async () => {
    try {
      const data = await privateClient.get(storyEndpoints.getAllStory);

      if (data && !data.error) {
        return { response: data };
      } else {
        throw new Error(data.message || "No data found in response.");
      }
    } catch (error) {
      console.log(
        "Error uploading the image: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  updateFavourite: async (storyId) => {
    try {
      const url = storyEndpoints.updateFavourite(storyId);
      const data = await privateClient.put(url);

      console.log("API Response:", data);

      if (data && !data.error) {
        return { response: data };
      } else {
        throw new Error(data.message || "Failed to update favourite.");
      }
    } catch (error) {
      console.error("API Call Error:", error);
      return { error: error.message || "Failed to update favourite." };
    }
  },

  addStory: async (storyData) => {
    try {
      const data = await privateClient.post(storyEndpoints.addStory, storyData);

      console.log("API Response:", data);

      if (data && !data.error) {
        return { response: data };
      } else {
        throw new Error(data.message || "Failed to add story.");
      }
    } catch (error) {
      console.error("API Call Error:", error);
      return { error: error.message || "Failed to add story." };
    }
  },
};

export default storyApi;
