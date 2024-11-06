import privateClient from "../client/private.client";

const storyEndpoints = {
  getAllStory: "story/get-story",
  updateFavourite: (storyId) => `story/update-favorite/${storyId}`,
  addStory: "story/add-travel-story",
  editStory: (storyId) => `story/edit-story/${storyId}`,
  deleteStory: (storyId) => `story/delete-story/${storyId}`,
  search: (query) => `story/search?query=${query}`,
  filterByDate: (startDate, endDate) =>
    `story/filter?startDate=${startDate}&endDate=${endDate}`,
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

  updateFavourite: async (storyId, isFavorite) => {
    try {
      const data = await privateClient.put(
        storyEndpoints.updateFavourite(storyId),
        { isFavorite }
      );

      console.log("API Update Fav Response:", data);

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

  editStory: async (storyId, storyData) => {
    try {
      const data = await privateClient.put(
        storyEndpoints.editStory(storyId),
        storyData
      );

      if (data && !data.error) {
        return { response: data };
      } else {
        throw new Error(data.message || "Failed to edit story.");
      }
    } catch (error) {
      console.error("API Call Error: ", error);
      return { error: error.message || "Failed to edit story." };
    }
  },

  deleteStory: async (storyId) => {
    try {
      const data = await privateClient.delete(
        storyEndpoints.deleteStory(storyId)
      );
      return data;
    } catch (error) {
      console.error("API Delete Story Error: ", error);
      return { error: error.message || "Failed to delete story." };
    }
  },

  searchStory: async (query) => {
    try {
      const searchQuery = await privateClient.get(storyEndpoints.search(query));
      return searchQuery;
    } catch (error) {
      console.error("API Search Story Error: ", error);
      return { error: error.message || "Failed to search story." };
    }
  },

  filterByDate: async (startDate, endDate) => {
    try {
      const responseFilterData = await privateClient.get(
        storyEndpoints.filterByDate(
          encodeURIComponent(startDate),
          encodeURIComponent(endDate)
        )
      );

      return responseFilterData;
    } catch (error) {
      console.error("Error on Filter By Date API: ", error);
      return { error: true, message: "Failed to filter by date." };
    }
  },
};

export default storyApi;
