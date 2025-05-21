'use client'
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
 

  const ad = account
  ? typeof account === "string"
    ? JSON.parse(account).address 
    : account.address 
  : "MetaMask not connected";
 
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Company Allocation</h2>

      {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}

      <div style={{ marginBottom: '15px' }}>
        <label>Company Address:</label>
        <input
          type="text"
          value={companyAddress}
          onChange={(e) => setCompanyAddress(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>New Carbon Allocation:</label>
        <input
          type="number"
          value={newAllocation}
          onChange={(e) => setNewAllocation(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <TransactionButton
        transaction={async () => {
          try {
            const tx = await prepareContractCall({
              contract: CONTRACT,
              method: 'updateAllocatedCarbon',
              params: [BigInt(newAllocation), companyAddress,ad],
            });
            return tx;
          } catch (err) {
            console.error("Error preparing transaction:", err);
            throw err;
          }
        }}
        onTransactionSent={() => console.log("Transaction sent...")}
        onTransactionConfirmed={() => {
          console.log("Transaction confirmed!");
          setSuccessMessage("Allocation updated successfully!");
          setErrorMessage('');
        }}
        onError={(err) => {
          console.error("Transaction error:", err);
          setErrorMessage(`Error: ${err.message}`);
          setSuccessMessage('');
        }}
      >
        Update Allocation
      </TransactionButton>
    </div>
  );
};

export default UpdateAllocation;
