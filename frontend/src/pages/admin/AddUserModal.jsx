import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slices/adminSlice.js";

const AddUserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault()
  }
};
