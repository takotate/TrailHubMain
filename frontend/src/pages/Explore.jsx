import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { devUserHeader } from "../api";

const user = { id: "u_hiker_1", role: "hiker", email: "hiker@example.com" };

export default function Explore() {
  const [hikes, setHikes] = useState([]);

  useEffect(() => {
    api
      .get("/api/hikes", { headers: devUserHeader(user) })
      .then((res) => setHikes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Explore hikes</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 16,
          marginTop: 16
        }}
      >
        {hikes.map((hike) => (
          <div
            key={hike.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 8
            }}
          >
            <h3>{hike.name}</h3>
            <p>
              {hike.location} • {hike.difficulty}
            </p>
            <p>
              {new Date(hike.date).toLocaleString()} •{" "}
              {hike.participantsCount}/{hike.capacity} joined
            </p>
            <Link to={`/hike/${hike.id}`}>View details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

