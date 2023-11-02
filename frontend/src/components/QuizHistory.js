import React, { useState, useEffect } from 'react'
import './style.css'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Footer from './Footer';

export default function QuizHistory() {
    
    const navigate = useNavigate();
    const [filterModal, setFilterModal] = useState(false);

    const [filterCategory, setFilterCategory] = useState('');

    const [quizArray, setquizArray] = useState([]);
    const [scores, setscores] = useState([]);

    var num = 1
    useEffect((async) => {
        if (num===1) {
            getQuiz();
            num++;
        }
        
    }, []);

    const filterQuiz = async (e) => {
        e.preventDefault();
        getQuiz()
        setFilterModal(false);
    }
    
    const getQuiz = async (e) => {
        try {
            if(!filterCategory) {
                const res = await axios.get('http://localhost:8080/user/history', {
                    headers: {
                        'authorization': localStorage.getItem("token") // Setting the 'Authorization' header with the token
                    }
                });
                setquizArray(res.data.quizzes);
                setscores(res.data.scores)
            } else {
                const res = await axios.get('http://localhost:8080/user/history', {
                    headers: {
                        'authorization': localStorage.getItem("token") // Setting the 'Authorization' header with the token
                    }
                });
                setquizArray(res.data.quizzes.filter((quiz) => quiz.Category === filterCategory));
            }
        } catch (e) {
            alert(e.message)
        }
    };

    const goToLeaderboard = async (id) => {

        try {    
            const res = await axios.get('http://localhost:8080/quiz/byId/'+id, {
                headers: {
                    'authorization': localStorage.getItem("token") // Setting the 'Authorization' header with the token
                }
            });
            const quiz = res.data;
            console.log(quiz)
    
            localStorage.setItem("path", window.location.pathname);
            navigate("/leaderboard", {state : {id, quiz}})
           
        } catch (e) {
            alert(e.message)
        }
        
     }

    return (
        <div className="main-container">
            <Row className='quiz-category'>
            <Col md={4} className='page-title'>
                    <h3>
                        Quiz History
                    </h3>
                </Col>
                <Col md={{ span: 3, offset: 5 }}>
                    <Button variant="primary" className="btn filter-btn" onClick={() => setFilterModal(true)}>
                        Filter
                    </Button>

                    <Modal show={filterModal} onHide={() => setFilterModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Choose Category</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={filterQuiz}>
                            <Modal.Body>
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor='quizCategory' className='quiz-label'>Quiz Category</Form.Label>
                                        <Form.Select id='quizCategory' className='quiz-category-inp' onChange={(e) => setFilterCategory(e.target.value)} required >
                                            <option>Select</option>
                                            <option value=''>All Quizzes</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="General Knowledge">General Knowledge</option>
                                            <option value="Geography">Geography</option>
                                            <option value="History">History</option>
                                            <option value="Math">Math</option>
                                            <option value="Science">Science</option>                                
                                        </Form.Select>
                                    </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" className='btn' onClick={() => setFilterModal(false)}>
                                    Close
                                </Button>
                                <Button variant="success" className='btn' type='submit'>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </Col>
            </Row>
            <hr/>
            <div >
                <Row xs={1} md={2} className="g-4" style={{minHeight:"76vh"}}>
                    {quizArray.map((data) => (
                        <Col key={data._id}>

<Card className='quiz-card' style={{boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", border:"none",padding:"10px"}}>
                    <Card.Body className='card-body-quiz'>
                        <Row>
                            <Col md={{span: 5}} className='quiz-img'>
                                <Card.Img variant="top" src="quizDefault.png"  className='quiz-img'/> 
                            </Col>
                            <Col md={{span: 7}} className='quiz-card-details' style={{textAlign:"left", lineHeight: "1", color:"grey", fontSize:"14px"}}>
                                <Card.Title className='card-title'><h4>{data.Title}</h4></Card.Title>
                                <Card.Text className='quiz-details'>Category: {data.Category} </Card.Text>
                                <Card.Text className='quiz-details'>Questions: {data.Questions.length} </Card.Text> 
                                <Card.Text className='quiz-details'> Duration: {data.Timer.TimerDuration ? (data.Timer.TimerDuration)/60+" min": "No time limit"}</Card.Text>
                                <Card.Text className='quiz-details'></Card.Text>
                                <Card.Text className='quiz-details'>Date Created: {new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(data.Created_at))}</Card.Text>
                                <Button variant="info" className='btn btn-leaderboard' onClick={() => goToLeaderboard(data._id)}>
                                    Leaderboard
                                </Button>{" "}
                                
                                
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                       
                        </Col>
                    ))}
                </Row>
            </div>
            <Footer />
        </div>
    )
}