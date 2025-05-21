'use client'

import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { chain, client } from "../../../utils/constant";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


const Navbar: React.FC = () => {
  const account = useActiveAccount();
  

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Left Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "20px",
            color: "black",
            fontWeight: "bold",
          }}
        >
          Carbon Token
        </h1>

        {account ? (
          <div style={{ display: "flex", gap: "15px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                color: "black",
                fontWeight: "bold",
              }}
              
            >
             <Link href="/mypages/Home">Home</Link>
            </h1>
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                color: "black",
                fontWeight: "bold",
              }}
            >
             <Link href="/mypages/Wallet">Wallet</Link>
            </h1>
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                color: "black",
                fontWeight: "bold",
              }}
            >
             
             <Link href="/mypages/Profile">Profile</Link>
            </h1>

            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                color: "black",
                fontWeight: "bold",
              }}
            >
             <Link href="/mypages/Create_Compaign">Create Campaign</Link>
            </h1>

            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                color: "black",
                fontWeight: "bold",
              }}
            >
             <Link href="/mypages/View_Compaign">View Campaign</Link>
            </h1>

            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                color: "black",
                fontWeight: "bold",
              }}
            >
             <Link href="/mypages/Allocate_Carbon">Allocate Carbon</Link>
            </h1>
            
          </div>
        ) : (
      
        <h1></h1>
        )}
      </div>

      {/* Right Section */}
      <div>
        <ConnectButton client={client} chain={chain} />
      </div>
    </div>
  );
};

export default Navbar;
