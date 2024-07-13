import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './CSS-Components/patientsListComponent.css'; // Import your CSS file for styling
import 'react-toastify/dist/ReactToastify.css';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

const PatientsListComponent = () => {
    const [patients, setPatients] = useState([]);
    const [searchedPatient, setSearchedPatient] = useState(null);
    const [patientId, setPatientId] = useState('');
    const [editMode, setEditMode] = useState(false); // Track if in edit mode
    const [editFormData, setEditFormData] = useState({
        id: null,
        firstName: '',
        surName: '',
        middleName: '',
        dateOfBirth: '',
        homeAddress: '',
        dateOfRegistration: ''
    });

    useEffect(() => {
        axios.get('http://localhost:3000/api/patient')
            .then(response => {
                setPatients(response.data);
            })
            .catch(error => {
                console.error('Error fetching patients:', error);
            });
    }, []);

    const handleSearch = () => {
        axios.get(`http://localhost:3000/api/patient/${patientId}`)
            .then(response => {
                setSearchedPatient(response.data);
            })
            .catch(error => {
                console.error('Error fetching patient:', error);
                setSearchedPatient(null);
            });
    };

    const handleChange = (e) => {
        setPatientId(e.target.value);
    };

    const handleEdit = (patient) => {
        setEditMode(true);
        setEditFormData({
            id: patient.id,
            firstName: patient.firstName,
            surName: patient.surName,
            middleName: patient.middleName,
            dateOfBirth: patient.dateOfBirth,
            homeAddress: patient.homeAddress,
            dateOfRegistration: patient.dateOfRegistration
        });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditFormData({
            id: null,
            firstName: '',
            surName: '',
            middleName: '',
            dateOfBirth: '',
            homeAddress: '',
            dateOfRegistration: ''
        });
    };

    const handleSaveEdit = () => {
        axios.put(`http://localhost:3000/api/patient/${editFormData.id}`, editFormData)
            .then(response => {
                toast.success('Patient updated successfully!');
                console.log(`Patient with ID ${editFormData.id} updated successfully.`);
                // Update the patient in the local state
                const updatedPatients = patients.map(patient => {
                    if (patient.id === editFormData.id) {
                        return { ...patient, ...editFormData };
                    }
                    return patient;
                });
                setPatients(updatedPatients);
                setEditMode(false);
                setEditFormData({
                    id: null,
                    firstName: '',
                    surName: '',
                    middleName: '',
                    dateOfBirth: '',
                    homeAddress: '',
                    dateOfRegistration: ''
                });
            })
            .catch(error => {
                console.error('Error updating patient:', error);
                toast.error('Error updating patient.');
            });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/api/patient/${id}`)
            .then(response => {
                toast.success('Patient Deleted successfully!');
                setPatients(patients.filter(patient => patient.id !== id));
            })
            .catch(error => {
                console.error('Error deleting patient:', error);
                toast.error('Error updating patient.');
            });
    };

    return (
        <div className="patients-container">
            <ToastContainer />
            {searchedPatient && (
                <div className="searched-patient-details">
                    <h3>Searched Patient Details</h3>
                    <p>ID: {searchedPatient.id}</p>
                    <p>First Name: {searchedPatient.firstName}</p>
                    <p>Surname: {searchedPatient.surName}</p>
                    <p>Middle Name: {searchedPatient.middleName}</p>
                    <p>Date of Birth: {formatDate(searchedPatient.dateOfBirth)}</p>
                    <p>Home Address: {searchedPatient.homeAddress}</p>
                    <p>Date of Registration: {formatDate(searchedPatient.dateOfRegistration)}</p>
                </div>
            )}
            {editMode && (
                <div className="edit-form">
                    <h3>Edit Patient</h3>
                    <label>First Name:
                        <input type="text" name="firstName" value={editFormData.firstName} onChange={handleEditInputChange} />
                    </label>
                    <label>Surname:
                        <input type="text" name="surName" value={editFormData.surName} onChange={handleEditInputChange} />
                    </label>
                    <label>Middle Name:
                        <input type="text" name="middleName" value={editFormData.middleName} onChange={handleEditInputChange} />
                    </label>
                    <label>Date of Birth:
                        <input type="date" name="dateOfBirth" value={editFormData.dateOfBirth} onChange={handleEditInputChange} />
                    </label>
                    <label>Home Address:
                        <input type="text" name="homeAddress" value={editFormData.homeAddress} onChange={handleEditInputChange} />
                    </label>
                    <label>Date of Registration:
                        <input type="date" name="dateOfRegistration" value={editFormData.dateOfRegistration} onChange={handleEditInputChange} />
                    </label>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </div>
            )}

            {!searchedPatient && patientId && (
                <p className="no-patient-found">No patient found with ID {patientId}.</p>
            )}

            <h2>Patients List</h2>
            <div className="search-container">
                <input type="text" placeholder="Enter Patient ID" value={patientId} onChange={handleChange} />
                <button onClick={handleSearch}>Search</button>
            </div>
            <table className="patients-list">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Surname</th>
                        <th>Middle Name</th>
                        <th>Date of Birth</th>
                        <th>Home Address</th>
                        <th>Date of Registration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.id}</td>
                            <td>{patient.firstName}</td>
                            <td>{patient.surName}</td>
                            <td>{patient.middleName}</td>
                            <td>{formatDate(patient.dateOfBirth)}</td>
                            <td>{patient.homeAddress}</td>
                            <td>{formatDate(patient.dateOfRegistration)}</td>
                            <td className="change-buttons">
                                <button className="edit-button" onClick={() => handleEdit(patient)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(patient.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientsListComponent;
