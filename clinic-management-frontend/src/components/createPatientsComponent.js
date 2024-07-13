import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './CSS-Components/createPatientsComponents.css';
import 'react-toastify/dist/ReactToastify.css';

const PatientsComponent = () => {
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        middleName: '',
        dateOfBirth: '',
        homeAddress: '',
        dateOfRegistration: '',
        matriculationNumber: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        axios.post('http://localhost:3000/api/patient', formData)
            .then(response => {
                toast.success('Patient Created successfully!');
                setPatients([...patients, response.data])})
            .catch(error => console.error(error));
    };

    return (
        <div class = 'patientform'>
            <ToastContainer />
            <h2>Add Patient</h2>
            <form onSubmit={handleSubmit}>
                <input name="firstName" placeholder="  First Name" onChange={handleChange} />
                <input name="surName" placeholder="  Surname" onChange={handleChange} />
                <input name="middleName" placeholder="  Middle Name" onChange={handleChange} />
                <p class = 'dob'>Date of Birth</p>
                <input name="dateOfBirth" type="date" onChange={handleChange} placeholder = "Date of Birth"/>
                <input name="homeAddress" placeholder=" Home Address" onChange={handleChange} />
                <p class = 'dob'>Date of Registration</p>
                <input name="dateOfRegistration" type="date" onChange={handleChange} placeholder = 'Registration Date' />
                <input name="_22120612795" placeholder=" Matriculation Number" onChange={handleChange} />
                <button id = 'submit' class = 'submit' type="submit">Add Patient</button>
            </form>
        </div>
    );
};

export default PatientsComponent;
