import axios from "axios";

interface SubmitQuoteParams {
  content: string;
  width: number;
  height: number;
  backgroundImage: string | null;
  folderId: number;
}

export const submitQuote = async ({
  content,
  width,
  height,
  backgroundImage,
  folderId,
}: SubmitQuoteParams) => {
  try {
    const response = await axios.post("/api/quotes", {
      content,
      width,
      height,
      backgroundImage,
      folderId,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to submit quote");
    }
  } catch (error) {
    console.error("Error submitting quote:", error);
    throw error;
  }
};
