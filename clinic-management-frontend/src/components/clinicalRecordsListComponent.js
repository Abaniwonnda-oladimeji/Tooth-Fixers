import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './CSS-Components/patientsListComponent.css';
import 'react-toastify/dist/ReactToastify.css';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

const ClinicalRecordsListComponent = () => {
    const [clinicalRecords, setClinicalRecords] = useState([]);
    const [searchedPatient, setSearchedPatient] = useState(null);
    const [patientId, setPatientId] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: null,
        clinicDate: '',
        natureOfAilment: '',
        medicinePrescribed: '',
        procedureUndertaken: '',
        dateOfNextAppointment: '',
        patientNo: '',
    });

    useEffect(() => {
        axios.get('http://localhost:3000/api/clinical-record')
            .then(response => setClinicalRecords(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleSearch = () => {
        axios.get(`http://localhost:3000/api/clinical-record/${patientId}`)
            .then(response => {
                setSearchedPatient(response.data);
            })
            .catch(error => {
                console.error('Error fetching clinical record:', error);
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
            clinicDate: patient.clinicDate,
            natureOfAilment: patient.natureOfAilment,
            medicinePrescribed: patient.medicinePrescribed,
            procedureUndertaken: patient.procedureUndertaken,
            dateOfNextAppointment: patient.dateOfNextAppointment,
        });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditFormData({
            id: null,
            clinicDate: '',
            natureOfAilment: '',
            medicinePrescribed: '',
            procedureUndertaken: '',
            dateOfNextAppointment: '',
        });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleSaveEdit = () => {
        axios.patch(`http://localhost:3000/api/clinical-record/${editFormData.id}`, editFormData)
            .then(response => {
                toast.success()
                console.log(`Patient with ID ${editFormData.id} updated successfully.`);
                const updatedPatients = clinicalRecords.map(patient => {
                    if (patient.id === editFormData.id) {
                        return { ...patient, ...editFormData };
                    }
                    return patient;
                });
                setClinicalRecords(updatedPatients);
                setEditMode(false);
                setEditFormData({
                    id: null,
                    clinicDate: '',
                    natureOfAilment: '',
                    medicinePrescribed: '',
                    procedureUndertaken: '',
                    dateOfNextAppointment: '',
                });
            })
            .catch(error => {
                toast.error('Patient editing failed!');
                console.error('Error updating clinical record:', error);
            });
    };

    const handleDelete = (id) => {
        if (isNaN(id)) {
            console.error('Invalid ID: Not a number');
            return;
        }

        console.log(`Deleting record with ID: ${id}`);
        axios.delete(`http://localhost:3000/api/clinical-record/${id}`)
            .then(response => {
                toast.success('Patient deleted successfully!');
                console.log(`Patient with ID ${id} deleted.`);
                setClinicalRecords(clinicalRecords.filter(patient => patient.id !== id));
            })
            .catch(error => {
                toast.error('patient deletion failed')
                console.error('Error deleting clinical record:', error);
            });
    };

    return (
        <div className="patients-container">
            <ToastContainer />
            {searchedPatient && (
                <div className='searched-patient-details'>
                    <h3>Searched Patient Details</h3>
                    <p>ID: {searchedPatient.id}</p>
                    <p>Clinic Date: {formatDate(searchedPatient.clinicDate)}</p>
                    <p>Nature of Ailment: {searchedPatient.natureOfAilment}</p>
                    <p>Medicine Prescribed: {searchedPatient.medicinePrescribed}</p>
                    <p>Procedure Undertaken: {searchedPatient.procedureUndertaken}</p>
                    <p>Date of Next Appointment: {formatDate(searchedPatient.dateOfNextAppointment)}</p>
                </div>
            )}
            {editMode && (
                <div className="edit-form">
                    <h3>Edit Patient</h3>
                    <label>Clinic Date:
                        <input type="date" name="clinicDate" value={editFormData.clinicDate} onChange={handleEditInputChange} />
                    </label>
                    <label>Nature Of Ailment:
                        <input type="text" name="natureOfAilment" value={editFormData.natureOfAilment} onChange={handleEditInputChange} />
                    </label>
                    <label>Medicine Prescribed:
                        <input type="text" name="medicinePrescribed" value={editFormData.medicinePrescribed} onChange={handleEditInputChange} />
                    </label>
                    <label>Procedure Undertaken:
                        <input type="text" name="procedureUndertaken" value={editFormData.procedureUndertaken} onChange={handleEditInputChange} />
                    </label>
                    <label>Date of Next Appointment:
                        <input type="date" name="dateOfNextAppointment" value={editFormData.dateOfNextAppointment} onChange={handleEditInputChange} />
                    </label>
                    <label>Patient Id:
                        <input type="number" name="patientId" value={editFormData.procedureUndertaken} onChange={handleEditInputChange} />
                    </label>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </div>
            )}

            {!searchedPatient && patientId && (
                <p className="no-patient-found">No patient found with ID {patientId}.</p>
            )}

            <h2>Patients Clinical Records</h2>
            <div className="search-container">
                <input type="text" placeholder="Enter Patient ID" value={patientId} onChange={handleChange} />
                <button onClick={handleSearch}>Search</button>
            </div>
            <table className='patients-list'>
                <thead>
                    <tr>
                        <th>Patient ID</th>
                        <th>Clinic Date</th>
                        <th>Nature Of Ailment</th>
                        <th>Medicine Prescribed</th>
                        <th>Procedure Undertaken</th>
                        <th>Date of Next Appointment</th>
                        <th>Patient Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clinicalRecords.map(clinicalRecord => (
                        <tr key={clinicalRecord.id}>
                            <td>{clinicalRecord.id}</td>
                            <td>{formatDate(clinicalRecord.clinicDate)}</td>
                            <td>{clinicalRecord.natureOfAilment}</td>
                            <td>{clinicalRecord.medicinePrescribed}</td>
                            <td>{clinicalRecord.procedureUndertaken}</td>
                            <td>{formatDate(clinicalRecord.dateOfNextAppointment)}</td>
                            <td>{clinicalRecord.patientNo}</td>
                            <td className="change-buttons">
                                <button className="edit-button" onClick={() => handleEdit(clinicalRecord)}>Edit</button>
                                <button className="delete-button" onClick={() => handleDelete(clinicalRecord.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClinicalRecordsListComponent;
