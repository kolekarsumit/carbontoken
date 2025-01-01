'use client';
import React, { useEffect, useState } from "react";
import { CONTRACT } from "../../../../utils/constant";
import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { useNumber } from "@/app/numberContext";

// Helper function to convert YearMonth to 'Month Year'
const formatYearMonth = (yearMonth: number) => {
  const yearStr = yearMonth.toString();
  const year = yearStr.slice(0, 4);
  const monthNumber = parseInt(yearStr.slice(4, 6));
  

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthName = monthNames[monthNumber - 1] || "Invalid Month";
  return `${monthName} ${year}`;
};

const AllocationPage: React.FC = () => {
  
  const { number } = useNumber();
  console.log(`number is ${number}`);
  const govId = number?number:0;

  // State to store formatted data
  const [formattedData, setFormattedData] = useState<{ yearMonth: number; value: number }[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Controls popup visibility
  const [yearMonthInput, setYearMonthInput] = useState(""); // YearMonth input
  const [valueInput, setValueInput] = useState(""); // Value input


  const account=useActiveAccount();
  const ad = account
  ? typeof account === "string"
    ? JSON.parse(account).address 
    : account.address 
  : "MetaMask not connected";

  // Fetch data from the contract
  const { data: contractData, isLoading, error, refetch ,} = useReadContract({
    contract: CONTRACT,
    method: "getYearMonthData",
    params: [ad],
  });

  

  const {data: remaining}=useReadContract({
    contract:CONTRACT,
    method:"getRemainingCarbon",
    params:[ad]
  })

  const {data: allocated}=useReadContract({
    contract:CONTRACT,
    method:"getAllocatedCarbon",
    params:[ad]
  })

  useEffect(() => {
    if (contractData) {
      const [yearMonths, values] = contractData;

      const data = yearMonths.map((yearMonth: bigint, index: number) => ({
        yearMonth: Number(yearMonth),
        value: Number(values[index]),
      }));

      setFormattedData(data);
    }
  }, [contractData]);

 console.log(`year month ${yearMonthInput}`)
 console.log(`value ${valueInput}`)


  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Allocation Data</h1>

      {/* Top Bar for Emission Index */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Allocated Emission: {allocated}
        </span>
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Available Emission: {remaining}
        </span>
      </div>

      {/* Data Rows */}
      {formattedData.length > 0 ? (
        formattedData.map((entry, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 25px",
              marginBottom: "15px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#334e68", fontSize: "18px" }}>
              {formatYearMonth(entry.yearMonth)}
            </span>
            <span style={{ fontSize: "18px", color: "#102a43", fontWeight: "bold" }}>
              Value: {entry.value}
            </span>
          </div>
        ))
      ) : (
        <h2 style={{ textAlign: "center", color: "#888" }}>No data available</h2>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsPopupOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
        }}
      >
        +
      </button>

      {/* Popup Form */}
      {isPopupOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              width: "400px",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add New Data</h2>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>YearMonth:</label>
              <input
                type="number"
                value={yearMonthInput}
                onChange={(e) => setYearMonthInput(e.target.value)}
                placeholder="e.g., 202401"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "bold" }}>Value:</label>
              <input
                type="number"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                placeholder="e.g., 5000"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button
                onClick={() => setIsPopupOpen(false)}
                style={{
                  padding: "8px 15px",
                  borderRadius: "4px",
                  backgroundColor: "#ddd",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <TransactionButton
                transaction={() =>
                  prepareContractCall({
                    contract: CONTRACT,
                    method: "storeYearMonthData",
                    params: [ad, BigInt(yearMonthInput), BigInt(valueInput)],
                  })
                }
                onTransactionSent={() => console.log("Month data adding ...")}
                onTransactionConfirmed={() => {
                  console.log("Month data added");
                  refetch();
                }}
              >
                Add Data
              </TransactionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationPage;
