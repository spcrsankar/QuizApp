import React, { useState, useEffect } from 'react'
import './style.css'
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function CreateQuiz() {
 
    const navigate = useNavigate();

    const location = useLocation();

    const [quizName, setQuizName] = useState('');
    const [quizCategory, setQuizCategory] = useState('');
    const [quizTime, setQuizTime] = useState('no');
    const [quizTimeMin, setQuizTimeMin] = useState('');

    const [timerChoice, setTimerChoice] = useState(false);
    const [eachChoice, setEachChoice] = useState('no');

    var num = 1
    useEffect(() => {
        console.log(quizTime);
        setQuizName(localStorage.getItem("quizName"));
        setQuizCategory(localStorage.getItem("quizCategory"));
        setQuizTime(localStorage.getItem("quizTime"));
        setQuizTimeMin(localStorage.getItem("quizTimeMin"));

        if(localStorage.getItem("quizTimeMin") !== ""){
            setTimerChoice(true);
        }else{
            setTimerChoice(false);
        }

         
        console.log(localStorage.getItem("quizName"));
        console.log(localStorage.getItem("quizCategory"));
        console.log(localStorage.getItem("quizTime"));
        console.log(localStorage.getItem("quizTimeMin"));
      
        if (num===1) {
            console.log(localStorage.getItem("questionCount"));
            console.log(localStorage.getItem("questionArray"));
            let questionCount = localStorage.getItem("questionCount") ;
            
            if(questionCount>0){
                let questionArray = JSON.parse(localStorage.getItem("questionArray"));
               
                questionArray.forEach(((question, index) => {    
                        const ul = document.getElementById('list');
                        const li = document.createElement('li');
                        li.innerHTML = `
                        <div class="card card-question-list">
                        <div class="row">
                          <div class="col" style="font-size:large; font-weight: bold; color:#702963">
                            Q ${index+1}. &nbsp; ${question.Question_text}
                          </div>
                        </div>   
                        <br>
                        <div class="row">
                          <div class="col-5 ques-card ques-txt">
                            Question Type: ${question.Question_type === 1 ? 'Multiple Choice' : question.Question_type === 2 ? 'True/False' : question.Question_type === 3 ? 'Fill-in-the-Blank' : 'Unknown Type'}
                          </div>
                          <div class="col-3 ques-card ques-time">
                           ${question.Time !== undefined ? `Time: ${question.Time} sec` : 'Time: None'}

                          </div>
                          <div class="col-2 ques-card ques-score">
                            Points: ${question.Score}
                          </div>
                          <div class="col-2 ques-card ques-del">
                            <button type="button" class="btn btn-danger delete-btn">Remove</button>
                          </div>
                        </div> 
                      </div>
                            `;

                            li.querySelector('.delete-btn').addEventListener('click', () => {
                                console.log(index);
                                const storedArray = JSON.parse(localStorage.getItem('questionArray') || '[]');
                                storedArray.splice(index, 1);
                                localStorage.setItem('questionArray', JSON.stringify(storedArray));
                                window.location.reload();
                                      
                            });
                        ul.appendChild(li);
                }));
            }else{
                const ul = document.getElementById('list');
                const li = document.createElement('li');
                li.innerHTML = `<div class="card card-question-list">Add questions to this Quiz!</div>`
                ul.appendChild(li);
            }
            num++;
        }
    }, []);

    const setQuizTimeFunc = (e) =>{
        setQuizTime(e);
        if(e ==="no"){
            setTimerChoice(false);
            localStorage.setItem("quizTimeMin","");
        }else if(e ==="each"){
            setTimerChoice(false);
            setEachChoice("each")
            localStorage.setItem("quizTimeMin","");
        }else{
            setTimerChoice(true);
        }
    }

/*
    localStorage.removeItem("quizName");
    localStorage.removeItem("quizCategory");
    localStorage.removeItem("quizTime");
    localStorage.removeItem("quizTimeMin");   
*/
    const createQuiz = async (e) => {
        console.log("Submitted")
        console.log(localStorage.getItem("quizTime"))
        console.log(typeof(quizTime));
        e.preventDefault();
        console.log("Okay")
        console.log(quizTime)

        let qTime;

            if (quizCategory==="") {
                alert("Please Select a Category")
            } 

            let questionArray = JSON.parse(localStorage.getItem("questionArray"));

            if(questionArray.length>0){

                let quizDetails;

                if(localStorage.getItem("quizTime")==="yes") {
                    console.log("Yes")
                    quizDetails = {
                        "Title": quizName,
                        "Category": quizCategory,
                        "Questions": questionArray,
                        "Timer": {
                        "TimerAvailable": 1,
                        "TimerDuration":Number(quizTimeMin)*60
                        }
                    }
                } else if(localStorage.getItem("quizTime")==="no") {
                    console.log("No")
                    quizDetails = {
                        "Title": quizName,
                        "Category": quizCategory,
                        "Questions": questionArray,
                        "Timer": {
                        "TimerAvailable": 0
                        }
                    }
                }else{
                    console.log("Set each")
                    quizDetails = {
                        "Title": quizName,
                        "Category": quizCategory,
                        "Questions": questionArray,
                        "Timer": {
                        "TimerAvailable": 2
                        }
                    }
                }
               
                console.log(quizDetails);
                try {
                    const res = await axios.post('http://localhost:8080/quiz/create',quizDetails,{
                            headers: {
                                'authorization': localStorage.getItem("token") // Setting the 'Authorization' header with the token
                            }
                        }); 
                console.log(res.data);
                navigate("/home");
                } catch (e) {
                    alert(e.message)
                }
               
            }else{
                alert("Please add questions!")
            }
        };


      const addQuestion = () => {

        localStorage.setItem("quizName", quizName);
        localStorage.setItem("quizCategory", quizCategory);
        localStorage.setItem("quizTime", document.getElementById("quizTime").value);
        localStorage.setItem("quizTimeMin", quizTimeMin);
        localStorage.setItem("eachChoice", eachChoice); 
            
        
        console.log(localStorage.getItem("quizName"));
        console.log(localStorage.getItem("quizCategory"));
        console.log(localStorage.getItem("quizTime"));
        console.log(localStorage.getItem("quizTimeMin"));
        console.log(timerChoice)
        console.log(localStorage.getItem("eachChoice"));

        if(quizTime==="each"){
            localStorage.setItem('myBoolean', JSON.stringify(true));
        }else{
            localStorage.setItem('myBoolean', JSON.stringify(false));
        }

        navigate("/add-question", {state: {eachChoice}})
      }

    return (
    <div className="create-container">
        <Form onSubmit={createQuiz}>
            <div className="row create-quiz-row">
                <div className="col-3 quiz-detail">
                <div className="card card-quiz-details">
                   <h4>Quiz Details</h4> 
                   <br/>
                    <div className='row'>
                        <Form.Group className="mb-3" controlId='quizImage'>
                            <Form.Label className='quiz-label'>Image</Form.Label>
                            <Form.Control type='file' className='inp-file' accept='image/*'/>
                        </Form.Group>
                    </div>
                    <div className='row'>
                        <Form.Group className="mb-3" controlId='quizName'>
                            <Form.Label className='quiz-label'>Quiz Name</Form.Label>
                            <Form.Control type='text' className='quiz-inp' value={quizName} onChange={(e) => setQuizName(e.target.value)} required/>
                        </Form.Group>
                    </div>
                    <div className='row'>
                        <Form.Group className="mb-3" controlId='quizCategory'>
                            <Form.Label className='quiz-label'>Quiz Category</Form.Label>
                            <Form.Select type='text' className='quiz-inp' value={quizCategory} onChange={(e) => setQuizCategory(e.target.value)} required>
                                <option>Select</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="General Knowledge">General Knowledge</option>
                                <option value="Geography">Geography</option>
                                <option value="History">History</option>
                                <option value="Math">Math</option>
                                <option value="Science">Science</option>     
                            </Form.Select>
                        </Form.Group>
                    </div>                    
                    <div className='row'>
                        <Form.Group className="mb-3" controlId='quizTime'>
                            <Form.Label className='quiz-label'>Set overall Test Timer</Form.Label>
                            <Form.Select type="boolean" className='quiz-inp' value={quizTime} onChange={(e) => setQuizTimeFunc(e.target.value)} required>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                                <option value="each">Set timer for each question</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    {timerChoice && <div className='row'>
                            <Form.Group className="mb-3" controlId='quizTimeMin'>
                                <Form.Label className='quiz-label'>Set Test Time in Minutes</Form.Label>
                                <Form.Control type='number' className='quiz-inp' value={quizTimeMin} onChange={(e) => setQuizTimeMin(e.target.value)}/>
                            </Form.Group>
                        </div>  
                    }
                    </div>                 
                </div>

                <div className='col-9 question-detail'>
                    <div className="card card-quiz-details">
                    <div className='btn-container'>
                        <div className="quiz-can-btn">
                            <Button variant="danger" className="btn btn-quiz-create" onClick={() => navigate("/home")}>Cancel</Button>
                        </div>
                        <div className='quiz-save-btn'>
                            <Button type="submit" variant="success btn-quiz-create" className="btn">Save</Button>
                        </div>
                    </div>

                    <div className='add-btn-container'>
                        <button type="button" className="btn-add-ques" onClick={addQuestion}>Click To Add Question</button>
                        
                    </div>

                    <div className='question-list-container'>
                        <ul id="list" className="question-list">
                        </ul>
                    </div>
                            
                    </div>
                    </div>
                </div>
             
        </Form>
      
    </div>
    )
}