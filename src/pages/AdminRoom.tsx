import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import Button from '../components/Button';
import Question from '../components/Question';
import RoomCode from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';
import { database } from '../services/firebase';

type RoomParams = {
    id: string;
}

const AdminRoom = ()=>{
    const params = useParams<RoomParams>();
    const history = useHistory();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);
    async function handleCheckQuestionAsAnswered(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }
    async function handleHighlightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }
    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }
    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });
        history.push('/');
    }
    return(
        <div id='page-room'>
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {
                        (questions.length > 0) && (
                            <span>{questions.length} pergunta(s)</span>
                        )
                    }
                </div>
                <div className="question-list">
                    {
                        questions.map(itens=>{
                            return(
                                <Question
                                    key={itens.id}
                                    content={itens.content}
                                    author={itens.author}
                                    isAnswered={itens.isAnswered}
                                    isHighlighted={itens.isHighlighted}
                                >
                                    {
                                        !itens.isAnswered && (
                                            <>
                                                <button
                                                    type='button'
                                                    onClick={()=>handleCheckQuestionAsAnswered(itens.id)}
                                                >
                                                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={()=>handleHighlightQuestion(itens.id)}
                                                >
                                                    <img src={answerImg} alt="Dar destaque à uma pergunta" />
                                                </button>
                                            </>
                                        )
                                    }
                                    <button
                                        type='button'
                                        onClick={()=>handleDeleteQuestion(itens.id)}
                                    >
                                        <img src={deleteImg} alt="Remover Item" />
                                    </button>
                                </Question>
                            );
                        })
                    }
                </div>
            </main>
        </div>
    );
}

export default AdminRoom;