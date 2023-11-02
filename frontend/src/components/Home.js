import React, { useState, useEffect} from 'react'
import './style.css'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Footer from './Footer';

export default function Home() {
 
    const navigate = useNavigate();

    const [searchTxt, setsearchTxt] = useState('');
    const [searchbox, setsearchbox] = useState(false);

    const [quizArray, setquizArray] = useState([]);
    const [recommendedArray, setrecommendedArray] = useState([]);
    const [searchArray, setsearchArray] = useState([]);

    localStorage.setItem('quiz_array',JSON.stringify([]));
    
    var num = 1
    useEffect((async) => {
        if (num===1) {
            getQuiz();
            getRecommended();
            num++;
        }
        
    }, []);
    
    const getQuiz = async (e) => {
        try {
            const res = await axios.get('http://localhost:8080/quiz',{
                headers: {
                    'authorization': localStorage.getItem("token") // Setting the 'Authorization' header with the token
                }
            });
            setquizArray(res.data);
        } catch (e) {
            alert(e.message)
        }
    };
    const storedArr = JSON.parse(localStorage.getItem('quiz_array'));
    quizArray.forEach((quiz) => storedArr.push(quiz))
    localStorage.setItem('quiz_array', JSON.stringify(storedArr))
    

    const getRecommended = async (e) => {
        try {
            const res = await axios.get('http://localhost:8080/recommend',{
                headers: {
                    'authorization': localStorage.getItem("token") // Setting the 'Authorization' header with the token
                }
            });
            setrecommendedArray(res.data.quizzes);
        } catch (e) {
            alert(e.message)
        }
    };

    const startQuiz = async (id) => {
        try {    
            const res = await axios.get('http://localhost:8080/quiz/byId/'+id, {
                headers: {
                    'authorization': localStorage.getItem("token") // Setting the 'Authorization' header with the token
                }
            });
            const quiz = res.data;

            const questionRes = await axios.get('http://localhost:8080/attempt_quiz/'+id, {
                headers: {
                    'authorization': localStorage.getItem("token") // Setting the 'Authorization' header with the token
                }
            });
            const questions = questionRes.data;
            console.log(questions)

            console.log(quiz.Timer.TimerAvailable)

            if(quiz.Timer.TimerAvailable === true){
             //   navigate("/start-quiz-time-limit", {state : {id, quiz, questions}});
            }else{
              //  navigate("/start-quiz-no-limit", {state : {id, quiz, questions}});
            }
           
        } catch (e) {
            alert(e.message)
        }
    }

    const searchQuiz = async(e) => {
        e.preventDefault()
        setsearchTxt(e.target.value)
        console.log(searchTxt);
        try {
            setsearchbox(true)
            const temp = JSON.parse(localStorage.getItem("quiz_array"))
            const res = temp.filter((quiz) => quiz.Title.toLowerCase().includes(searchTxt.toLowerCase()))

            console.log(res);
            setsearchArray(res)
            console.log(searchArray);
        } catch (error) {
            alert(e.message)
        }
    }

    return (
    <div className="main-container">

        <Form className="home-search">
            <Form.Group className="mb-3" controlId="search-box">
                <Form.Control type='text' className='search-box' onChange={searchQuiz} placeholder='Search for quizzes on any topic'/>
                {searchbox && <ul className='searchlist'>
                    {searchArray.map((quiz) => (
                        <li className='search-item' onClick={() => startQuiz(quiz._id)}>{quiz.Title}</li>
                    ))}
                    </ul>}
            </Form.Group>
        </Form>
      
       
            <Row className='home-head'>
                <Col className='home-categories-label'>
                    <h3>
                        Latest Quizzes
                    </h3>
                </Col>
            </Row>


            <Row xs={1} md={3} className="g-4">
                    {quizArray.slice(0,6).map((quiz) => (
                        <Col key={quiz._id}>
                        <Card className="card-box">
                            <Card.Img variant="top" src="quizDefault.png" />
                            <Card.Body className='quiz-card-body'>
                                <Card.Text className='quiz-cat'>Category: {quiz.Category}</Card.Text>
                                <Card.Title className='quiz-title'>{ quiz.Title }</Card.Title>
                            </Card.Body>
                        </Card>
                        </Col>
                    ))}
            </Row>

            <Row >
                <Col md={12}>
                    <Button variant="primary" className="btn see-btn" onClick={() => navigate("/all-quizzes")}>See More</Button>  
                </Col>
            </Row>

      
        

            <Row className='home-head'>
                <Col className='home-recommended-label'>
                    <h3>
                        Recommended Quizzes for you    
                    </h3>
                </Col>
            </Row>
            <div className='home-items'>
                <Row xs={1} md={3} className="g-4">
                    {recommendedArray.slice(0,6).map((quiz) => (
                        <Col key={quiz._id}>
                        <Card className="card-box">
                            <Card.Img variant="top" src="quizDefault.png" />
                            <Card.Body className='quiz-card-body'>
                                <Card.Text className='quiz-cat'>Category: {quiz.Category}</Card.Text>
                                <Card.Title className='quiz-title'>{ quiz.Title }</Card.Title>
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