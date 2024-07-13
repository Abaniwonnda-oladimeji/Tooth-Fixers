import React, { useState } from 'react';
import axios from 'axios';

const ClinicalRecordsComponent = () => {
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({
        clinicDate: '',
        natureOfAilment: '',
        medicinePrescribed: '',
        procedureUndertaken: '',
        dateOfNextAppointment: '',
        patientNo: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/clinical-record', formData)
            .then(response => setRecords([...records, response.data]))
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h2>Add Clinical Record</h2>
            <form onSubmit={handleSubmit}>
                <p class = 'dob'>Clinic Date</p>
                <input name="clinicDate" type="date" onChange={handleChange} />
                <input name="natureOfAilment" placeholder="Nature of Ailment" onChange={handleChange} />
                <input name="medicinePrescribed" placeholder="Medicine Prescribed" onChange={handleChange} />
                <input name="procedureUndertaken" placeholder="Procedure Undertaken" onChange={handleChange} />
                <p class = 'dob'>Date of Next Appointment</p>
                <input name="dateOfNextAppointment" type="date" onChange={handleChange} />
                <input name="patientNo" placeholder = "PatientNo" type="number" onChange={handleChange} />
                <button type="submit" class = 'submit'>Add Record</button>
            </form>

        </div>
    );
};

export default ClinicalRecordsComponent;
