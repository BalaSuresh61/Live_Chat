// const socket = io("http://localhost:5000")
const socket = io()

const clientTotal = document.getElementById('client-total');

const nameInput = document.getElementById('name-input')
const messageContainer =  document.getElementById('message-container')
const messageForm =  document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMessage()

})

socket.on('Client-Total',(data)=>{
    clientTotal.innerText=`Total Client ${data}`
})

function sendMessage(){
   
    // console.log(messageInput.value)
    // console.log(nameInput.value)
    if(messageInput.value === '')return
    const data = {
        name : nameInput.value,
        message : messageInput.value,
        date : new Date()
    }
    socket.emit('message',data)
    sendMessageToUi(false,data)
    messageInput.value=''
}
socket.on('chat_message',(message)=>{
    console.log(message);
    sendMessageToUi(true,message)
})

function sendMessageToUi(isOwnMessage,data){
    clearFeedback()
    const element = `
            <li class=${isOwnMessage?"message-left":"message-right"}>
                <p class="message">${data.message}
                    <span>${data.name} *${moment(data.date).fromNow()}</span>
                </p>
            </li>
        `

    messageContainer.innerHTML+=element
    scrollToBottom()
}
function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback : `${nameInput.value} is typing...`
    })
})
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback : `${nameInput.value} is typing...`
    })
})
messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback : ``
    })
})

socket.on('feedbackInServer',(data)=>{
    clearFeedback()
    const element = `
            <li class="message-feedback">
                <p class="feedback id="feedback">${data.feedback}</p>
            </li>`

    messageContainer.innerHTML+=element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}