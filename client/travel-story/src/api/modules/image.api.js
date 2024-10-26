import privateClient from "../client/private.client";

const imageEndpoints = {
  uploadImage: "story/image-upload",
};

const imageApi = {
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await privateClient.post(
        imageEndpoints.uploadImage,
        formData
      );

      return response;
    } catch (error) {
      console.log("Error uploading the image: ", error);
      throw error;
    }
  },
};

export default imageApi;
