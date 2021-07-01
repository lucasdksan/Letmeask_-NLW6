import React, { ReactNode } from 'react';
import cx from 'classnames';
import '../styles/question.scss';

type QuestionProps= {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

const Question = ({ author, 
                    isHighlighted = false, 
                    isAnswered = false,
                    content,
                    children }: QuestionProps)=>{
    return(
        <div className={
            cx('question',
                {answered: isAnswered},
                {highlighted: isHighlighted && !isAnswered}
            )
        }>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt="Imagem do usúario" />
                    <span>{author.name}</span>
                </div>
                <div>
                    {
                        children
                    }
                </div>
            </footer>
        </div>
    );
}

export default Question;