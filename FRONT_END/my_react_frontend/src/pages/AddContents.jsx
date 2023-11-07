import React, { useEffect, useState } from "react";
import Base from "../components/Base";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function AddContents({userContents, setUserContents}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    }
  }, []);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  //adding files
  const fileOnchange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
}

  //api integration
  async function postnewContent(e) {
    e.preventDefault();
    const contents = {
      title,
      file,
      description,
    };
    const response = await axios.post(`https://capstone-project-fitness-logger1.onrender.com/api/content/user/add`, contents, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": localStorage.getItem("token"),
      },
    });

    const data = await response.data
    if(!data.data){
      setErr(data.error)
    }else {
      setUserContents([...userContents, data.data]);
      setTitle("");
      document.getElementById("filecontent").value = "";
      setDescription("");
      setMsg(data.message);
    }

  }

  return (
    <>
      <Base />
      <div className="container">
        <h1 className="text-center mt-2">Add Your Posts</h1>
      </div>
      <form onSubmit={postnewContent}>
        <div className="container">
          <div className="form-group mb-3">
            <label htmlFor="title">Add Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="filecontent">Add Your File:</label>
            <input
              type="file"
              className="form-control"
              id="filecontent"
              name="filecontent"
              onChange={fileOnchange}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="description">Add Description:</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-2 px-5">
            Add Posts
          </button>

          {err ? (
            <div id="eoorblock" className="text-danger">
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
        </div>
      </form>

      <div className='container mt-5 text-center'>
        <button type="button" className='btn btn-sm btn-outline-success px-4' onClick={()=> navigate("/")}>Go to home and check there your post</button>
      </div>
    </>
  );
}

export default AddContents;
