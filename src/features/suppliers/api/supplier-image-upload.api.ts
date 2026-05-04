import { httpClient } from "../../../shared/api/httpClient";
import { ApiError } from "../../../shared/api/apiError";

interface UploadImageResponse {
  imageUrl: string;
}

export async function uploadSupplierImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await httpClient.post<UploadImageResponse>("/suppliers/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.imageUrl;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw new Error("Image upload failed.");
  }
}
