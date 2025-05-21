'use client';

import React from 'react';
import { CONTRACT } from '../../../../utils/constant';
import { useReadContract,/* useWriteContract, useAddress */useActiveAccount,TransactionButton} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
const ViewCampaigns: React.FC = () => {
  const address = useActiveAccount(); // Current connected company
  const { data: campaigns, isLoading, error } = useReadContract({
    contract: CONTRACT,
    method: 'getAllCampaigns',
  });

  // const { mutateAsync: takeCampaign } = useWriteContract(CONTRACT);
  // const { mutateAsync: markCompleted } = useWriteContract(CONTRACT);

  const handleTakeCampaign = async (index: number) => {
    try {
      // await takeCampaign({
      //   method: 'takeCampaign',
      //   params: [index],
      // });
      alert('Campaign successfully taken!');
    } catch (err) {
      alert('Error taking campaign');
      console.error(err);
    }
  };

  const handleMarkCompleted = async (index: number) => {
    try {
      // await markCompleted({
      //   method: 'markCompleted',
      //   params: [index],
      // });
      alert('Campaign marked as completed!');
    } catch (err) {
      alert('Error marking campaign as completed');
      console.error(err);
    }
  };

      
  const ad = address
  ? typeof address === "string"
    ? JSON.parse(address).address 
    : address.address 
  : "MetaMask not connected";

  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Available Campaigns</h1>
      {/* <h2>{address}</h2> */}

      {isLoading ? (
        <p>Loading campaigns...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : campaigns && campaigns.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {campaigns.map((camp: any, index: number) => {
            const isTaken = camp.takenBy !== '0x0000000000000000000000000000000000000000';
            const isCompleted = camp.isCompleted;
            const isTakenByCurrent = address &&  camp.takenBy.toLowerCase() === ad.toLowerCase();

            return (
              <div
                key={index}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '15px',
                  width: '300px',
                  background: '#fff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              >
                <h3 style={{ color: '#333' }}>{camp.name}</h3>
                <h4>taken {isTakenByCurrent}</h4>
                <p style={{ color: '#555' }}>{camp.description}</p>
                <p>
                  <strong>Deadline:</strong>{' '}
                  {new Date(Number(camp.deadline) * 1000).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  {isCompleted ? (
                    '✅ Completed'
                  ) : !isTaken ? (
                    '🟢 Available'
                  ) : isTakenByCurrent ? (
                    '🟡 Taken by you'
                  ) : (
                    `🔴 Taken by ${formatAddress(camp.takenBy)}`
                  )}
                </p>

                {/* TAKE CAMPAIGN button */}
                {!isCompleted && !isTaken && (
                   <TransactionButton
                       transaction={()=>prepareContractCall({
                                               contract:CONTRACT,
                                               method:"takeCampaign",
                                               params:[BigInt(index)],
                                           })}
                                           onTransactionSent={()=>console.log("Data adding ...")}
                                           onTransactionConfirmed={()=>
                                           {
                                               console.log("Data added sucessfully");
                                           }   
                                           }
                                           onError={(err) => console.error('Error taking campaign:', err)}
                   >
                    Take  1
                   </TransactionButton>
                  




                  // <button
                    // onClick={() => handleTakeCampaign(index)}
                  //   style={{
                  //     marginTop: '10px',
                  //     padding: '8px 12px',
                  //     border: 'none',
                  //     borderRadius: '5px',
                  //     backgroundColor: '#28a745',
                  //     color: '#fff',
                  //     cursor: 'pointer',
                  //   }}
                  // >
                  //   Take Campaign
                  // </button>
                )}

                {/* MARK COMPLETED button (only by owner and if not completed) */}
                {!isCompleted && isTakenByCurrent && (

                         <TransactionButton
                                 transaction={()=>prepareContractCall({
                        contract:CONTRACT,
                        method:"markCompleted",
                        params:[BigInt(index)],
                    })}
                    onTransactionSent={()=>console.log("Data adding ...")}
                    onTransactionConfirmed={()=>
                    {
                        console.log("Data added sucessfully");
                    }   
                    }
                    onError={(err) => console.error('Error taking campaign:', err)}
                     >
                       as Completed
                 </TransactionButton>





                  // <button
                  //   onClick={() => handleMarkCompleted(index)}
                  //   style={{
                  //     marginTop: '10px',
                  //     padding: '8px 12px',
                  //     border: 'none',
                  //     borderRadius: '5px',
                  //     backgroundColor: '#007bff',
                  //     color: '#fff',
                  //     cursor: 'pointer',
                  //   }}
                  // >
                  //   Mark as Completed
                  // </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No campaigns available.</p>
      )}
    </div>
  );
};

export default ViewCampaigns;
