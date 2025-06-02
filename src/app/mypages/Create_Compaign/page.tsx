'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TransactionButton, useActiveAccount } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { CONTRACT } from '../../../../utils/constant';

const CreateCampaign: React.FC = () => {
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const account = useActiveAccount();
  const router = useRouter();

  const ad = account
    ? typeof account === 'string'
      ? JSON.parse(account).address
      : account.address
    : 'MetaMask not connected';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        padding: '30px',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.25)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#2c3e50',
          fontSize: '2rem',
          fontWeight: 'bold',
        }}>
          Create Campaign
        </h1>

        {successMessage && <div style={{ color: 'green', marginBottom: '15px', textAlign: 'center' }}>{successMessage}</div>}
        {errorMessage && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{errorMessage}</div>}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Campaign Name</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            style={inputStyle}
            placeholder="Enter campaign name"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: '100px' }}
            placeholder="Enter campaign description"
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
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
              console.error("Contract preparation failed:", err);
              throw err;
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
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4a90e2',
            color: 'white',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
        >
          Create Campaign
        </TransactionButton>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '16px',
  outline: 'none',
  transition: 'border 0.2s ease-in-out',
};

export default CreateCampaign;
