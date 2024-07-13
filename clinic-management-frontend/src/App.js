import React, { useState } from 'react';
import './App.css';
import PatientsComponent from './components/createPatientsComponent';
import ClinicalRecordsComponent from './components/createClinicalRecordsComponent';
import PatientsListComponent from './components/patientsListComponent';
import ClinicalRecordsListComponent from './components/clinicalRecordsListComponent';
import Homecomponent from './components/homeComponent';

function App() {
  const [activeTab, setActiveTab] = useState('home'); // Initial active tab

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <Homecomponent />;
      case 'patients':
        return <PatientsComponent />;
      case 'clinicalRecords':
        return <ClinicalRecordsComponent />;
      case 'viewClinicalRecords':
          return <ClinicalRecordsListComponent/>;
      case  'viewPatients':
          return <PatientsListComponent/>;
      default:
        return null; // Handle unexpected tab names
    }
  };

  return (
    <div className="App">
      <main>
        <div className="tabs">

        <button id = 'switch'
            className={activeTab === 'home' ? 'active' : ''}
            onClick={() => handleTabClick('home')}
          >
            Home
          </button>
          <button id = 'switch'
            className={activeTab === 'patients' ? 'active' : ''}
            onClick={() => handleTabClick('patients')}
          >
            Add Patient
          </button>
          <button id = 'switch'
            className={activeTab === 'clinicalRecords' ? 'active' : ''}
            onClick={() => handleTabClick('clinicalRecords')}
          >
            Add Clinical Records
          </button>

          <button id = 'switch'
            className={activeTab === 'viewPatients' ? 'active' : ''}
            onClick={() => handleTabClick('viewPatients')}
          >
            View Patients
          </button>
          <button id = 'switch'
            className={activeTab === 'viewClinicalRecords' ? 'active' : ''}
            onClick={() => handleTabClick('viewClinicalRecords')}
          >
           View Clinical Records
          </button>
        </div>
        <div className="content">{renderActiveComponent()}</div>
      </main>
      
    </div>
  );
}

export default App;
