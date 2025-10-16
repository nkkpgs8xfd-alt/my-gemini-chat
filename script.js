// 1단계에서 발급받은 API 키를 여기에 붙여넣으세요! (새로 발급받은 것으로!)
const API_KEY = 'AIzaSyDrrxIiAR7NtPvwEklo9IoVVApSsvPmrlY';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 메시지를 화면에 추가하는 함수
function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    // 마크다운의 일부를 간단한 HTML로 변환 (볼드, 줄바꿈)
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // **bold** -> <b>bold</b>
    formattedText = formattedText.replace(/\n/g, '<br>'); // newline -> <br>
    messageElement.innerHTML = formattedText;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Gemini API로 메시지를 보내고 답변을 받는 함수
async function sendMessageToGemini() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage('user', message);
    userInput.value = '';

    // 로딩 메시지 추가
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('message', 'bot-message');
    loadingElement.textContent = '생각 중...';
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

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

        // 응답이 정상이 아니더라도 일단 JSON을 파싱 시도
        const data = await response.json();

        // 응답에 문제가 있다면, 에러 메시지를 만들어서 던짐
        if (!response.ok) {
            const errorText = data?.error?.message || JSON.stringify(data);
            throw new Error(errorText);
        }
        
        // 로딩 메시지 제거하고 실제 답변으로 교체
        chatMessages.removeChild(loadingElement);
        const botResponse = data.candidates[0].content.parts[0].text;
        addMessage('bot', botResponse);

    } catch (error) {
        // 로딩 메시지를 실제 에러 메시지로 교체
        loadingElement.innerHTML = `<b>[오류 발생]</b><br>${error.message}`;
    }
}

sendBtn.addEventListener('click', sendMessageToGemini);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessageToGemini();
    }
});
