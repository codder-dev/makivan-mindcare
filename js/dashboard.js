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


    // Section-specific rendering
    if (sectionName === "sessions") {

        renderAllSessions();

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


loadInitialSection();


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


    container.innerHTML =
        sessions
            .slice()
            .reverse()
            .map(
                function (session, index) {

                    const icon =
                        session.type === "voice"
                            ? "fa-microphone"
                            : "fa-comment-dots";


                    /*
                     * We use the real session ID
                     * when available.
                     */

                    const sessionId =
                        session.id;


                    return `

                        <div
                            class="session-item clickable-session"
                            data-session-id="${sessionId}"
                        >

                            <div class="session-type-icon">

                                <i class="fa-solid ${icon}"></i>

                            </div>


                            <div class="session-item-info">

                                <strong>
                                    ${session.title ||
                                    "Mind Care Session"}
                                </strong>

                                <span>
                                    ${session.date || "Recent"}
                                    ·
                                    ${session.duration || "—"}
                                </span>

                            </div>


                            <span class="session-status">

                                ${session.status ||
                                "Completed"}

                            </span>


                            <i class="fa-solid fa-chevron-right session-arrow"></i>

                        </div>

                    `;

                }
            )
            .join("");


    /*
     * Make every session clickable
     */

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
// OPEN SESSION DETAILS
// =========================================

function openSessionDetails(sessionId) {

    const sessions =
        currentUser.sessions || [];


    const session =
        sessions.find(
            function (item) {

                return String(item.id) ===
                    String(sessionId);

            }
        );


    if (!session) {

        console.warn(
            "Session not found:",
            sessionId
        );

        return;

    }


    /*
     * Hide every section
     */

    dashboardSections.forEach(
        function (section) {

            section.classList.remove(
                "active-section"
            );

        }
    );


    /*
     * Show session details
     */

    const detailsSection =
        document.getElementById(
            "section-session-details"
        );


    if (detailsSection) {

        detailsSection.classList.add(
            "active-section"
        );

    }


    /*
     * Remove active sidebar state
     */

    navigationItems.forEach(
        function (item) {

            item.classList.remove(
                "active"
            );

        }
    );


    /*
     * Update URL
     */

    history.replaceState(
        null,
        "",
        "#session-" + sessionId
    );


    /*
     * Fill session information
     */

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


    if (title)
        title.textContent =
            session.title ||
            "Mind Care Session";


    if (date)
        date.textContent =
            session.date ||
            "Recent session";


    if (status)
        status.textContent =
            session.status ||
            "Completed";


    if (type)
        type.textContent =
            session.type === "voice"
                ? "Voice Session"
                : "Text Session";


    if (fullDate)
        fullDate.textContent =
            session.date || "—";


    if (duration)
        duration.textContent =
            session.duration || "—";


    if (reviewStatus)
        reviewStatus.textContent =
            session.status ||
            "Completed";


    /*
     * Mood
     */

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
            moodIcons[mood] || "🙂";

    }


    if (moodText) {

        moodText.textContent =
            mood === "Not recorded"
                ? "Not recorded"
                : `Feeling ${mood}`;

    }


    /*
     * Conversation
     */

    renderConversation(
        session
    );


    /*
     * Admin summary
     */

    renderSessionReview(
        session
    );

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

        low: "😔",

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


sessionTypeOptions.forEach(
    function (option) {

        option.addEventListener(
            "click",
            function () {

                sessionTypeOptions.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                option.classList.add(
                    "selected"
                );


                selectedSessionType =
                    option.dataset.sessionType;


                updateStartSessionButton();

            }
        );

    }
);


// =========================================
// SESSION REASON
// =========================================

const reasonOptions =
    document.querySelectorAll(
        ".reason-option"
    );


reasonOptions.forEach(
    function (option) {

        option.addEventListener(
            "click",
            function () {

                reasonOptions.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                option.classList.add(
                    "selected"
                );


                selectedReason =
                    option.dataset.reason;


                updateStartSessionButton();

            }
        );

    }
);


// =========================================
// MOOD
// =========================================

const moodOptions =
    document.querySelectorAll(
        ".mood-option"
    );


moodOptions.forEach(
    function (option) {

        option.addEventListener(
            "click",
            function () {

                moodOptions.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                option.classList.add(
                    "selected"
                );


                selectedMood =
                    option.dataset.mood;


                updateStartSessionButton();

            }
        );

    }
);
// =========================================
// START BUTTON STATE
// =========================================

function updateStartSessionButton() {

    const button =
        document.getElementById(
            "startTextSession"
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
        "startTextSession"
    );


if (startTextSession) {

    startTextSession.addEventListener(
        "click",
        function () {

            if (
                !selectedSessionType ||
                !selectedReason ||
                !selectedMood
            ) {

                return;

            }


            const openingNote =
                document.getElementById(
                    "sessionOpeningNote"
                );


            const session = {

                id:
                    "session-" +
                    Date.now(),

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


            // Add session to user
            if (!currentUser.sessions) {

                currentUser.sessions = [];

            }


            currentUser.sessions.push(
                session
            );


            // Save user
            saveCurrentUser();


            // Save current session ID
            sessionStorage.setItem(
                "activeSessionId",
                session.id
            );


            // Open text session
            window.location.href =
                "text-session.html";

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

                        <div class="notification-item">

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

const sessionFilters =
    document.querySelectorAll(
        ".session-filter-btn"
    );


sessionFilters.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                sessionFilters.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );

            }
        );

    }
);