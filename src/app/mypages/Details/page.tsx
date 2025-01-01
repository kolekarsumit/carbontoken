'use client'

import React from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { CONTRACT } from "../../../../utils/constant";
import { Container, Row, Col } from "react-bootstrap";
import { useNumber } from "../../numberContext";
import { useSearchParams } from "next/navigation";

const Details_page: React.FC = () => {
  
  // Fetch the own company's data from the blockchain

  
    const { number } = useNumber();
    console.log(`number is ${number}`);
 

    const searchParams = useSearchParams();
    const account = searchParams.get("address");
    
  
  const ad = account;

  const { data: company, isLoading: loading, error } = useReadContract({
    contract: CONTRACT,
    method: "getmycompany",
    params: [ad?ad:""],               
  });


// console.log(`Current Metamask Address:  ${account?.address} and this demo text `);
console.log("Company data:", company);

  return (
    <Container fluid="md" style={{ padding: "20px", backgroundColor: "#fff" }}>
      <h1 className="my-4 text-center" style={{ fontSize: "2rem", fontWeight: "bold" ,color: "#333"}}>{company?.name} </h1>

      {loading ? (
        <div className="text-center">
          <p>Loading profile...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <p>Error loading profile: {error.message}</p>
        </div>
      ) : company ? (
        <Row>
          <Col md={12}>
            {/* Profile Content */}
            <div style={{ padding: "20px" }}>
              {/* Company Name and MetaMask Address */}
              <div style={infoRowStyle}>
                <div style={labelStyle}>Company Name:</div>
                <div style={labelStyle1}>{company.name}</div>
              </div>
              <div style={infoRowStyle}>
                <div style={labelStyle}>MetaMask Address:</div>
                <div style={labelStyle1}>{company.Address.slice(0, 6)}...{company.Address.slice(-4)}</div>
              </div>

              {/* Industry Type and Company Address */}
              <div style={infoRowStyle}>
                <div style={labelStyle}>Industry:</div>
                <div style={labelStyle1}>{company.industry_type}</div>
              </div>
              <div style={infoRowStyle}>
                <div style={labelStyle}>Company Address:</div>
                <div style={labelStyle1}>{company.comp_address}</div>
              </div>

              {/* Allocated and Remaining Carbon Balance */}
              <div style={infoRowStyle}>
                <div style={labelStyle}>Allocated Carbon:</div>
                <div style={labelStyle1}>{company.allocatedcarbon}</div>
              </div>
              <div style={infoRowStyle}>
                <div style={labelStyle}>Remaining Carbon:</div>
                <div style={labelStyle1}>{company.remaining}</div>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <div className="text-center">
          <p>No company data found.</p>
        </div>
      )}
    </Container>
  );
};

// Inline style objects
const infoRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px 20px",
  borderBottom: "1px solid #e0e0e0",
  marginBottom: "15px", // Adding margin to create space between rows
  backgroundColor: "#ffffff",
  borderRadius: "8px", // Adding rounded corners
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)", // Adding shadow to each row
};

const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "#333",
  fontSize: "1.1rem",
  marginRight: "10px", // Add spacing between label and data
};
const labelStyle1: React.CSSProperties = {
    fontWeight: "bold",
    color: "#6b4f4f",
    fontSize: "1.1rem",
    marginRight: "10px", // Add spacing between label and data
  };

export default Details_page;