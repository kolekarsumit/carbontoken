"use client";

import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { CONTRACT } from '../../../../utils/constant';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNumber } from '@/app/numberContext';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [id, setId] = useState('');
  const [industry, setIndustry] = useState('');
  const account = useActiveAccount();

  const { number, setNumber, metaMaskAddress, setMetaMaskAddress } = useNumber();

  const ad =
    account && typeof account !== 'string'
      ? account.address
      : typeof account === 'string'
      ? JSON.parse(account).address
      : 'MetaMask not connected';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { name, address, id, industry, account });
  };

  const handleLoginRedirect = () => {
    router.push("/mypages/Login");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '30px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h2 className="text-center mb-4">Company Registration</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label className="fw-semibold">Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formAddress" className="mb-3">
            <Form.Label className="fw-semibold">Company Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter company address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formId" className="mb-3">
            <Form.Label className="fw-semibold">Government ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formIndustry" className="mb-3">
            <Form.Label className="fw-semibold">Emission Industry</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your emission industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formMetaMask" className="mb-3">
            <Form.Label className="fw-semibold">MetaMask Address</Form.Label>
            <div
              style={{
                backgroundColor: '#f1f1f1',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              {account
                ? typeof account === 'string'
                  ? account
                  : JSON.stringify(account)
                : 'MetaMask not connected'}
            </div>
          </Form.Group>

          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract: CONTRACT,
                method: "add_company",
                params: [name, industry, BigInt(id), address],
              })
            }
            onTransactionSent={() => console.log("Submitting registration...")}
            onTransactionConfirmed={() => {
              console.log("Registration successful!");
              router.push("/mypages/Home");
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#007bff',
              color: '#fff',
              fontWeight: 600,
              fontSize: '16px',
              border: 'none',
              marginTop: '10px',
            }}
          >
            🚀 Submit Registration
          </TransactionButton>

          <Button
            variant="link"
            onClick={handleLoginRedirect}
            className="mt-3 w-100 text-center"
          >
            Already have an account? <strong>Login here</strong>
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default RegisterPage;
