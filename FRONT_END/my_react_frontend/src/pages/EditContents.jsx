import React, { useEffect, useState } from 'react'
import Base from '../components/Base'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

function EditContents({userContents, setUserContents}) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const {id} = useParams();


  //adding files
  const fileOnchange = (e) => {
    setFile(e.target.files[0]);
    //console.log(e.target.files[0]);
  };



  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    }
    const data = userContents.find((data) => data._id === id)
    if (data) {
      setTitle(data.title)
      setDescription(data.description)
    }

  }, [id,userContents]);

  

  //api integration
  async function editNewContent() {
    const contents = {
      title,
      file,
      description,
    };
    const response = await axios.put(`https://capstone-project-fitness-logger1.onrender.com/api/content/user/edit/${id}`, contents, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-auth-token": localStorage.getItem("token"),
      },
    });

    const data = await response.data;
    if(!data.data){
      setErr(data.error)
    }else {
      const editableIndex = userContents?.findIndex((data) => data._id === id);
      userContents[editableIndex] = data.data;
      await setUserContents([...userContents]);
      setMsg(data.message)
      
    }

  }

  return (
    <>
      <Base />
      <div className="container">
        <h1 className="text-center mt-2">Edit Notes</h1>
      </div>
      <form>
        <div className="container">
          <div className="form-group mb-3">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <button type="button" className="btn btn-primary mt-2 px-5" onClick={editNewContent}>
            Edit Posts
          </button>

          {err ? (
            <div id="errorblock" className="text-danger">
              {err}
            </div>
          ) : (
            ""
          )}

          {msg ? (
            <div id="eoorblock" className="text-danger">
              {msg}
            </div>
          ) : (
            ""
          )}
        </div>
      </form>

      <div className='container mt-5 text-center'>
        <button type="button" className='btn btn-sm btn-outline-success px-4' onClick={()=> navigate("/")}>Go to home and check there, once you have edited post</button>
      </div>
    </>
  );
}

export default EditContents;