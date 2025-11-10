import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { devUserHeader } from "../api";

const user = { id: "u_hiker_1", role: "hiker", email: "hiker@example.com" };

export default function HikeDetails() {
  const { id } = useParams();
  const [hike, setHike] = useState(null);

  const headers = devUserHeader(user);

  async function load() {
    const res = await api.get(`/api/hikes/${id}`, { headers });
    setHike(res.data);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function join() {
    try {
      await api.post(`/api/hikes/${id}/join`, null, { headers });
      await load();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join");
    }
  }

  async function leave() {
    try {
      await api.delete(`/api/hikes/${id}/join`, { headers });
      await load();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to leave");
    }
  }

  if (!hike) return <div>Loading…</div>;

  return (
    <div>
      <h2>{hike.name}</h2>
      <p>
        {hike.location} • {hike.difficulty}
      </p>
      <p>{hike.description}</p>
      <p>
        {new Date(hike.date).toLocaleString()} •{" "}
        {hike.participantsCount}/{hike.capacity} joined
      </p>
      {hike.joined ? (
        <button onClick={leave}>Leave hike</button>
      ) : (
        <button onClick={join} disabled={hike.isFull}>
          {hike.isFull ? "Hike full" : "Join hike"}
        </button>
      )}
    </div>
  );
}

