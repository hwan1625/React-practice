import React, { useState } from 'react';

const EventPractice = () => {
    const [form, setForm] = useState({ username: '', message: '' });
    const { username, message } = form;
    const onChange = e => {
        const nextForm = {
            ...form,
            [e.target.name]: e.target.value
        };
        setForm(nextForm);
        console.log(form);
    };
    const onClick = () => {

        alert(username + ': ' + message);
        setForm({ username: '', message: '' });
    }
    return (
        <div>
            <h1>이벤트 연습</h1>
            <input
                type="text"
                name="username"
                placeholder="사용자명"
                value={username}
                onChange={onChange}
            />
            <input
                type="text"
                name="message"
                placeholder="아무거나 입력해 보세요"
                value={message}
                onChange={onChange}
            />
            <button onClick={onClick}>확인</button>
        </div>
    );
}

export default EventPractice;