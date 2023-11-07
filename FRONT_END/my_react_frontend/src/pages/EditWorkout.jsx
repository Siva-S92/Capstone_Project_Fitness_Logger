import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Base from "../components/Base";

function EditWorkout({ myworkout, setMyworkout }) {
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ workout: "", duration: "", date: "" });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    }
    defaultformData();
  }, []);

  const defaultformData = () => {
    const data = myworkout.find((data) => data._id === id);
    if (data) {
      setFormData({
        ...formData,
        workout: data.workout,
        duration: data.duration,
        date: data.date,
      });
    }
  };

  const inputOnchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const edithandle = async (id) => {
    console.log(id);
    const res = await fetch(
      `https://capstone-project-fitness-logger1.onrender.com/api/exercises/user/editexercise/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await res.json();
    if (!data.message) {
      setErr(data.error);
    } else [alert(data.message)];
  };

  return (
    <>
      <Base />
      <div className="container">
        <form className="mt-5">
          <div className="form-group mb-3">
            <label htmlFor="workout" className="form-label">
              Workout:
            </label>
            <input
              type="text"
              className="form-control"
              id="workout"
              name="workout"
              defaultValue={formData.workout}
              onChange={inputOnchange}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="duration" className="form-label">
              Duration in Minutes:
            </label>
            <input
              type="text"
              className="form-control"
              id="duration"
              name="duration"
              defaultValue={formData.duration}
              onChange={inputOnchange}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="date" className="form-label">
              Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              defaultValue={formData.date}
              onChange={inputOnchange}
            />
          </div>
          <button
            type="button"
            className="btn stn-sm btn-outline-success px-5"
            onClick={() => edithandle(id)}
          >
            update
          </button>

          {err ? (
            <div id="errorblock" className="text-danger">
              {err}
            </div>
          ) : (
            ""
          )}

          {msg ? (
            <div id="msgblock" className="text-success">
              {msg}
            </div>
          ) : (
            ""
          )}
        </form>
      </div>

      <div className="d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary mt-5 px-3 mx-5"
          onClick={() => navigate(`/exercise/${formData.workout}`)}
        >
          Go to see your Workout History
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary mt-5 px-3 mx-5 "
          onClick={() => navigate("/")}
        >
          Go to Add new Workout
        </button>
      </div>
    </>
  );
}

export default EditWorkout;
