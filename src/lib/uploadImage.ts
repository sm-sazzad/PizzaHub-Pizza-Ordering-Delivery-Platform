/**
 * Utility to upload an image file to ImgBB and return the hosted direct URL.
 * Reusable across Sign Up, Vendor Add Menu Item, and Profile updates.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "ImgBB API key is missing. Please add NEXT_PUBLIC_IMGBB_API_KEY to your .env file.",
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`ImgBB upload failed with HTTP status ${response.status}`);
  }

  const data = await response.json();

  if (!data.success || !data.data?.url) {
    throw new Error(data.error?.message || "Failed to upload image to ImgBB");
  }

  // Return the direct display URL from ImgBB
  return data.data.display_url || data.data.url;
}
