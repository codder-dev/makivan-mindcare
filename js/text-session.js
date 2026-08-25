// =========================================
// MAKIVAN MIND CARE
// TEXT SESSION JAVASCRIPT
// =========================================


// =========================================
// GET USER
// =========================================

function getLoggedInUser() {

    const localUser =
        localStorage.getItem("makivanUser");

    const sessionUser =
        sessionStorage.getItem("makivanUser");


    const userData =
        localUser || sessionUser;


    if (!userData) {

        window.location.href =
            "login.html";

        return null;

    }


    try {

        return JSON.parse(userData);

    } catch (error) {

        console.error(
            "Unable to read user:",
            error
        );

        window.location.href =
            "login.html";

        return null;

    }

}


const currentUser =
    getLoggedInUser();


if (!currentUser) {

    throw new Error(
        "No logged-in user."
    );

}


// =========================================
// GET ACTIVE SESSION
// =========================================

const activeSessionId =
    sessionStorage.getItem(
        "activeSessionId"
    );


if (!activeSessionId) {

    alert(
        "No active session was found."
    );

    window.location.href =
        "dashboard.html";

}


// =========================================
// FIND SESSION
// =========================================

const session =
    (currentUser.sessions || [])
        .find(function (item) {

            return String(item.id) ===
                String(activeSessionId);

        });


if (!session) {

    alert(
        "The requested session could not be found."
    );

    window.location.href =
        "dashboard.html";

}


// =========================================
// ELEMENTS
// =========================================

const messageForm =
    document.getElementById(
        "messageForm"
    );


const messageInput =
    document.getElementById(
        "messageInput"
    );


const sendMessageButton =
    document.getElementById(
        "sendMessageButton"
    );


const conversationMessages =
    document.getElementById(
        "conversationMessages"
    );


const typingIndicator =
    document.getElementById(
        "typingIndicator"
    );


const sessionMood =
    document.getElementById(
        "sessionMood"
    );


const sessionType =
    document.getElementById(
        "sessionType"
    );


const sessionTimer =
    document.getElementById(
        "sessionTimer"
    );


// =========================================
// SAVE USER
// =========================================

function saveCurrentUser() {

    if (
        localStorage.getItem(
            "makivanUser"
        )
    ) {

        localStorage.setItem(
            "makivanUser",
            JSON.stringify(currentUser)
        );

    } else {

        sessionStorage.setItem(
            "makivanUser",
            JSON.stringify(currentUser)
        );

    }

}


// =========================================
// SESSION INFORMATION
// =========================================

if (sessionMood) {

    sessionMood.textContent =
        session.mood || "—";

}


if (sessionType) {

    sessionType.textContent =
        session.sessionType || "Text";

}


// =========================================
// RENDER EXISTING MESSAGES
// =========================================

function renderMessages() {

    if (!conversationMessages) return;


    conversationMessages.innerHTML = "";


    const messages =
        session.messages || [];


    messages.forEach(function (message) {

        addMessageToScreen(
            message.sender,
            message.text
        );

    });

}


// =========================================
// ADD MESSAGE TO SCREEN
// =========================================

function addMessageToScreen(
    sender,
    text
) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        `message ${sender}`;


    const avatar =
        document.createElement("div");


    avatar.className =
        sender === "ai"
            ? "ai-avatar"
            : "user-avatar";


    avatar.innerHTML =
        sender === "ai"
            ? '<i class="fa-solid fa-brain"></i>'
            : '<i class="fa-solid fa-user"></i>';


    const content =
        document.createElement("div");


    content.className =
        "message-content";


    const label =
        document.createElement("span");


    label.className =
        "message-label";


    label.textContent =
        sender === "ai"
            ? "Makivan Mind Care"
            : "You";


    const textElement =
        document.createElement("div");


    textElement.textContent =
        text;


    content.appendChild(label);

    content.appendChild(textElement);


    wrapper.appendChild(avatar);

    wrapper.appendChild(content);


    conversationMessages.appendChild(
        wrapper
    );


    scrollToBottom();

}


// =========================================
// SCROLL
// =========================================

function scrollToBottom() {

    window.scrollTo({

        top:
            document.body.scrollHeight,

        behavior:
            "smooth"

    });

}


// =========================================
// INPUT STATE
// =========================================

messageInput.addEventListener(
    "input",
    function () {

        const hasText =
            messageInput.value.trim().length > 0;


        sendMessageButton.disabled =
            !hasText;


        // Auto resize

        messageInput.style.height =
            "auto";


        messageInput.style.height =
            Math.min(
                messageInput.scrollHeight,
                130
            ) + "px";

    }
);


// =========================================
// SEND MESSAGE
// =========================================

messageForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const text =
            messageInput.value.trim();


        if (!text) return;


        // Add user message

        const userMessage = {

            sender: "user",

            text: text,

            timestamp:
                new Date().toISOString()

        };


        if (!session.messages) {

            session.messages = [];

        }


        session.messages.push(
            userMessage
        );


        saveCurrentUser();


        addMessageToScreen(
            "user",
            text
        );


        // Clear input

        messageInput.value = "";

        messageInput.style.height =
            "auto";

        sendMessageButton.disabled =
            true;


        // Simulated AI response

        simulateAIResponse();

    }
);


// =========================================
// ENTER TO SEND
// =========================================

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            messageForm.requestSubmit();

        }

    }
);


// =========================================
// TEMPORARY AI RESPONSE
// =========================================

function simulateAIResponse() {

    typingIndicator.classList.add(
        "active"
    );


    scrollToBottom();


    setTimeout(
        function () {

            typingIndicator.classList.remove(
                "active"
            );


            const response =
                generateTemporaryResponse();


            const aiMessage = {

                sender: "ai",

                text: response,

                timestamp:
                    new Date().toISOString()

            };


            session.messages.push(
                aiMessage
            );


            saveCurrentUser();


            addMessageToScreen(
                "ai",
                response
            );

        },
        1800
    );

}


// =========================================
// TEMPORARY RESPONSE ENGINE
// =========================================

function generateTemporaryResponse() {

    const responses = [

        "Thank you for sharing that with me. Take your time. Can you tell me a little more about what has been happening?",

        "I hear you. It sounds like this has been weighing on you. What part of the situation feels most difficult right now?",

        "Thank you for being open about that. How has this situation been affecting you recently?",

        "That sounds like something worth exploring together. What do you think has contributed most to how you're feeling?",

        "I understand. Before we continue, what would you most like to gain from this conversation?"

    ];


    return responses[
        Math.floor(
            Math.random() *
            responses.length
        )
    ];

}


// =========================================
// INITIAL AI MESSAGE
// =========================================

function showOpeningMessage() {

    if (
        session.messages &&
        session.messages.length > 0
    ) {

        return;

    }


    const openingNote =
        session.openingNote;


    let message =
        "Hello. I'm here to listen and support you through this conversation. Take your time — there is no need to rush.";


    if (openingNote) {

        message =
            "Thank you for sharing that with me. I've noted what you've shared. When you're ready, tell me a little more about what you're experiencing.";

    }


    session.messages = [

        {

            sender: "ai",

            text: message,

            timestamp:
                new Date().toISOString()

        }

    ];


    saveCurrentUser();


    addMessageToScreen(
        "ai",
        message
    );

}


// =========================================
// SESSION TIMER
// =========================================

let sessionStartTime =
    session.startedAt
        ? new Date(session.startedAt)
        : new Date();


function updateTimer() {

    const now =
        new Date();


    const elapsed =
        Math.floor(
            (now - sessionStartTime) /
            1000
        );


    const minutes =
        Math.floor(
            elapsed / 60
        );


    const seconds =
        elapsed % 60;


    if (sessionTimer) {

        sessionTimer.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

    }

}


setInterval(
    updateTimer,
    1000
);


updateTimer();


// =========================================
// BACK TO DASHBOARD
// =========================================

const backToDashboard =
    document.getElementById(
        "backToDashboard"
    );


if (backToDashboard) {

    backToDashboard.addEventListener(
        "click",
        function () {

            window.location.href =
                "dashboard.html#sessions";

        }
    );

}


// =========================================
// END SESSION MODAL
// =========================================

const endSessionButton =
    document.getElementById(
        "endSessionButton"
    );


const endSessionModal =
    document.getElementById(
        "endSessionModal"
    );


const closeEndModal =
    document.getElementById(
        "closeEndModal"
    );


const cancelEndSession =
    document.getElementById(
        "cancelEndSession"
    );


const confirmEndSession =
    document.getElementById(
        "confirmEndSession"
    );


if (endSessionButton) {

    endSessionButton.addEventListener(
        "click",
        function () {

            endSessionModal.classList.add(
                "active"
            );

        }
    );

}


function closeEndSessionModal() {

    endSessionModal.classList.remove(
        "active"
    );

}


if (closeEndModal) {

    closeEndModal.addEventListener(
        "click",
        closeEndSessionModal
    );

}


if (cancelEndSession) {

    cancelEndSession.addEventListener(
        "click",
        closeEndSessionModal
    );

}


// =========================================
// CONFIRM END SESSION
// =========================================

if (confirmEndSession) {

    confirmEndSession.addEventListener(
        "click",
        function () {

            const endedAt =
                new Date();


            const startedAt =
                new Date(
                    session.startedAt
                );


            const durationSeconds =
                Math.floor(
                    (endedAt - startedAt) /
                    1000
                );


            const minutes =
                Math.floor(
                    durationSeconds / 60
                );


            const seconds =
                durationSeconds % 60;


            session.duration =
                `${minutes}m ${seconds}s`;


            session.endedAt =
                endedAt.toISOString();


            session.status =
                "Completed";


            session.reviewStatus =
                "pending";


            saveCurrentUser();


            sessionStorage.removeItem(
                "activeSessionId"
            );


            window.location.href =
                "dashboard.html#sessions";

        }
    );

}


// =========================================
// START
// =========================================

renderMessages();

showOpeningMessage();
