import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    nature: '',
    description: '',
    department: '',
    image: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, image: event.target.files[0] });
  };



  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('nature', formData.nature);

      const response = await fetch('http://localhost:5000/api/add-complaint', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Form submitted successfully!');
      } else {
        alert('Failed to submit form.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form.');
    }
  };
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    navigate('/Login');
  };

  return (
    <div className="container text-center">
      <div className="content">
        <h1 className="alert alert-warning mt-2">IT Complaint Logger</h1>
        <button className="btn btn-warning mt-2" onClick={handleLogout}>
          Logout
        </button>
        <form onSubmit={handleFormSubmit} method="post" encType="multipart/form-data">
          <label>
            Title:
            <input
              placeholder="Enter Title"
              name="title"
              className="form-control mt-2"
              required
              onChange={handleInputChange}
            />
          </label>
          <br />
          
          <br />
          <label>
            Select Department:
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="form-control mt-2"
              required
            >
              <option value="">Select Department</option>
              <option value="A">Computer</option>
              <option value="B">Electronic</option>
              <option value="C">Mechanical</option>
              <option value="D">Electrical</option>
            </select>
          </label>
          <br />
          

          <br />
          <label>
            Description:
            <textarea
              placeholder="Enter Description"
              name="description"
              className="form-control mt-2"
              required
              onChange={handleInputChange}
            />
          </label>
          
          <br />
          <label>
            Condition:
            <input
              placeholder="Enter Nature"
              name="nature"
              className="form-control mt-2"
              required
              onChange={handleInputChange}
            />
          </label>
          <br/>
          <label>
            Upload Image:
            <input
              type="file"
              className="form-control mt-2"
              name="image"
              onChange={handleFileChange}
              required
            />
          </label>
          <br/>
          <button type="submit" className="btn btn-warning mt-2">
            Submit
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Dashboard;
