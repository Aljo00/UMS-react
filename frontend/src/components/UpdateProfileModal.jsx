import React, { useState } from "react";
import axios from "axios";
import API from '../axios.js'
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";

const UpdateProfileModal = ({ user, closeModal }) => {
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ums_upload");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dux2ya5rb/image/upload",
      formData
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = user.image;

    if (image) {
      imageUrl = await handleImageUpload();
    }

    const res = await API.put("/users/profile", { name, image: imageUrl });
    dispatch(setUser(res.data));
    closeModal();
  };

  return (
    <div
      style={{
        background: "#000000aa",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          background: "white",
          margin: "10% auto",
          padding: "2rem",
          width: "300px",
        }}
      >
        <h3>Update Profile</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit">Update</button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
