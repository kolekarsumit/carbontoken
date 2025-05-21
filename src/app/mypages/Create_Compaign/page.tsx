'use client'

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';  // For navigation after creating the campaign
import { TransactionButton ,useActiveAccount} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { CONTRACT } from '../../../../utils/constant';

const CreateCampaign: React.FC = () => {
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
      const account=useActiveAccount();
  
  const router = useRouter();
  const ad = account
  ? typeof account === "string"
    ? JSON.parse(account).address 
    : account.address 
  : "MetaMask not connected";



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





      <TransactionButton
  transaction={async () => {
    try {
      const tx = await prepareContractCall({
        contract: CONTRACT,
        method: "createCampaign",
        params: [campaignName, description, BigInt(new Date(endDate).getTime()), ad],
      });

      return tx;
    } catch (err) {
      console.error("Contract preparation failed:", err); // Log the error to console
      throw err; // Important to rethrow so TransactionButton knows it's an error
    }
  }}
  onTransactionSent={() => console.log("Transaction sent...")}
  onTransactionConfirmed={() => {
    console.log("Transaction confirmed!");
    setSuccessMessage('Campaign created successfully!');
    setErrorMessage('');
    router.push('/mypages/View_Compaign');
  }}
  onError={(error) => {
    console.error("Transaction error:", error);
    setErrorMessage(`Error: ${error.message}`);
    setSuccessMessage('');
  }}
>
  Create 1
</TransactionButton>

    </div>
  );
};

export default CreateCampaign;
