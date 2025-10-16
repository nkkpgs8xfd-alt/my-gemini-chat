// 1단계에서 발급받은 API 키를 여기에 붙여넣으세요!
const API_KEY = 'AIzaSyBVBm3Kpjb_i-T15lq63ViaB-qd8RDnL7s';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 메시지를 화면에 추가하는 함수
function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    // 스크롤을 항상 맨 아래로
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Gemini API로 메시지를 보내고 답변을 받는 함수
async function sendMessageToGemini() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage('user', message);
    userInput.value = '';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다.');
        }

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;
        addMessage('bot', botResponse);

    } catch (error) {
        console.error('오류 발생:', error);
        addMessage('bot', '죄송합니다, 답변을 생성하는 중 오류가 발생했습니다.');
    }
}

// 전송 버튼 클릭 시 함수 실행
sendBtn.addEventListener('click', sendMessageToGemini);

// 엔터 키 입력 시 함수 실행
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessageToGemini();
    }
});
