import React from 'react'
import './style.css'
// import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card'

export default function ContactUs() {
 
    // const navigate = useNavigate();

    return (
      <div className='contact-container'>
        <h2 className='contact-title'>Contact Us</h2>
        <div className='row contact-row'>
            <div className='col-3 contact-col'>
                <Card>
                    <Card.Img variant="top" src="holder.js/100px160" className='contact-img'></Card.Img>
                    <Card.Body className='contact-body'>
                        <Card.Title className='contact-name'>Shivani Eranjikal</Card.Title>
                        <Card.Subtitle>Software Developer</Card.Subtitle>
                    </Card.Body>
                </Card>
            </div>
            <div className='col-3 contact-col'>
                <Card>
                    <Card.Img variant="top" src="holder.js/100px160" className='contact-img'></Card.Img>
                    <Card.Body className='contact-body'>
                        <Card.Title className='contact-name'>Naitik Shah</Card.Title>
                        <Card.Subtitle>Software Developer</Card.Subtitle>
                    </Card.Body>
                </Card>
            </div>
            <div className='col-3 contact-col'>
                <Card>
                    <Card.Img variant="top" src="holder.js/100px160" className='contact-img'></Card.Img>
                    <Card.Body className='contact-body'>
                        <Card.Title className='contact-name'>Sankaralingam</Card.Title>
                        <Card.Subtitle>Software Developer</Card.Subtitle>
                    </Card.Body>
                </Card>
            </div>
            <div className='col-3 contact-col'>
                <Card>
                    <Card.Img variant="top" src="holder.js/100px160" className='contact-img'></Card.Img>
                    <Card.Body className='contact-body'>
                        <Card.Title className='contact-name'>Shubham Bhattad</Card.Title>
                        <Card.Subtitle>Software Developer</Card.Subtitle>
                    </Card.Body>
                </Card>
            </div>
        </div>

      </div>
    )
}