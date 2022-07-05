import { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./App.css";

function App() {
  const [videoSrc, setVideoSrc] = useState("");
  // upload file
  const [imageFile, setImageFile] = useState({});
  const [soundFile, setSoundFile] = useState({});
  const [videoFile, setVideoFile] = useState({});
  const ffmpeg = createFFmpeg({ log: true });

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setImageFile(file);
  };

  const handleChangeSound = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setSoundFile(file);
  };

  const handleChangeVideo = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setVideoFile(file);
  };

  const createVideo = async () => {
    await ffmpeg.load();
    ffmpeg.FS("writeFile", "image.png", await fetchFile(imageFile));
    ffmpeg.FS("writeFile", "sound.mp3", await fetchFile(soundFile));
    await ffmpeg.run(
      "-framerate",
      "1/10",
      "-i",
      "image.png",
      "-i",
      "sound.mp3",
      "-c:v",
      "libx264",
      "-t",
      "10",
      "-pix_fmt",
      "yuv420p",
      "-vf",
      "scale=1920:1080",
      "test.mp4"
    );
    const data = await ffmpeg.FS("readFile", "test.mp4");
    setVideoSrc(
      URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    );
  };

  const trimVideo = async () => {
    await ffmpeg.load();
    ffmpeg.FS("writeFile", "input-video", await fetchFile(videoFile));
    await ffmpeg.run(
      "-i",
      "input-video",
      "-t",
      "30",
      "-ss",
      "3.0",
      "-f",
      "mp4",
      "output.mp4"
    );
    const data = await ffmpeg.FS("readFile", "output.mp4");
    setVideoSrc(
      URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    );
  };

  return (
    <div className="App">
      <video src={videoSrc} controls /> <br />
      {/* <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleChangeImage}
      />
      <p />
      <input
        type="file"
        id="image"
        accept="sound/*"
        onChange={handleChangeSound}
      />
      <p />
      <button onClick={createVideo}>Create Video</button> */}
      <p />
      <input
        type="file"
        id="video"
        accept="video/*"
        onChange={handleChangeVideo}
      />
      <p />
      <button onClick={trimVideo}>Trim Video</button>
      <p />
    </div>
  );
}

export default App;
