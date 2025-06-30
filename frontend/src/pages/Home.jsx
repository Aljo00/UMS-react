import React, { useState } from "react";
import { useSelector } from "react-redux";
import UpdateProfileModal from "../components/UpdateProfileModal";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      {user.image && (
        <img
          src={user.image}
          alt="Profile Photo"
          style={{ width: "100px", borderRadius: "50%" }}
        />
      )}
      <button onClick={() => setShowModal(true)}>Update the Profile</button>

      {showModal && (
        <UpdateProfileModal
          user={user}
          closeModal={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Home;
