"use client";

import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
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
  const account = useActiveAccount();

  const { number, setNumber, metaMaskAddress, setMetaMaskAddress } = useNumber(); 


  const ad = account
  ? typeof account === "string"
    ? JSON.parse(account).address 
    : account.address 
  : "MetaMask not connected";

  useEffect(() => {
    if (id !== null) {
      setNumber(id); // Store the entered number in the context
    }
  }, [id,setNumber]);

  useEffect(() => {
    if (account) {
        setMetaMaskAddress(ad); // Store the MetaMask address in the context
    }
  }, [ad, setMetaMaskAddress]);


  const {
    data:result,
    isLoading:loading,
  }=useReadContract({
    contract:CONTRACT,
    method:"validateGovId",
    params:[BigInt(id),ad],
  });


  const handleLogin = async () => {
    try {
      console.log(result)
      if(result){
        router.push("/mypages/Home");
        // console.log("Hello")
      }
      else{
        console.log("sorry")
      }

    } catch (error) {
      console.error("Error validating ID:", error);
      alert("An error occurred while validating the ID.");
    }
  };

  return (
    <Container>
  <Row className="justify-content-center mt-5">
    <Col md={6}>
      <h2 className="text-center">Login</h2>
      <h2>{id}</h2>
      <Form>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Government Id</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Government Id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formId" className="mb-3">
          <Form.Label>Metamask Auto fetch Address</Form.Label>
          <p>{ad}</p>
        </Form.Group>
      </Form>

      <div className="d-flex gap-3">
        <Button onClick={handleLogin}>Login</Button>
        <Link href="/mypages/Register" className="btn btn-link">Register</Link>
      </div>
    </Col>
  </Row>
</Container>


  );
};

export default LoginPage;
