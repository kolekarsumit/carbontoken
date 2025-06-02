"use client";

import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import {
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { CONTRACT } from "../../../../utils/constant";
import { useRouter } from "next/navigation";
import { useNumber } from "@/app/numberContext";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const router = useRouter(); 
  const [id, setId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const account = useActiveAccount();
  const { number, setNumber, metaMaskAddress, setMetaMaskAddress } = useNumber(); 

  const ad = account && typeof account !== "string"
    ? account.address 
    : typeof account === "string"
    ? JSON.parse(account).address 
    : "MetaMask not connected";

  useEffect(() => {
    if (id !== null) {
      setNumber(id);
    }
  }, [id, setNumber]);

  useEffect(() => {
    if (account) {
      setMetaMaskAddress(ad);
    }
  }, [ad, setMetaMaskAddress]);

  const {
    data: result,
    isLoading: loading,
  } = useReadContract({
    contract: CONTRACT,
    method: "validateGovId",
    params: [BigInt(id || 0), ad],
  });

  const handleLogin = async () => {
    try {
      if (result) {
        router.push("/mypages/Home");
      } else {
        setErrorMessage("Invalid Government ID or MetaMask address.");
      }
    } catch (error) {
      console.error("Error validating ID:", error);
      setErrorMessage("An error occurred while validating the ID.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "30px",
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h2 className="text-center mb-4">Company Login</h2>

        <Form>
          <Form.Group controlId="formGovId" className="mb-3">
            <Form.Label className="fw-semibold">Government ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your government ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formMetaMask" className="mb-3">
            <Form.Label className="fw-semibold">MetaMask Address</Form.Label>
            <div
              style={{
                backgroundColor: "#f1f1f1",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              {ad}
            </div>
          </Form.Group>

          {errorMessage && (
            <p className="text-danger text-center mt-2">{errorMessage}</p>
          )}

          <div className="d-grid gap-2 mt-4">
            <Button
              variant="primary"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Login"}
            </Button>

            <Link href="/mypages/Register" className="btn btn-link text-center">
              Don’t have an account? <strong>Register here</strong>
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
