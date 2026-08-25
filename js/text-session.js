// =========================================
// MAKIVAN MIND CARE
// TEXT SESSION JAVASCRIPT
// =========================================


// =========================================
// GET LOGGED-IN USER
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

    throw new Error(
        "No active session."
    );
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

    throw new Error(
        "Session not found."
    );
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
        formatMood(
            session.mood
        );

}


if (sessionType) {

    sessionType.textContent =
        formatSessionType(
            session.sessionType
        );

}


// =========================================
// FORMAT SESSION TYPE
// =========================================

function formatSessionType(type) {

    if (!type) {
        return "Text";
    }

    const types = {

        text:
            "Text",

        voice:
            "Voice"

    };

    return types[type] ||
        type;
}


// =========================================
// FORMAT MOOD
// =========================================

function formatMood(mood) {

    if (!mood) {
        return "Not recorded";
    }

    const moods = {

        great:
            "Great 😊",

        good:
            "Good 🙂",

        okay:
            "Okay 😐",

        low:
            "Low 😔",

        difficult:
            "Difficult 😢"

    };

    return moods[mood] ||
        mood;
}


// =========================================
// FORMAT CLIENT CATEGORY
// =========================================

function formatClientCategory(category) {

    if (!category) {
        return "individual";
    }

    const categories = {

        individual:
            "individual",

        teen:
            "teen or young person",

        young:
            "young person",

        couple:
            "couple",

        family:
            "family",

        other:
            "individual"

    };

    return categories[category] ||
        category;
}


// =========================================
// FORMAT REASON
// =========================================

function formatReason(reason) {

    if (!reason) {
        return "what they are currently experiencing";
    }

    const reasons = {

        stress:
            "stress",

        anxiety:
            "anxiety or worry",

        relationships:
            "relationship concerns",

        family:
            "family concerns",

        school:
            "school or academic concerns",

        work:
            "work-related concerns",

        loneliness:
            "loneliness",

        sadness:
            "sadness or low mood",

        anger:
            "anger or frustration",

        grief:
            "loss or grief",

        selfesteem:
            "self-esteem or confidence",

        overwhelmed:
            "feeling overwhelmed",

        other:
            "what they are currently experiencing"

    };

    return reasons[reason] ||
        reason;
}


// =========================================
// RENDER EXISTING MESSAGES
// =========================================

function renderMessages() {

    if (!conversationMessages) {
        return;
    }

    conversationMessages.innerHTML = "";

    const messages =
        session.messages || [];

    messages.forEach(
        function (message) {

            addMessageToScreen(
                message.sender,
                message.text
            );

        }
    );
}


// =========================================
// ADD MESSAGE TO SCREEN
// =========================================

function addMessageToScreen(
    sender,
    text
) {

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        `message ${sender}`;


    const avatar =
        document.createElement(
            "div"
        );

    avatar.className =
        sender === "ai"
            ? "ai-avatar"
            : "user-avatar";


    avatar.innerHTML =
        sender === "ai"
            ? '<i class="fa-solid fa-brain"></i>'
            : '<i class="fa-solid fa-user"></i>';


    const content =
        document.createElement(
            "div"
        );

    content.className =
        "message-content";


    const label =
        document.createElement(
            "span"
        );

    label.className =
        "message-label";


    label.textContent =
        sender === "ai"
            ? "Makivan Mind Care"
            : "You";


    const textElement =
        document.createElement(
            "div"
        );


    textElement.textContent =
        text;


    content.appendChild(
        label
    );

    content.appendChild(
        textElement
    );


    wrapper.appendChild(
        avatar
    );

    wrapper.appendChild(
        content
    );


    conversationMessages.appendChild(
        wrapper
    );


    scrollToBottom();
}


// =========================================
// SCROLL
// =========================================

function scrollToBottom() {

    setTimeout(
        function () {

            window.scrollTo({

                top:
                    document.body.scrollHeight,

                behavior:
                    "smooth"

            });

        },
        50
    );
}


// =========================================
// INPUT STATE
// =========================================

if (messageInput) {

    messageInput.addEventListener(
        "input",
        function () {

            const hasText =
                messageInput.value
                    .trim()
                    .length > 0;


            if (sendMessageButton) {

                sendMessageButton.disabled =
                    !hasText;

            }


            messageInput.style.height =
                "auto";


            messageInput.style.height =
                Math.min(
                    messageInput.scrollHeight,
                    130
                ) + "px";

        }
    );
}


// =========================================
// SEND MESSAGE
// =========================================

if (messageForm) {

    messageForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const text =
                messageInput.value.trim();


            if (!text) {
                return;
            }


            // -----------------------------
            // USER MESSAGE
            // -----------------------------

            const userMessage = {

                sender:
                    "user",

                text:
                    text,

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


            // -----------------------------
            // CLEAR INPUT
            // -----------------------------

            messageInput.value = "";

            messageInput.style.height =
                "auto";


            if (sendMessageButton) {

                sendMessageButton.disabled =
                    true;

            }


            // -----------------------------
            // AI RESPONSE
            // -----------------------------

            simulateAIResponse();

        }
    );
}


// =========================================
// ENTER TO SEND
// =========================================

if (messageInput) {

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
}


// =========================================
// SIMULATED AI RESPONSE
// =========================================

function simulateAIResponse() {

    if (typingIndicator) {

        typingIndicator.classList.add(
            "active"
        );

    }


    scrollToBottom();


    setTimeout(
        function () {

            if (typingIndicator) {

                typingIndicator.classList.remove(
                    "active"
                );

            }


            const response =
                generateContextualResponse();


            const aiMessage = {

                sender:
                    "ai",

                text:
                    response,

                timestamp:
                    new Date().toISOString()

            };


            if (!session.messages) {

                session.messages = [];

            }


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
// CONTEXTUAL RESPONSE ENGINE
// =========================================

function generateContextualResponse() {

    const category =
        formatClientCategory(
            session.clientCategory
        );


    const reason =
        formatReason(
            session.reason
        );


    const mood =
        formatMood(
            session.mood
        );


    const messages =
        session.messages || [];


    /*
     * Number of user messages
     */

    const userMessages =
        messages.filter(
            function (message) {

                return message.sender ===
                    "user";

            }
        );


    const messageCount =
        userMessages.length;


    // =====================================
    // FIRST RESPONSE
    // =====================================

    if (messageCount === 1) {

        return (
            `Thank you for opening up. ` +
            `Since you're seeking support around ${reason}, ` +
            `I'd like to understand your experience rather than make assumptions. ` +
            `What has been happening recently that made you decide to talk about this today?`
        );

    }


    // =====================================
    // SECOND RESPONSE
    // =====================================

    if (messageCount === 2) {

        return (
            `I hear what you're saying. ` +
            `It sounds like this has been affecting you in an important way. ` +
            `When you think about everything that is happening, ` +
            `what part feels the hardest for you to deal with right now?`
        );

    }


    // =====================================
    // THIRD RESPONSE
    // =====================================

    if (messageCount === 3) {

        return (
            `Thank you for explaining that more clearly. ` +
            `It can help to look at both what is happening around you ` +
            `and how you are experiencing it internally. ` +
            `How has this situation been affecting your daily life, relationships, ` +
            `school, work, or ability to enjoy things?`
        );

    }


    // =====================================
    // LATER CONVERSATION
    // =====================================

    const responses = [

        `That gives us something important to explore. What do you feel you need most right now — someone to listen, help understanding the situation, or ideas for how you might handle it?`,

        `I appreciate you continuing to share. When this situation becomes difficult, what usually helps you feel even a little better or more in control?`,

        `There may be several things contributing to how you're feeling. Is there something that happened recently that made these feelings stronger?`,

        `It sounds like this has been taking up quite a bit of emotional space. What would you hope could be different after getting support with this?`,

        `Let's take this one step at a time. Is there another part of this situation that you feel I should understand?`

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

    /*
     * IMPORTANT:
     * If messages already exist,
     * this is a resumed session.
     */

    if (
        session.messages &&
        session.messages.length > 0
    ) {

        return;

    }


    const category =
        formatClientCategory(
            session.clientCategory
        );


    const reason =
        formatReason(
            session.reason
        );


    const mood =
        formatMood(
            session.mood
        );


    const openingNote =
        session.openingNote;


    let message =
        `Hello. I'm here to listen and support you. ` +
        `Since this is a ${category} support session, ` +
        `we can take things at your own pace. ` +
        `You indicated that you're currently experiencing ${reason}, ` +
        `and your starting mood was ${mood}. ` +
        `You don't have to explain everything at once. ` +
        `What would you like to talk about first?`;


    /*
     * If the user provided
     * an opening note.
     */

    if (openingNote) {

        message =
            `Thank you for sharing that with me. ` +
            `I've noted what you wrote about your situation. ` +
            `You don't need to repeat everything. ` +
            `When you're ready, tell me a little more about what has been happening ` +
            `and how it has been affecting you.`;

    }


    session.messages = [

        {

            sender:
                "ai",

            text:
                message,

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
        ? new Date(
            session.startedAt
        )
        : new Date();


function updateTimer() {

    const now =
        new Date();


    const elapsed =
        Math.floor(
            (
                now -
                sessionStartTime
            ) / 1000
        );


    const minutes =
        Math.floor(
            elapsed / 60
        );


    const seconds =
        elapsed % 60;


    if (sessionTimer) {

        sessionTimer.textContent =
            String(minutes)
                .padStart(2, "0") +
            ":" +
            String(seconds)
                .padStart(2, "0");

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

            /*
             * Session remains IN PROGRESS.
             * This allows the dashboard to
             * resume it later.
             */

            session.lastActiveAt =
                new Date().toISOString();


            saveCurrentUser();


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


if (
    endSessionButton &&
    endSessionModal
) {

    endSessionButton.addEventListener(
        "click",
        function () {

            endSessionModal.classList.add(
                "active"
            );

        }
    );

}


// =========================================
// CLOSE END SESSION MODAL
// =========================================

function closeEndSessionModal() {

    if (endSessionModal) {

        endSessionModal.classList.remove(
            "active"
        );

    }

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
                Math.max(
                    0,
                    Math.floor(
                        (
                            endedAt -
                            startedAt
                        ) / 1000
                    )
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


            session.lastActiveAt =
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