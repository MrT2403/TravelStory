import privateClient from "../client/private.client";
import publicClient from "../client/public.client";

const storyEndpoints = {
  getAllStory: "story/get-story",
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
      console.error("API Call Error:", error);
      return { error: error.message || "Failed to get story data." };
    }
  },
};

export default storyApi;
