'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { TransactionButton, useActiveAccount } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { CONTRACT } from '../../../../utils/constant';

const UpdateAllocation: React.FC = () => {
  const account = useActiveAccount();
  const [companyAddress, setCompanyAddress] = useState('');
  const [newAllocation, setNewAllocation] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const ad =
    account && typeof account !== 'string'
      ? account.address
      : typeof account === 'string'
      ? JSON.parse(account).address
      : 'MetaMask not connected';

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '500px',
        margin: '60px auto',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '25px',
          fontSize: '1.7rem',
          fontWeight: 600,
          color: '#2c3e50',
        }}
      >
        Update Company Allocation
      </h2>

      {successMessage && (
        <div
          style={{
            background: '#d4edda',
            color: '#155724',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '15px',
            textAlign: 'center',
          }}
        >
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '15px',
            textAlign: 'center',
          }}
        >
          {errorMessage}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 500, color: '#333' }}>
          Company Address:
        </label>
        <input
          type="text"
          value={companyAddress}
          onChange={(e) => setCompanyAddress(e.target.value)}
          placeholder="0x..."
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginTop: '6px',
            fontSize: '15px',
          }}
        />
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontWeight: 500, color: '#333' }}>
          New Carbon Allocation:
        </label>
        <input
          type="number"
          value={newAllocation}
          onChange={(e) => setNewAllocation(e.target.value)}
          placeholder="Enter new allocation amount"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginTop: '6px',
            fontSize: '15px',
          }}
        />
      </div>

      <TransactionButton
        transaction={async () => {
          try {
            const tx = await prepareContractCall({
              contract: CONTRACT,
              method: 'updateAllocatedCarbon',
              params: [BigInt(newAllocation), companyAddress, ad],
            });
            return tx;
          } catch (err) {
            console.error('Error preparing transaction:', err);
            throw err;
          }
        }}
        onTransactionSent={() => console.log('Transaction sent...')}
        onTransactionConfirmed={() => {
          console.log('Transaction confirmed!');
          setSuccessMessage('Allocation updated successfully!');
          setErrorMessage('');
        }}
        onError={(err) => {
          console.error('Transaction error:', err);
          setErrorMessage(`Error: ${err.message}`);
          setSuccessMessage('');
        }}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#007bff',
          color: '#fff',
          fontWeight: 600,
          fontSize: '16px',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.3s ease',
        }}
      >
        🚀 Update Allocation
      </TransactionButton>
    </div>
  );
};

export default UpdateAllocation;
