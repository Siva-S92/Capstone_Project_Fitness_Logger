import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WorkoutHistory({ myworkout, setMyworkout }) {
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [myworkout]);

  const fetchData = async () => {
    const response = await axios.get(
      "https://capstone-project-fitness-logger1.onrender.com/api/exercises/user/allexercises",
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );
    setMyworkout([...response.data.data]);
  };

  const handleDelete = async (id) => {
    const res = await fetch(
      `https://capstone-project-fitness-logger1.onrender.com/api/exercises/user/delete-exercise/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await res.json();
    if (!data.message) {
      alert(data.error);
    } else {
      alert(data.message);
      const newworkout = myworkout.filter((data)=> data._id != id);
      setMyworkout([...newworkout])
    }
  };

  return (
    <>
      <div
        className="container mt-5 rounded"
        style={{ backgroundColor: "WhiteSmoke" }}
      >
        <h1 className="text-center pt-3">workout history</h1>
        <div className="row">
          {myworkout.map((data) => (
            <div key={data._id} className="col-md-4">
              <div className="card">
                <div className="card-header">{data.date}</div>
                <div className="card-body">
                  <p className="card-title">workout: {data.workout}</p>
                  <p>duration in minutes: {data.duration}</p>
                  <div className="d-flex ">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-info py-0 px-3 mx-1 my-0"
                      onClick={() => navigate(`/editworkout/${data._id}`)}
                    >
                      edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger py-0 px-3 mx-1 my-0"
                      onClick={() => handleDelete(data._id)}
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))}
          <hr className="mt-5" />
        </div>
      </div>
    </>
  );
}

export default WorkoutHistory;
