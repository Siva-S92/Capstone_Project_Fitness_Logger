import React, { useEffect, useState } from "react";
import Base from "../components/Base";
import { useNavigate } from "react-router-dom";

function DashBoard() {
  const navigate = useNavigate("/");

  const [contents, setContents] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    }

    const fetchData = async () => {
      const response = await fetch(`https://capstone-project-fitness-logger1.onrender.com/api/content/all`, {
        method: "GET",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (!data.data) {
        setErr(data.error);
      } else {
        setContents(data.data);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Base />
      <div className="container" style={{ backgroundColor: "WhiteSmoke" }}>
        <h1 className="text-center mt-2">EXERCISES</h1>
        <div className="text-center fs-4 fw-bold text-danger">
          All the exercises for improving your fitness and being healthy
        </div>

        {contents && (
          <div className="row">
            {contents?.map((data) => (
              <div
                key={data._id}
                className="col-md-4 d-flex justify-content-center mt-2"
              >
                <div className="card" style={{ width: "18rem", height: "29rem" }}>
                  <h4 className="text-center">{data.title} </h4>

                  <img
                    src={`https://capstone-project-fitness-logger1.onrender.com/${data.file}`}
                    alt=""
                    style={{height: "40%"}}
                  />

                  <div className="card-body text-center" style={{height: "50%"}}>
                    <p><small>Description: {data.description}</small> </p>
                    <p>Posted By: {data.user.username} </p>
                    <button type="button" className="btn btn-sm btn-primary" onClick={()=> navigate(`exercise/${data.title}`)}>Add to your workout</button>
                  </div>
                </div>
              </div>
            ))}
            {err ? (
              <div id="errorblock" className="text-danger">
                {err}
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default DashBoard;
