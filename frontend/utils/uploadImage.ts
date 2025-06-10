import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function uploadImage(photo: any) {
  const formData = new FormData();
  formData.append("image", {
    uri: "file://" + photo.path,
    name: "photo.jpg",
    type: "image/jpeg",
  } as any);
  console.log("Form data prepared for upload", formData);

  try {
    const response = await fetch("https://devapi.braillo.tech/upload", {
      method: "POST",
      body: formData,
      headers: {
        "api-token": process.env.EXPO_PUBLIC_API_TOKEN as string,
      },
    });
    const data = await response.json();
    console.log("Upload success", data);
    if (data["response"]) {
      const jsonHistory = await AsyncStorage.getItem("history");
      let history: any[] = jsonHistory != null ? JSON.parse(jsonHistory) : [];
      if (history.length < 40) {
        console.log("Adding to history", data);
        history.push(data);
        await AsyncStorage.setItem("history", JSON.stringify(history));
      }
    }
    return data;
  } catch (error) {
    console.error("Upload failed", error);
  }
}
