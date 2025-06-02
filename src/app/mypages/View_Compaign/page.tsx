'use client';

import React from 'react';
import { CONTRACT } from '../../../../utils/constant';
import {
  useReadContract,
  useActiveAccount,
  TransactionButton,
} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';

const ViewCampaigns: React.FC = () => {
  const address = useActiveAccount();

  const { data: campaigns, isLoading, error } = useReadContract({
    contract: CONTRACT,
    method: 'getAllCampaigns',
  });

  const ad = address
    ? typeof address === 'string'
      ? JSON.parse(address).address
      : address.address
    : 'MetaMask not connected';

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <div
      style={{
        padding: '40px',
        background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#2c3e50',
        }}
      >
        Available Campaigns
      </h1>

      {isLoading ? (
        <p>Loading campaigns...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : campaigns && campaigns.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '30px',
            justifyContent: 'center',
          }}
        >
          {campaigns.map((camp: any, index: number) => {
            const isTaken =
              camp.takenBy !==
              '0x0000000000000000000000000000000000000000';
            const isCompleted = camp.isCompleted;
            const isTakenByCurrent =
              address && camp.takenBy.toLowerCase() === ad.toLowerCase();

            return (
              <div
                key={index}
                style={{
                  borderRadius: '16px',
                  padding: '20px',
                  width: '320px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    'translateY(0)';
                }}
              >
                <h3
                  style={{
                    color: '#2c3e50',
                    fontSize: '1.3rem',
                    marginBottom: '10px',
                    fontWeight: 600,
                  }}
                >
                  {camp.name}
                </h3>

                <p
                  style={{
                    color: '#555',
                    fontSize: '0.95rem',
                    marginBottom: '10px',
                  }}
                >
                  {camp.description}
                </p>

                <p style={{ fontSize: '0.85rem', color: '#777' }}>
                  <strong>Deadline:</strong>{' '}
                  {new Date(Number(camp.deadline) * 1000).toLocaleDateString()}
                </p>

                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                  <strong>Status:</strong>{' '}
                  {isCompleted ? (
                    <span style={{ color: '#28a745' }}>✅ Completed</span>
                  ) : !isTaken ? (
                    <span style={{ color: '#17a2b8' }}>🟢 Available</span>
                  ) : isTakenByCurrent ? (
                    <span style={{ color: '#ffc107' }}>🟡 Taken by you</span>
                  ) : (
                    <span style={{ color: '#dc3545' }}>
                      🔴 Taken by {formatAddress(camp.takenBy)}
                    </span>
                  )}
                </p>

                {/* TAKE CAMPAIGN */}
                {!isCompleted && !isTaken && (
                  <TransactionButton
                    transaction={() =>
                      prepareContractCall({
                        contract: CONTRACT,
                        method: 'takeCampaign',
                        params: [BigInt(index)],
                      })
                    }
                    onTransactionSent={() =>
                      console.log('Taking campaign...')
                    }
                    onTransactionConfirmed={() =>
                      console.log('Campaign successfully taken')
                    }
                    onError={(err) =>
                      console.error('Error taking campaign:', err)
                    }
                    style={{
                      marginTop: '15px',
                      padding: '10px',
                      width: '100%',
                      borderRadius: '8px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '15px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                    }}
                  >
                    🤝 Take Campaign
                  </TransactionButton>
                )}

                {/* MARK COMPLETED */}
                {!isCompleted && isTakenByCurrent && (
                  <TransactionButton
                    transaction={() =>
                      prepareContractCall({
                        contract: CONTRACT,
                        method: 'markCompleted',
                        params: [BigInt(index)],
                      })
                    }
                    onTransactionSent={() =>
                      console.log('Marking completed...')
                    }
                    onTransactionConfirmed={() =>
                      console.log('Marked as completed')
                    }
                    onError={(err) =>
                      console.error('Error marking completed:', err)
                    }
                    style={{
                      marginTop: '12px',
                      padding: '10px',
                      width: '100%',
                      borderRadius: '8px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '15px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease',
                    }}
                  >
                    ✅ Mark as Completed
                  </TransactionButton>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#999' }}>
          No campaigns available.
        </p>
      )}
    </div>
  );
};

export default ViewCampaigns;
