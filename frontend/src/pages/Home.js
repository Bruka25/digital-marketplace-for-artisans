import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((response) => setMessage(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Welcome to the Digital Marketplace</h1>
      <p>Backend says: {message}</p>
    </div>
  );
};

export default Home;
