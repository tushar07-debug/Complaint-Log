import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'; // Correct import for XLSX
import './Admin.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const fetchComplaints = async () => {
  try {
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    const response = await fetch('http://localhost:5000/api/GetAllComplaints', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch complaints');
    }
    const data = await response.json();
    console.log('Data from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return [];
  }
};

const Admin = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [chartData, setChartData] = useState({});
  const [complaintsPerDayData, setComplaintsPerDayData] = useState({});

  useEffect(() => {
    fetchComplaints().then(data => {
      console.log('Data before setting state:', data);
      setComplaints(data);

      if (Array.isArray(data)) {
        const departments = [...new Set(data.map(complaint => complaint.department))];
        const complaintsPerDepartment = departments.map(department =>
          data.filter(complaint => complaint.department === department).length
        );

        setChartData({
          labels: departments,
          datasets: [
            {
              label: 'Number of Complaints',
              data: complaintsPerDepartment,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        const dates = data.map(complaint => new Date(complaint.date).toLocaleDateString());
        const uniqueDates = [...new Set(dates)];
        const complaintsPerDay = uniqueDates.map(date =>
          data.filter(complaint => new Date(complaint.date).toLocaleDateString() === date).length
        );

        setComplaintsPerDayData({
          labels: uniqueDates,
          datasets: [
            {
              label: 'Number of Complaints Per Day',
              data: complaintsPerDay,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
              fill: false,
            },
          ],
        });
      }
    });
  }, []);

  const exportToExcel = () => {
    // Prepare data for export
    const data = complaints.map(complaint => ({
      Title: complaint.title,
      Description: complaint.description,
      Department: complaint.department,
      Nature: complaint.nature,
    }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Complaints');

    // Convert workbook to binary XLSX file and save
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = 'complaints.xlsx';

    // Save as Excel file
    saveAs(new Blob([excelBuffer]), fileName);
  };

  const handleBackToLogin = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/Login');
  };

  return (
    <div className="container mt-4">
      <h1 className="alert alert-info text-center">Admin - Complaint Manager</h1>
      <button className="btn btn-success mt-2" onClick={exportToExcel}>
        Export to Excel
      </button>
      <div id="complaints-container" className="mt-4">
        <ul className="list-group">
          {complaints.map(complaint => (
            <li key={complaint._id} className="list-group-item">
              <strong>Title:</strong> {complaint.title}<br />
              <strong>Description:</strong> {complaint.description}<br />
              <strong>Department:</strong> {complaint.department}<br />
              <strong>Nature:</strong> {complaint.nature}<br />
              {complaint.image && (
                <img src={`http://localhost:5000/${complaint.image}`} alt="Complaint" className="img-fluid mt-2" style={{ maxWidth: '200px' }} />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="charts-container">
        <div className="chart-item">
          {chartData.labels && chartData.labels.length > 0 && (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Complaints per Department',
                  },
                },
              }}
            />
          )}
        </div>
        <div className="chart-item">
          {complaintsPerDayData.labels && complaintsPerDayData.labels.length > 0 && (
            <Line
              data={complaintsPerDayData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Complaints Registered Per Day',
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Date',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Number of Complaints',
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>
      </div>
      <button className="btn btn-info mt-4" onClick={handleBackToLogin}>
        Logout
      </button>
    </div>
  );
};

export default Admin;
