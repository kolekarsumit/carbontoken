"use client";

import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { ConnectButton, ThirdwebProvider, TransactionButton, useActiveAccount } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { CONTRACT } from '../../../../utils/constant'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNumber } from '@/app/numberContext';

const RegisterPage: React.FC = () => {

    const rount=useRouter();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [id, setId] = useState('');
    const [industry, setIndustry] = useState('');

    const account=useActiveAccount();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted with:", { name, address, id,industry,account });
        
    console.log("curret metamask address: "+address);
    };
    const handleLoginRedirect = () => {
        rount.push("/mypages/Login");
    };     
    
    //   const [id, setId] = useState("");
    
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
    
    

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    <h2 className="text-center">Register </h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formAddress" className="mb-3">
                            <Form.Label>Company Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formId" className="mb-3">
                            <Form.Label>Government ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your ID"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formId" className="mb-3">
                            <Form.Label>Emission Industry</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your ID"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formId" className="mb-3">
                            <Form.Label>Metamask Address</Form.Label>    
                            <p>
                            {account ? (typeof account === "string" ? account : JSON.stringify(account)) : " MetaMask not connected"}
           </p>
                        </Form.Group>


                        <TransactionButton
                        transaction={()=>prepareContractCall({
                            contract:CONTRACT,
                            method:"add_company",
                            params:[name,industry,BigInt(id),address],
                        })}
                        onTransactionSent={()=>console.log("Data adding ...")}
                        onTransactionConfirmed={()=>
                        {
                            console.log("Data added sucessfully");
                            rount.push("/mypages/Home");
                        }   
                        }
                        > Submit </TransactionButton>
                        

                        {/* <Link href="\components\LoginPage.tsx"> go to login</Link> */}
  <Button variant="link" onClick={handleLoginRedirect} className="mt-3">
                            Already have an account? Login here
                        </Button>




                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;



