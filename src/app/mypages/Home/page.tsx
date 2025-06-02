'use client'

import React from "react";
import { useReadContract } from "thirdweb/react";
import { CONTRACT } from '../../../../utils/constant';
import { useNumber } from "../../numberContext";
import { useRouter } from "next/navigation";

const Dashboard: React.FC = () => {
  const { data: companies, isLoading: loading, error } = useReadContract({
    contract: CONTRACT,
    method: "getAllCompany",
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const { number } = useNumber();
  console.log(`number is ${number}`);
  const router = useRouter();

  const handleCardClick = (address: string) => {
    router.push(`/mypages/Details?address=${address}`);
  };

  return (
    <div style={{
      padding: "40px",
      minHeight: "100vh",
      background: "linear-gradient(to right, #e3f2fd, #fce4ec)",
    }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "40px",
        color: "#2c3e50",
        fontSize: "2.5rem",
        fontWeight: "bold",
      }}>
        Company Dashboard
      </h1>

      {loading ? (
        <p style={{ textAlign: "center", color: "#888" }}>Loading companies...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>Error loading companies: {String(error)}</p>
      ) : companies && companies.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          padding: "0 20px",
        }}>
          {companies.map((company: any, index: number) => (
            <div
              key={index}
              onClick={() => handleCardClick(company.Address)}
              style={{
                cursor: "pointer",
                borderRadius: "15px",
                padding: "20px",
                background: "#ffffff",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px"
              }}>
                <h2 style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "#2c3e50"
                }}>{company.name}</h2>
                <span style={{
                  color: "#777",
                  fontSize: "0.9rem"
                }}>{formatAddress(company.Address)}</span>
              </div>

              <div style={{ marginBottom: "12px", color: "#555" }}>
                <p><strong>Industry:</strong> {company.industry_type}</p>
                <p><strong>Address:</strong> {company.comp_address}</p>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#333",
                fontWeight: 500
              }}>
                <p><strong>Allocated:</strong> {company.allocatedcarbon}</p>
                <p><strong>Remaining:</strong> {company.remaining}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#666" }}>No companies found.</p>
      )}
    </div>
  );
};

export default Dashboard;
