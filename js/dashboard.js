// =========================================
// MAKIVAN MIND CARE
// USER DASHBOARD JAVASCRIPT
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
            "Unable to read user data:",
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
// SESSION INACTIVITY SETTINGS
// =========================================

const SESSION_TIMEOUT =
    30 * 60 * 1000; // 30 minutes

// =========================================
// USER DATA
// =========================================

if (!currentUser.sessions) {

    currentUser.sessions = [];

}


// =========================================
// ENSURE EVERY SESSION HAS AN ID
// =========================================

let sessionsChanged = false;

currentUser.sessions.forEach(
    function (session, index) {

        if (!session.id) {

            session.id =
                "session-" +
                Date.now() +
                "-" +
                index;

            sessionsChanged = true;

        }

    }
);


if (sessionsChanged) {

    saveCurrentUser();

}


if (!currentUser.moodHistory) {

    currentUser.moodHistory = [];

}


if (!currentUser.notifications) {

    currentUser.notifications = [];

}


// =========================================
// SAVE CURRENT USER
// =========================================

function saveCurrentUser() {

    const localUser =
        localStorage.getItem(
            "makivanUser"
        );


    if (localUser) {

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
// GREETING
// =========================================

function updateGreeting() {

    const hour =
        new Date().getHours();


    let greeting;


    if (hour < 12) {

        greeting = "morning";

    } else if (hour < 18) {

        greeting = "afternoon";

    } else {

        greeting = "evening";

    }


    document.getElementById(
        "greeting"
    ).textContent = greeting;

}


updateGreeting();


// =========================================
// USER NAME
// =========================================

function updateUserInformation() {

    const name =
        currentUser.name ||
        "there";


    const firstName =
        name.trim().split(" ")[0];


    document.getElementById(
        "userName"
    ).textContent = firstName;


    document.getElementById(
        "profileName"
    ).textContent = firstName;


    document.getElementById(
        "profileAvatar"
    ).textContent =
        firstName
            .charAt(0)
            .toUpperCase();

}


updateUserInformation();


// =========================================
// RENDER SESSIONS
// =========================================

function renderSessions() {

    const container =
        document.getElementById(
            "sessionsList"
        );


    if (!container) return;


    const sessions =
        currentUser.sessions || [];


    // =====================================
    // NO SESSIONS
    // =====================================

    if (sessions.length === 0) {

        container.innerHTML = `

            <div class="empty-sessions">

                <i class="fa-regular fa-comments"></i>

                <strong>
                    No sessions yet
                </strong>

                <p>
                    Your conversations will appear here.
                </p>

            </div>

        `;

        return;

    }


    // =====================================
    // SHOW MOST RECENT
    // =====================================

    const recentSessions =
        sessions.slice(-4).reverse();


    container.innerHTML =
        recentSessions
            .map(function (session) {


                const icon =
                    session.type === "voice"
                        ? "fa-microphone"
                        : "fa-comment-dots";


                const title =
                    session.title ||
                    "Mind Care Session";


                const date =
                    session.date ||
                    "Recent";


                const duration =
                    session.duration ||
                    "—";


                const status =
                    session.status ||
                    "Completed";


                return `

                    <div
                        class="session-item clickable-session"
                        data-session-id="${session.id}"
                    >

                        <div class="session-type-icon">

                            <i class="fa-solid ${icon}"></i>

                        </div>


                        <div class="session-item-info">

                            <strong>
                                ${title}
                            </strong>

                            <span>
                                ${date} · ${duration}
                            </span>

                        </div>


                        <span class="session-status">

                            ${status}

                        </span>

                    </div>

                `;

            })
            .join("");
            container
    .querySelectorAll(".clickable-session")
    .forEach(
        function (sessionElement) {

            sessionElement.addEventListener(
                "click",
                function () {

                    const sessionId =
                        sessionElement.dataset.sessionId;

                    openSessionDetails(
                        sessionId
                    );

                }
            );

        }
    );
}


renderSessions();


// =========================================
// UPDATE SESSION COUNT
// =========================================

function updateSessionCount() {

    const count =
        currentUser.sessions.length;


    const counter =
        document.querySelector(
            ".wellbeing-circle span"
        );


    if (counter) {

        counter.textContent =
            count;

    }

}


updateSessionCount();


// =========================================
// MOOD SELECTION
// =========================================

const moodButtons =
    document.querySelectorAll(
        ".mood-option"
    );


moodButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {


                moodButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                const mood =
                    button.dataset.mood;


                const today =
                    new Date()
                        .toISOString()
                        .split("T")[0];


                // Remove today's previous
                // check-in

                currentUser.moodHistory =
                    currentUser.moodHistory.filter(
                        function (item) {

                            return item.date !== today;

                        }
                    );


                currentUser.moodHistory.push({

                    mood: mood,

                    date: today

                });


                saveCurrentUser();

            }
        );

    }
);


// =========================================
// RESTORE TODAY'S MOOD
// =========================================

function restoreTodayMood() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayMood =
        currentUser.moodHistory.find(
            function (item) {

                return item.date === today;

            }
        );


    if (!todayMood) return;


    moodButtons.forEach(
        function (button) {

            if (
                button.dataset.mood ===
                todayMood.mood
            ) {

                button.classList.add(
                    "selected"
                );

            }

        }
    );

}


restoreTodayMood();


// =========================================
// CREATE NEW SESSION
// =========================================

function startSession(type) {

    // Save the intended session type
    // temporarily.

    sessionStorage.setItem(
        "makivanSessionType",
        type
    );


    if (type === "voice") {

        window.location.href =
            "voice-session.html";

    } else {

        window.location.href =
            "text-session.html";

    }

}


// =========================================
// OPEN SESSION SETUP
// =========================================

const startSessionSetup =
    document.getElementById(
        "startSessionSetup"
    );


if (startSessionSetup) {

    startSessionSetup.addEventListener(
        "click",
        function () {

            showSection(
                "session-setup"
            );

        }
    );

}

// =========================================
// VOICE SESSION
// =========================================

const startVoiceButton =
    document.getElementById(
        "startVoiceSession"
    );


if (startVoiceButton) {

    startVoiceButton.addEventListener(
        "click",
        function () {

            startSession("voice");

        }
    );

}


// =========================================
// SIDEBAR START SESSION
// =========================================

const sidebarStart =
    document.getElementById(
        "sidebarStartSession"
    );


if (sidebarStart) {

    sidebarStart.addEventListener(
        "click",
        function () {

            showSection(
                "session-setup"
            );

        }
    );

}


// =========================================
// MOBILE SIDEBAR
// =========================================

const menuButton =
    document.getElementById(
        "menuButton"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


const sidebarClose =
    document.getElementById(
        "sidebarClose"
    );


function closeSidebar() {

    sidebar.classList.remove(
        "open"
    );

    sidebarOverlay.classList.remove(
        "active"
    );

}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.add(
                "open"
            );

            sidebarOverlay.classList.add(
                "active"
            );

        }
    );

}


if (sidebarClose) {

    sidebarClose.addEventListener(
        "click",
        closeSidebar
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


// =========================================
// PROFILE MENU
// =========================================

const profileButton =
    document.getElementById(
        "profileButton"
    );


const profileMenu =
    document.getElementById(
        "profileMenu"
    );


if (profileButton) {

    profileButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            profileMenu.classList.toggle(
                "active"
            );

        }
    );

}


document.addEventListener(
    "click",
    function () {

        if (profileMenu) {

            profileMenu.classList.remove(
                "active"
            );

        }

    }
);


// =========================================
// LOGOUT
// =========================================

function logout() {

    localStorage.removeItem(
        "makivanLoggedIn"
    );

    localStorage.removeItem(
        "makivanUser"
    );

    sessionStorage.removeItem(
        "makivanLoggedIn"
    );

    sessionStorage.removeItem(
        "makivanUser"
    );


    window.location.href =
        "login.html";

}


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const profileLogout =
    document.getElementById(
        "profileLogout"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


if (profileLogout) {

    profileLogout.addEventListener(
        "click",
        logout
    );

}
// =========================================
// SIDEBAR NAVIGATION
// =========================================

const navigationItems =
    document.querySelectorAll(
        ".nav-item[data-section]"
    );


const dashboardSections =
    document.querySelectorAll(
        ".dashboard-section"
    );


// =========================================
// SHOW SECTION
// =========================================

// =========================================
// SHOW DASHBOARD SECTION
// =========================================

function showSection(sectionName) {

    console.log("Opening section:", sectionName);

    // Hide all dashboard sections
    dashboardSections.forEach(function (section) {

        section.classList.remove(
            "active-section"
        );

        section.style.setProperty(
            "display",
            "none",
            "important"
        );

    });


    // Find requested section
    const selectedSection =
        document.getElementById(
            "section-" + sectionName
        );


    // If section doesn't exist
    if (!selectedSection) {

        console.error(
            "Section not found:",
            "section-" + sectionName
        );

        return;

    }


    // Show requested section
    selectedSection.classList.add(
        "active-section"
    );


    selectedSection.style.setProperty(
        "display",
        "block",
        "important"
    );


    // Update sidebar active state
    navigationItems.forEach(function (item) {

        item.classList.remove(
            "active"
        );


        if (
            item.dataset.section ===
            sectionName
        ) {

            item.classList.add(
                "active"
            );

        }

    });


    // Update URL
    history.replaceState(
        null,
        "",
        "#" + sectionName
    );


    // Close mobile sidebar
    closeSidebar();


    if (sectionName === "sessions") {

    renderAllSessions();

    initializeSessionFilter();

}

    if (sectionName === "wellbeing") {

        renderWellbeing();

    }


    if (sectionName === "notifications") {

        renderNotifications();

    }


    if (sectionName === "settings") {

        renderSettings();

    }

}
// =========================================
// MY SESSIONS - START NEW SESSION
// =========================================

const newSessionButton =
    document.querySelector(
        ".new-session-button"
    );


if (newSessionButton) {

    newSessionButton.addEventListener(
        "click",
        function () {

            showSection(
                "session-setup"
            );

        }
    );

}


// =========================================
// SIDEBAR CLICK
// =========================================

navigationItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const section =
                    item.dataset.section;


                showSection(section);

            }
        );

    }
);


// =========================================
// DASHBOARD "VIEW ALL"
// =========================================

document
    .querySelectorAll(
        "[data-navigate]"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    showSection(
                        button.dataset.navigate
                    );

                }
            );

        }
    );

// =========================================
// CHECK FOR INACTIVE SESSIONS
// =========================================

function checkInactiveSessions() {

    const sessions =
        currentUser.sessions || [];

    const now =
        Date.now();

    let changed = false;


    sessions.forEach(function (session) {

        // Only check sessions that are still active

        if (
            session.status !== "In Progress"
        ) {
            return;
        }


        const lastActive =
            session.lastActiveAt
                ? new Date(
                    session.lastActiveAt
                ).getTime()
                : new Date(
                    session.startedAt
                ).getTime();


        const inactiveTime =
            now - lastActive;


        if (
            inactiveTime >=
            SESSION_TIMEOUT
        ) {

            session.status =
                "Incomplete";


            session.autoEnded =
                true;


            session.autoEndedAt =
                new Date().toISOString();


            changed = true;

        }

    });


    if (changed) {

        saveCurrentUser();

    }

}
// =========================================
// LOAD SECTION FROM URL
// =========================================

function loadInitialSection() {

    const hash =
        window.location.hash.replace("#", "");


    // =====================================
    // NORMAL DASHBOARD SECTIONS
    // =====================================

   const validSections = [
    "dashboard",
    "sessions",
    "wellbeing",
    "notifications",
    "settings",
    "session-setup"
];


    if (
        validSections.includes(hash)
    ) {

        showSection(hash);

        return;

    }


    // =====================================
    // SESSION DETAILS
    // =====================================

    if (
        hash.startsWith("session-")
    ) {

        const sessionId =
            hash.substring(
                "session-".length
            );


        openSessionDetails(
            sessionId
        );

        return;

    }


    // =====================================
    // DEFAULT
    // =====================================

    showSection("dashboard");

}

checkInactiveSessions();

createResumeNotifications();

loadInitialSection();

// =========================================
// FORMAT SESSION DATE
// =========================================

function formatSessionDate(dateString) {

    if (!dateString) {

        return "Recent";

    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return "Recent";

    }


    return date.toLocaleDateString(
        undefined,
        {
            month: "numeric",
            day: "numeric",
            year: "numeric"
        }
    );

}

// =========================================
// MY SESSIONS
// =========================================

function renderAllSessions() {

    const container =
        document.getElementById(
            "allSessionsList"
        );


    if (!container) return;


    const sessions =
        currentUser.sessions || [];


    // =====================================
    // NO SESSIONS
    // =====================================

    if (sessions.length === 0) {

        container.innerHTML = `

            <div class="empty-sessions">

                <i class="fa-regular fa-comments"></i>

                <strong>
                    You haven't started a session yet
                </strong>

                <p>
                    When you complete a session,
                    it will appear here.
                </p>

            </div>

        `;

        return;

    }


    // =====================================
    // RENDER SESSIONS
    // =====================================

    container.innerHTML =
        sessions
            .slice()
            .reverse()
            .map(function (session) {

                const icon =
                    session.communicationType === "voice"
                        ? "fa-microphone"
                        : "fa-comment-dots";


                const title =
                    session.title ||
                    "Mind Care Session";


                const status =
                    session.status ||
                    "Completed";


                return `

                    <div
                        class="session-item clickable-session"
                        data-session-id="${session.id}"
                    >

                        <div class="session-type-icon">

                            <i class="fa-solid ${icon}"></i>

                        </div>


                        <div class="session-item-info">

                            <strong>
                                ${title}
                            </strong>


                            <span>
                                ${formatSessionDate(
                                    session.startedAt
                                )}
                                ·
                                ${session.duration || "—"}
                            </span>

                        </div>


                        <span class="session-status">

                            ${status}

                        </span>


                        <i
                            class="fa-solid fa-chevron-right session-arrow"
                        ></i>

                    </div>

                `;

            })
            .join("");


    // =====================================
    // MAKE SESSION CARDS CLICKABLE
    // =====================================

    container
        .querySelectorAll(
            ".clickable-session"
        )
        .forEach(
            function (sessionElement) {

                sessionElement.addEventListener(
                    "click",
                    function () {

                        const sessionId =
                            sessionElement.dataset.sessionId;


                        handleSessionClick(
                            sessionId
                        );

                    }
                );

            }
        );

}
// =========================================
// HANDLE SESSION CLICK
// =========================================

function handleSessionClick(sessionId) {

    const session =
        (currentUser.sessions || [])
            .find(
                function (item) {

                    return String(item.id) ===
                        String(sessionId);

                }
            );


    // =====================================
    // SESSION NOT FOUND
    // =====================================

    if (!session) {

        console.warn(
            "Session not found:",
            sessionId
        );

        return;

    }


    // =====================================
    // SESSION STILL IN PROGRESS
    // =====================================

    if (
        session.status ===
        "In Progress"
    ) {

        // Remember which session
        // the user wants to continue

        sessionStorage.setItem(
            "activeSessionId",
            session.id
        );


        // Update activity time

        session.lastActiveAt =
            new Date().toISOString();


        saveCurrentUser();


        // Reopen the SAME conversation

        window.location.href =
            "text-session.html";


        return;

    }


    // =====================================
    // SESSION COMPLETED
    // =====================================

    if (
        session.status ===
        "Completed"
    ) {

        openSessionDetails(
            session.id
        );


        return;

    }


    // =====================================
    // OTHER SESSION STATUS
    // =====================================

    openSessionDetails(
        session.id
    );

}
// =========================================
// OPEN SESSION DETAILS
// =========================================

function openSessionDetails(sessionId) {

    console.log(
        "Opening session:",
        sessionId
    );


    const sessions =
        currentUser.sessions || [];


    const session =
        sessions.find(
            function (item) {

                return String(item.id) ===
                    String(sessionId);

            }
        );


    // =====================================
    // SESSION NOT FOUND
    // =====================================

    if (!session) {

        console.warn(
            "Session not found:",
            sessionId
        );

        return;

    }


    // =====================================
    // HIDE ALL DASHBOARD SECTIONS
    // =====================================

    dashboardSections.forEach(
        function (section) {

            section.classList.remove(
                "active-section"
            );

            section.style.setProperty(
                "display",
                "none",
                "important"
            );

        }
    );


    // =====================================
    // FIND DETAILS SECTION
    // =====================================

    const detailsSection =
        document.getElementById(
            "section-session-details"
        );


    if (!detailsSection) {

        console.error(
            "Session details section not found. " +
            "Make sure your HTML has " +
            'id="section-session-details".'
        );

        return;

    }


    // =====================================
    // SHOW DETAILS SECTION
    // =====================================

    detailsSection.classList.add(
        "active-section"
    );


    detailsSection.style.setProperty(
        "display",
        "block",
        "important"
    );


    // =====================================
    // REMOVE SIDEBAR ACTIVE STATE
    // =====================================

    navigationItems.forEach(
        function (item) {

            item.classList.remove(
                "active"
            );

        }
    );


    // =====================================
    // UPDATE URL
    // =====================================

    history.replaceState(
        null,
        "",
        "#session-" + sessionId
    );


    // =====================================
    // FILL SESSION INFORMATION
    // =====================================

    const title =
        document.getElementById(
            "detailSessionTitle"
        );


    const date =
        document.getElementById(
            "detailSessionDate"
        );


    const status =
        document.getElementById(
            "detailSessionStatus"
        );


    const type =
        document.getElementById(
            "detailSessionType"
        );


    const fullDate =
        document.getElementById(
            "detailSessionDateFull"
        );


    const duration =
        document.getElementById(
            "detailSessionDuration"
        );


    const reviewStatus =
        document.getElementById(
            "detailReviewStatus"
        );


    if (title) {

        title.textContent =
            session.title ||
            "Mind Care Session";

    }


    if (date) {

        date.textContent =
            session.date ||
            "Recent session";

    }


    if (status) {

        status.textContent =
            session.status ||
            "Completed";

    }


    if (type) {

        type.textContent =
            session.communicationType === "voice" ||
            session.sessionType === "voice"
                ? "Voice Session"
                : "Text Session";

    }


    if (fullDate) {

        fullDate.textContent =
            session.date ||
            formatSessionDate(
                session.startedAt
            );

    }


    if (duration) {

        duration.textContent =
            session.duration ||
            "In progress";

    }


    if (reviewStatus) {

        reviewStatus.textContent =
            session.status ||
            "Completed";

    }


    // =====================================
    // MOOD
    // =====================================

    const mood =
        session.mood ||
        "Not recorded";


    const moodEmoji =
        document.getElementById(
            "detailMoodEmoji"
        );


    const moodText =
        document.getElementById(
            "detailMood"
        );


    const moodIcons = {

        great: "😊",

        good: "🙂",

        okay: "😐",

        low: "😔",

        difficult: "😢"

    };


    if (moodEmoji) {

        moodEmoji.textContent =
            moodIcons[mood] ||
            "🙂";

    }


    if (moodText) {

        moodText.textContent =
            mood === "Not recorded"
                ? "Not recorded"
                : `Feeling ${mood}`;

    }


    // =====================================
    // CONVERSATION
    // =====================================

    renderConversation(
        session
    );


    // =====================================
    // ADMIN REVIEW
    // =====================================

    renderSessionReview(
        session
    );


    // =====================================
    // RESUME SESSION
    // =====================================

    /*
     * If the session is still in progress,
     * remember it so the user can continue.
     */

    if (
        session.status ===
        "In Progress"
    ) {

        sessionStorage.setItem(
            "activeSessionId",
            session.id
        );

    }

}
// =========================================
// SESSION BUTTONS
// =========================================

const sessionButtons =
    document.querySelectorAll(
        "[data-start-session]"
    );


sessionButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                showSection(
                    "session-setup"
                );

            }
        );

    }
);
// =========================================
// RENDER CONVERSATION
// =========================================

function renderConversation(session) {

    const container =
        document.getElementById(
            "conversationContainer"
        );


    if (!container) return;


    const messages =
        session.messages || [];


    if (messages.length === 0) {

        container.innerHTML = `

            <div class="empty-history">

                No conversation messages
                are available yet.

            </div>

        `;

        return;

    }


    container.innerHTML =
        messages
            .map(
                function (message) {

                    const sender =
                        message.sender === "user"
                            ? "user"
                            : "ai";


                    const label =
                        sender === "user"
                            ? "You"
                            : "Makivan Mind Care";


                    return `

                        <div
                            class="conversation-message ${sender}"
                        >

                            <div class="message-bubble">

                                <span class="message-label">

                                    ${label}

                                </span>

                                ${message.text || ""}

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}
// =========================================
// SESSION REVIEW
// =========================================

function renderSessionReview(session) {

    const pending =
        document.getElementById(
            "reviewPending"
        );


    const approved =
        document.getElementById(
            "approvedSummary"
        );


    const summary =
        document.getElementById(
            "approvedSummaryText"
        );


    /*
     * If admin has approved the summary
     */

    if (
        session.reviewStatus === "approved" &&
        session.adminSummary
    ) {

        if (pending)
            pending.style.display =
                "none";


        if (approved)
            approved.style.display =
                "block";


        if (summary)
            summary.textContent =
                session.adminSummary;


        return;

    }


    /*
     * Otherwise keep review pending
     */

    if (pending)
        pending.style.display =
            "flex";


    if (approved)
        approved.style.display =
            "none";

}
// =========================================
// BACK TO SESSIONS
// =========================================

const backToSessions =
    document.getElementById(
        "backToSessions"
    );


if (backToSessions) {

    backToSessions.addEventListener(
        "click",
        function () {

            showSection(
                "sessions"
            );

        }
    );

}


// =========================================
// WELLBEING
// =========================================

function renderWellbeing() {

    const totalSessions =
        document.getElementById(
            "totalSessions"
        );


    const totalCheckins =
        document.getElementById(
            "totalCheckins"
        );


    if (totalSessions) {

        totalSessions.textContent =
            currentUser.sessions.length;

    }


    if (totalCheckins) {

        totalCheckins.textContent =
            currentUser.moodHistory.length;

    }


    renderMoodHistory();

}


// =========================================
// MOOD HISTORY
// =========================================

function renderMoodHistory() {

    const container =
        document.getElementById(
            "moodHistory"
        );


    if (!container) return;


    const history =
        currentUser.moodHistory || [];


    if (history.length === 0) {

        container.innerHTML = `

            <div class="empty-history">

                No mood check-ins yet.

            </div>

        `;

        return;

    }


 const moodIcons = {

    great: "😊",

    good: "🙂",

    okay: "😐",

    neutral: "😐",

    low: "😔",

    anxious: "😟",

    "very-low": "😢",

    difficult: "😢"

};


    container.innerHTML =
        history
            .slice()
            .reverse()
            .slice(0, 7)
            .map(
                function (item) {

                    return `

                        <div class="mood-history-item">

                            <span class="mood-history-emoji">

                                ${moodIcons[item.mood] || "🙂"}

                            </span>


                            <div class="mood-history-info">

                                <strong>
                                    Feeling ${item.mood}
                                </strong>

                                <span>
                                    ${item.date}
                                </span>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}
// =========================================
// SESSION SETUP
// =========================================

let selectedSessionType = null;
let selectedReason = null;
let selectedMood = null;


// =========================================
// SESSION TYPE
// =========================================

const sessionTypeOptions =
    document.querySelectorAll(
        ".session-type-option"
    );


sessionTypeOptions.forEach(function (option) {

    option.addEventListener("click", function () {

        sessionTypeOptions.forEach(function (item) {

            item.classList.remove("selected");

        });


        option.classList.add("selected");


        selectedSessionType =
            option.dataset.sessionType;


        updateStartSessionButton();

    });

});


// =========================================
// SESSION REASON
// =========================================

const reasonOptions =
    document.querySelectorAll(
        ".reason-option"
    );


reasonOptions.forEach(function (option) {

    option.addEventListener("click", function () {

        reasonOptions.forEach(function (item) {

            item.classList.remove("selected");

        });


        option.classList.add("selected");


        selectedReason =
            option.dataset.reason;


        updateStartSessionButton();

    });

});


// =========================================
// SESSION MOOD
// =========================================

const moodOptions =
    document.querySelectorAll(
        "#section-session-setup .mood-option"
    );


moodOptions.forEach(function (option) {

    option.addEventListener("click", function () {

        moodOptions.forEach(function (item) {

            item.classList.remove("selected");

        });


        option.classList.add("selected");


        selectedMood =
            option.dataset.mood;


        updateStartSessionButton();

    });

});


// =========================================
// START BUTTON STATE
// =========================================

function updateStartSessionButton() {

    const button =
        document.getElementById(
            "dashboardStartTextSession"
        );


    if (!button) return;


    const ready =
        selectedSessionType &&
        selectedReason &&
        selectedMood;


    button.disabled =
        !ready;

}


// =========================================
// CREATE TEXT SESSION
// =========================================

const startTextSession =
    document.getElementById(
        "dashboardStartTextSession"
    );


if (startTextSession) {

    startTextSession.addEventListener(
        "click",
        function () {

            // Make sure all required
            // selections have been made.

            if (
                !selectedSessionType ||
                !selectedReason ||
                !selectedMood
            ) {

                return;

            }


            // Get optional opening note.

            const openingNote =
                document.getElementById(
                    "sessionOpeningNote"
                );


            // Create the new session.

            const session = {

                id:
                    "session-" +
                    Date.now(),

                title:
                    "Mind Care Session",

                sessionType:
                    selectedSessionType,

                communicationType:
                    "text",

                reason:
                    selectedReason,

                mood:
                    selectedMood,

                openingNote:
                    openingNote
                        ? openingNote.value.trim()
                        : "",

                startedAt:
                    new Date().toISOString(),

                date:
                    new Date().toLocaleDateString(),

                duration:
                    null,

                messages:
                    [],

                riskStatus:
                    "not_assessed",

                status:
                    "In Progress",

                reviewStatus:
                    "pending",

                adminSummary:
                    null

            };


            // Make sure sessions exists.

            if (!currentUser.sessions) {

                currentUser.sessions = [];

            }


            // Add session.

            currentUser.sessions.push(
                session
            );


            // Save user.

            saveCurrentUser();


            // Store active session ID.

            sessionStorage.setItem(
                "activeSessionId",
                session.id
            );


            // Store intended session type.

            sessionStorage.setItem(
                "makivanSessionType",
                "text"
            );


            // Open text session.

            window.location.href =
                "text-session.html";

        }
    );

}

// =========================================
// UNFINISHED SESSION NOTIFICATION
// =========================================

function createResumeNotifications() {

    const sessions =
        currentUser.sessions || [];


    if (!currentUser.notifications) {

        currentUser.notifications = [];

    }


    let changed = false;


    sessions.forEach(function (session) {

        if (
            session.status !== "Incomplete"
        ) {
            return;
        }


        const notificationId =
            "resume-" + session.id;


        const alreadyExists =
            currentUser.notifications.some(
                function (notification) {

                    return notification.id ===
                        notificationId;

                }
            );


        if (alreadyExists) {
            return;
        }


        currentUser.notifications.push({

            id:
                notificationId,

            type:
                "unfinished-session",

            sessionId:
                session.id,

            title:
                "You have an unfinished session",

            message:
                "You previously left a conversation before completing it. Would you like to continue where you left off or start a new session?",

            date:
                new Date().toLocaleDateString(),

            read:
                false

        });


        changed = true;

    });


    if (changed) {

        saveCurrentUser();

    }

}
// =========================================
// INITIAL BUTTON STATE
// =========================================

updateStartSessionButton();


// =========================================
// RESUME SESSION DIALOG
// =========================================

function showResumeSessionDialog(session) {

    const existing =
        document.getElementById(
            "resumeSessionModal"
        );


    if (existing) {

        existing.remove();

    }


    const modal =
        document.createElement("div");


    modal.id =
        "resumeSessionModal";


    modal.className =
        "modal-overlay active";


    modal.innerHTML = `

        <div class="end-session-modal">

            <button
                type="button"
                class="modal-close"
                id="closeResumeModal"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>


            <div class="modal-icon">

                <i class="fa-solid fa-comments"></i>

            </div>


            <h2>
                Continue your previous session?
            </h2>


            <p>
                You have an unfinished conversation.
                Would you like to continue where
                you left off or start a new session?
            </p>


            <div class="modal-actions">

                <button
                    type="button"
                    id="startNewFromResume"
                    class="secondary-button"
                >

                    Start New Session

                </button>


                <button
                    type="button"
                    id="continuePreviousSession"
                    class="danger-button"
                >

                    Continue Session

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // Close

    document
        .getElementById(
            "closeResumeModal"
        )
        .addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );


    // Continue

    document
        .getElementById(
            "continuePreviousSession"
        )
        .addEventListener(
            "click",
            function () {

                session.status =
                    "In Progress";


                session.autoEnded =
                    false;


                session.lastActiveAt =
                    new Date().toISOString();


                saveCurrentUser();


                sessionStorage.setItem(
                    "activeSessionId",
                    session.id
                );


                window.location.href =
                    "text-session.html";

            }
        );


    // Start new

    document
        .getElementById(
            "startNewFromResume"
        )
        .addEventListener(
            "click",
            function () {

                modal.remove();


                showSection(
                    "session-setup"
                );

            }
        );

}
// =========================================
// SESSION DATE
// =========================================

function formatSessionDate(dateString) {

    if (!dateString) {

        return "Recent";

    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return "Recent";

    }


    return date.toLocaleDateString(
        undefined,
        {
            month: "numeric",
            day: "numeric",
            year: "numeric"
        }
    );

}
// =========================================
// NOTIFICATIONS
// =========================================

function renderNotifications() {

    const container =
        document.getElementById(
            "notificationsList"
        );


    if (!container) return;


    const notifications =
        currentUser.notifications || [];


    if (notifications.length === 0) {

        container.innerHTML = `

            <div class="empty-notifications">

                <i class="fa-regular fa-bell"></i>

                <strong>
                    You're all caught up
                </strong>

                <span>
                    New notifications will appear here.
                </span>

            </div>

        `;

        return;

    }


    container.innerHTML =
        notifications
            .slice()
            .reverse()
            .map(
                function (notification) {

                    return `

    <div
        class="notification-item"
        data-notification-id="${notification.id}"
    >

        <div class="notification-icon">

            <i class="fa-solid fa-bell"></i>

        </div>


        <div class="notification-content">

            <strong>
                ${notification.title}
            </strong>


            <p>
                ${notification.message}
            </p>


            ${
                notification.type ===
                "unfinished-session"
                ?

                `

                <div class="notification-actions">

                    <button
                        type="button"
                        class="notification-continue"
                        data-session-id="${notification.sessionId}"
                    >
                        Continue Session
                    </button>


                    <button
                        type="button"
                        class="notification-new"
                    >
                        Start New Session
                    </button>

                </div>

                `

                :

                ""

            }

        </div>


        <span class="notification-time">

            ${notification.date || ""}

        </span>

    </div>

`;
                }
            )
            .join("");

}


// =========================================
// SETTINGS
// =========================================

function renderSettings() {

    const name =
        document.getElementById(
            "settingsName"
        );


    const email =
        document.getElementById(
            "settingsEmail"
        );


    const phone =
        document.getElementById(
            "settingsPhone"
        );


    if (name) {

        name.value =
            currentUser.name || "";

    }


    if (email) {

        email.value =
            currentUser.email || "";

    }


    if (phone) {

        phone.value =
            currentUser.phone || "";

    }

}


// =========================================
// SETTINGS LOGOUT
// =========================================

const settingsLogout =
    document.getElementById(
        "settingsLogout"
    );


if (settingsLogout) {

    settingsLogout.addEventListener(
        "click",
        logout
    );

}


// =========================================
// SESSION FILTER BUTTONS
// =========================================

// =========================================
// SESSION FILTER BUTTONS
// =========================================

const sessionFilters =
    document.querySelectorAll(
        ".session-filter-btn"
    );


// =========================================
// FILTER SESSIONS
// =========================================

function filterSessions(filter) {

    const container =
        document.getElementById(
            "allSessionsList"
        );


    if (!container) return;


    const sessions =
        currentUser.sessions || [];


    let filteredSessions;


    // =====================================
    // ALL
    // =====================================

    if (filter === "all") {

        filteredSessions =
            sessions;

    }


    // =====================================
    // COMPLETED
    // =====================================

    else if (filter === "completed") {

        filteredSessions =
            sessions.filter(
                function (session) {

                    return (
                        session.status &&
                        session.status
                            .toLowerCase() ===
                        "completed"
                    );

                }
            );

    }


    // =====================================
    // IN PROGRESS
    // =====================================

    else if (filter === "in-progress") {

        filteredSessions =
            sessions.filter(
                function (session) {

                    return (
                        !session.status ||
                        session.status
                            .toLowerCase() ===
                        "in progress"
                    );

                }
            );

    }


    // =====================================
    // VOICE
    // =====================================

    else if (filter === "voice") {

        filteredSessions =
            sessions.filter(
                function (session) {

                    return (
                        session.communicationType ===
                        "voice" ||

                        session.sessionType ===
                        "voice" ||

                        session.type ===
                        "voice"
                    );

                }
            );

    }


    // =====================================
    // TEXT
    // =====================================

    else if (filter === "text") {

        filteredSessions =
            sessions.filter(
                function (session) {

                    return (
                        session.communicationType ===
                        "text" ||

                        session.sessionType ===
                        "text" ||

                        session.type ===
                        "text"
                    );

                }
            );

    }


    // =====================================
    // FALLBACK
    // =====================================

    else {

        filteredSessions =
            sessions;

    }


    // =====================================
    // NOTHING FOUND
    // =====================================

    if (
        filteredSessions.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-sessions">

                <i class="fa-regular fa-comments"></i>

                <strong>
                    No ${getFilterName(filter)}
                    sessions
                </strong>

                <p>
                    Sessions matching this filter
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    // =====================================
    // RENDER FILTERED SESSIONS
    // =====================================

    container.innerHTML =
        filteredSessions
            .slice()
            .reverse()
            .map(
                function (session) {

                    const icon =
                        (
                            session.communicationType ===
                            "voice" ||

                            session.sessionType ===
                            "voice" ||

                            session.type ===
                            "voice"
                        )
                        ? "fa-microphone"
                        : "fa-comment-dots";


                    const title =
                        session.title ||
                        "Mind Care Session";


                    const date =
                        session.date ||
                        formatSessionDate(
                            session.startedAt
                        );


                    const duration =
                        session.duration ||
                        "In progress";


                    const status =
                        session.status ||
                        "In Progress";


                    return `

                        <div
                            class="session-item clickable-session"
                            data-session-id="${session.id}"
                        >

                            <div class="session-type-icon">

                                <i class="fa-solid ${icon}"></i>

                            </div>


                            <div class="session-item-info">

                                <strong>
                                    ${title}
                                </strong>

                                <span>
                                    ${date}
                                    ·
                                    ${duration}
                                </span>

                            </div>


                            <span class="session-status">

                                ${status}

                            </span>


                            <i
                                class="fa-solid fa-chevron-right session-arrow"
                            ></i>

                        </div>

                    `;

                }
            )
            .join("");


    // =====================================
    // MAKE SESSIONS CLICKABLE
    // =====================================

    container
        .querySelectorAll(
            ".clickable-session"
        )
        .forEach(
            function (sessionElement) {

                sessionElement.addEventListener(
                    "click",
                    function () {

                        const sessionId =
                            sessionElement.dataset.sessionId;


                        openSessionDetails(
                            sessionId
                        );

                    }
                );

            }
        );

}


// =========================================
// FILTER NAME
// =========================================

function getFilterName(filter) {

    const names = {

        all:
            "available",

        completed:
            "completed",

        "in-progress":
            "in progress",

        voice:
            "voice",

        text:
            "text"

    };


    return names[filter] ||
        "matching";

}


// =========================================
// FORMAT SESSION DATE
// =========================================

function formatSessionDate(
    dateString
) {

    if (!dateString) {

        return "Recent";

    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Recent";

    }


    return date.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


// =========================================
// FILTER BUTTON EVENTS
// =========================================

sessionFilters.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                // Remove active
                // from every button

                sessionFilters.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                // Activate clicked button

                button.classList.add(
                    "active"
                );


                // Get filter

                const filter =
                    button.dataset.filter;


                // Apply filter

                filterSessions(
                    filter || "all"
                );

            }
        );

    }
);


// =========================================
// DEFAULT FILTER
// =========================================

function initializeSessionFilter() {

    const activeButton =
        document.querySelector(
            ".session-filter-btn.active"
        );


    if (activeButton) {

        filterSessions(
            activeButton.dataset.filter ||
            "all"
        );

        return;

    }


    // If none is active,
    // make ALL active

    const allButton =
        document.querySelector(
            '.session-filter-btn[data-filter="all"]'
        );


    if (allButton) {

        allButton.classList.add(
            "active"
        );

    }


    filterSessions("all");

}