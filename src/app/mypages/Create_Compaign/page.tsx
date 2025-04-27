'use client'

import React, { useState } from 'react';
// import { useContract } from 'thirdweb/react';  // Thirdweb hook for interacting with the contract
// import { CONTRACT } from '../../../utils/constant';  // Contract details
import { useRouter } from 'next/navigation';  // For navigation after creating the campaign

const CreateCampaign: React.FC = () => {
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();

  // Using thirdweb's useContract hook to interact with the contract
//   const { contract } = useContract(CONTRACT);

  // Function to handle form submission
  const handleCreateCampaign = async () => {
    try {
      if (!campaignName || !description || !startDate || !endDate) {
        setErrorMessage('Please fill in all fields.');
        return;
      }
      
      // Call the smart contract method to create the campaign
    //   const tx = await contract.call('createCampaign', [campaignName, description, startDate, endDate]);
      
      // Wait for the transaction to be confirmed
    //   await tx.wait();

      setSuccessMessage('Campaign created successfully!');
      router.push('/mypages/View_Compaign');  // Redirect to View Campaign page after success
    } catch (error: any) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Create Campaign</h1>
      
      {successMessage && <div style={{ marginBottom: '10px', color: 'green' }}>{successMessage}</div>}
      {errorMessage && <div style={{ marginBottom: '10px', color: 'red' }}>{errorMessage}</div>}

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="campaignName" style={{ display: 'block', marginBottom: '5px' }}>Campaign Name</label>
        <input
          type="text"
          id="campaignName"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
            minHeight: '100px',
          }}
        />
      </div>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
        <div style={{ width: '48%' }}>
          <label htmlFor="startDate" style={{ display: 'block', marginBottom: '5px' }}>Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
        </div>

        <div style={{ width: '48%' }}>
          <label htmlFor="endDate" style={{ display: 'block', marginBottom: '5px' }}>End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
        </div>
      </div>

      <button
        onClick={handleCreateCampaign}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Create Campaign
      </button>
    </div>
  );
};

export default CreateCampaign;
