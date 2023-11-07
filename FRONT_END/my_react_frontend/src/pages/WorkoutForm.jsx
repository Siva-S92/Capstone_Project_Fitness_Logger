import React, { useEffect, useState } from "react";
import Base from "../components/Base";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import WorkoutHistory from "./WorkoutHistory";

function WorkoutForm({myworkout, setMyworkout}) {
  const navigate = useNavigate();
  const {workout_type} = useParams();
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  
  
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    }
  }, []);

  

  

  const [formData, setFormData] = useState({workout: workout_type, duration: "", date: ""});

  const inputOnchange = (e)=> {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  

  const exerciseFormSubmit = async (e)=> {
    e.preventDefault();
    const response = await axios.post(`https://capstone-project-fitness-logger1.onrender.com/api/exercises/user/addexercise`, formData, {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });
    const data = await response.data;
    if (!data.data) {
      setErr(data.error);
    } else {
      setMyworkout([...myworkout, data.data])
      alert(data.message);
    }
  }


  return (
    <>
      <Base/>
      <div className="container">
        <h2 className="text-center mt-2"><u>Add Your Workout Here</u> </h2>
        <form onSubmit={exerciseFormSubmit} className="mt-5">
          <div className="form-group mb-3">
            <label htmlFor="workout" className="form-label">
              Workout:
            </label>
            <input
              type="text"
              className="form-control"
              id="workout"
              name="workout"
              defaultValue={workout_type}
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
              onChange={inputOnchange}
            />
          </div>
          <button type="submit" className="btn stn-sm btn-outline-info px-5">submit</button>

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


      {/* importing WorkoutHistory componenet */}
      <WorkoutHistory myworkout={myworkout} setMyworkout={setMyworkout} />


      <div className="d-flex justify-content-center">
        <button type="button"className="btn btn-outline-info my-5 px-5 " onClick={()=> navigate("/")} >Go to Add new Workout</button>
      </div>
      
    </>
  );
}

export default WorkoutForm;
