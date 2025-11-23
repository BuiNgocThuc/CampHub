export async function uploadMedia(file: File): Promise<{ url: string; type: "IMAGE" | "VIDEO" }> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();

    const resourceType = data.resource_type === "video" ? "VIDEO" : "IMAGE";

    return {
        url: data.secure_url,
        type: resourceType,
    };
}


// const [mediaFiles, setMediaFiles] = useState<File[]>([]);
// const [mediaUrls, setMediaUrls] = useState<MediaResource[]>([]);

// const handleUpload = async () => {
//   const uploaded: MediaResource[] = [];

//   for (const file of mediaFiles) {
//     const result = await uploadMedia(file);
//     uploaded.push(result);
//   }

//   setMediaUrls(uploaded);
// };