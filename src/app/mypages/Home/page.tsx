'use client'

import React from "react";
import { useReadContract } from "thirdweb/react";
import { CONTRACT } from '../../../../utils/constant'
import { useNumber } from "../../numberContext";
import { useRouter } from "next/navigation";

const Dashboard: React.FC = () => {
  // Fetch data from the blockchain
  const { data: companies, isLoading: loading, error } = useReadContract({
    contract: CONTRACT,
    method: "getAllCompany",
  });

  // Function to format Ethereum address (cropped format)
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };


  const { number } = useNumber();
  console.log(`number is ${number}`);
  const router = useRouter();
  const handleCardClick=(address:string)=>{
    router.push(`/mypages/Details?address=${address}`);
  }
  
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px",color: "#333"}}>Dashboard {number} this</h1>
      {loading ? (
        <p>Loading companies...</p>
      ) : error ? (
        <p>Error loading companies: {error.message}</p>
      ) : companies && companies.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {companies.map((company: any, index: number) => (
            <div
              key={index}
              onClick={()=>handleCardClick(company.Address)}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                width: "300px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                background: "#f9f9f9",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Top Section: Name and Cropped Address */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <strong style={{ fontSize: "1.2em", color: "#333" }}>{company.name}</strong>
                <span style={{ color: "#555", fontSize: "0.9em" }}>{formatAddress(company.Address)}</span>
              </div>

              {/* Middle Section: Industry and Address */}
              <div style={{ marginBottom: "10px" }}>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  <strong>Industry:</strong> {company.industry_type}
                </p>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  <strong>Address:</strong> {company.comp_address}
                </p>
              </div>

              {/* Bottom Section: Allocated and Remaining Balances */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, color: "#333" }}>
                  <strong>Allocated:</strong> {company.allocatedcarbon}
                </p>
                <p style={{ margin: 0, color: "#333" }}>
                  <strong>Remaining:</strong> {company.remaining}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No companies found.</p>
      )}
    </div>
  );
};

export default Dashboard;
