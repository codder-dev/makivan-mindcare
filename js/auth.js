// =========================================
// MAKIVAN MIND CARE
// AUTHENTICATION JAVASCRIPT
// =========================================


// =========================================
// TEMPORARY ACCOUNT STORAGE
// =========================================

let accounts =
    JSON.parse(localStorage.getItem("makivanAccounts")) || [];


// =========================================
// SAVE ACCOUNTS
// =========================================

function saveAccounts() {

    localStorage.setItem("makivanAccounts",JSON.stringify(accounts));

}


// =========================================
// SHOW MESSAGE
// =========================================

function showMessage(element, message, type) {

    if (!element) return;

    element.textContent = message;

    element.className =
        "form-message " + type;

}


// =========================================
// PASSWORD TOGGLE FUNCTION
// =========================================

function setupPasswordToggle(buttonId,inputId) {

    const button =
        document.getElementById(buttonId);

    const input =
        document.getElementById(inputId);


    if (!button || !input) return;


    button.addEventListener(
        "click",
        function () {

            if (input.type === "password") {

                input.type = "text";

                button.textContent = "🙈";

                button.setAttribute("aria-label", "Hide password");

            } else {

                input.type = "password";

                button.textContent = '<i class="fa-solid fa-eye"></i>';

                button.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


// =========================================
// LOGIN PASSWORD TOGGLE
// =========================================

setupPasswordToggle(
    "passwordToggle",
    "password"
);


// =========================================
// REGISTER PASSWORD TOGGLE
// =========================================

setupPasswordToggle(
    "registerPasswordToggle",
    "registerPassword"
);


setupPasswordToggle(
    "confirmPasswordToggle",
    "confirmPassword"
);


// =========================================
// LOGIN
// =========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const loginMessage =
        document.getElementById("loginMessage");

    const loginRedirect =
        document.getElementById("loginRedirect");


    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;


            loginMessage.className =
                "form-message";

            loginMessage.textContent =
                "";


            if (!email) {

                showMessage(
                    loginMessage,
                    "Please enter your email address.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            if (!password) {

                showMessage(
                    loginMessage,
                    "Please enter your password.",
                    "error"
                );

                passwordInput.focus();

                return;

            }


            const account = accounts.find(user => user.email === email);


            if (!account) {

                showMessage(
                    loginMessage,
                    "No account was found with this email. Please create an account first.",
                    "error"
                );

                return;

            }


            if (
                account.password !== password
            ) {

                showMessage(
                    loginMessage,
                    "The password you entered is incorrect.",
                    "error"
                );

                passwordInput.focus();

                return;

            }


            // =================================
            // CORRECT DETAILS
            // =================================

            const submitButton =
                loginForm.querySelector(
                    ".auth-submit"
                );


            submitButton.disabled = true;

            submitButton.classList.add(
                "loading"
            );


            submitButton.innerHTML = `
                <span class="login-spinner"></span>
                <span>Signing you in...</span>
            `;


            const rememberMe =
                document.getElementById(
                    "rememberMe"
                );


            if (
                rememberMe &&
                rememberMe.checked
            ) {

                localStorage.setItem(
                    "makivanLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "makivanUser",
                    JSON.stringify(account)
                );

            } else {

                sessionStorage.setItem(
                    "makivanLoggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "makivanUser",
                    JSON.stringify(account)
                );

            }


            setTimeout(
                function () {

                    if (loginRedirect) {

                        loginRedirect.classList.add(
                            "active"
                        );

                    }

                },
                500
            );


            setTimeout(
                function () {

                    window.location.href =
                        "dashboard.html";

                },
                4500
            );

        }
    );

}


// =========================================
// REGISTER
// =========================================

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {


    const fullName =
        document.getElementById(
            "fullName"
        );


    const email =
        document.getElementById(
            "registerEmail"
        );


    const phone =
        document.getElementById(
            "phone"
        );


    const password =
        document.getElementById(
            "registerPassword"
        );


    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        );


    const terms =
        document.getElementById(
            "terms"
        );


    const registerMessage =
        document.getElementById(
            "registerMessage"
        );


    const registerRedirect =
        document.getElementById(
            "registerRedirect"
        );


    // =====================================
    // PASSWORD REQUIREMENTS
    // =====================================

    const lengthCheck =
        document.getElementById(
            "lengthCheck"
        );


    const numberCheck =
        document.getElementById(
            "numberCheck"
        );


    const letterCheck =
        document.getElementById(
            "letterCheck"
        );


    password.addEventListener(
        "input",
        function () {

            const value =
                password.value;


            const hasLength =
                value.length >= 8;


            const hasNumber = /\d/.test(value);


            const hasLetter = /[A-Za-z]/.test(value);


            lengthCheck.classList.toggle(
                "valid",
                hasLength
            );


            numberCheck.classList.toggle(
                "valid",
                hasNumber
            );


            letterCheck.classList.toggle(
                "valid",
                hasLetter
            );


            lengthCheck.textContent = hasLength ? "✓ At least 8 characters" : "○ At least 8 characters";


            numberCheck.textContent =
                hasNumber
                    ? "✓ Contains a number"
                    : "○ Contains a number";


            letterCheck.textContent =
                hasLetter
                    ? "✓ Contains a letter"
                    : "○ Contains a letter";

        }
    );


    // =====================================
    // SUBMIT REGISTER
    // =====================================

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                fullName.value.trim();


            const userEmail =
                email.value
                    .trim()
                    .toLowerCase();


            const userPhone =
                phone.value.trim();


            const userPassword =
                password.value;


            const userConfirmPassword =
                confirmPassword.value;


            // =================================
            // BASIC VALIDATION
            // =================================

            if (!name) {

                showMessage(
                    registerMessage,
                    "Please enter your full name.",
                    "error"
                );
            if (name.value.trim() < 2){
                showMessage(registerMessage, "Please enter two names or more");
            }

                fullName.focus();

                return;

            }


            if (!userEmail) {

                showMessage(
                    registerMessage,
                    "Please enter your email address.",
                    "error"
                );

                email.focus();

                return;

            }


            // =================================
            // EMAIL FORMAT
            // =================================

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    userEmail
                )
            ) {

                showMessage(
                    registerMessage,
                    "Please enter a valid email address.",
                    "error"
                );

                email.focus();

                return;

            }


            // =================================
            // PASSWORD
            // =================================

            if (userPassword.length < 8) {

                showMessage(
                    registerMessage,
                    "Your password must contain at least 8 characters.",
                    "error"
                );

                password.focus();

                return;

            }


            if (!/[A-Za-z]/.test(userPassword)) {

                showMessage(
                    registerMessage,
                    "Your password must contain at least one letter.",
                    "error"
                );

                password.focus();

                return;

            }


            if (!/\d/.test(userPassword)) {

                showMessage(
                    registerMessage,
                    "Your password must contain at least one number.",
                    "error"
                );

                password.focus();

                return;

            }


            // =================================
            // CONFIRM PASSWORD
            // =================================

            if (
                userPassword !==
                userConfirmPassword
            ) {

                showMessage(
                    registerMessage,
                    "The passwords do not match.",
                    "error"
                );

                confirmPassword.focus();

                return;

            }


            // =================================
            // TERMS
            // =================================

            if (!terms.checked) {

                showMessage(
                    registerMessage,
                    "Please agree to the Terms of Service and Privacy Policy.",
                    "error"
                );

                return;

            }


            // =================================
            // CHECK EXISTING ACCOUNT
            // =================================

            const existingAccount =
                accounts.find(
                    user =>
                        user.email === userEmail
                );


            if (existingAccount) {

                showMessage(
                    registerMessage,
                    "An account with this email already exists. Please sign in instead.",
                    "error"
                );

                return;

            }


            // =================================
            // CREATE ACCOUNT
            // =================================

            const newAccount = {

                id: Date.now().toString(),

                name: name,

                email: userEmail,

                phone: userPhone,

                password: userPassword,

                createdAt:
                new Date().toISOString(),

                sessions: [],

                moodHistory: [],

                notifications: []

            };


            accounts.push(newAccount);


            saveAccounts();


            // =================================
            // LOADING BUTTON
            // =================================

            const submitButton =
                registerForm.querySelector(
                    ".auth-submit"
                );


            submitButton.disabled = true;

            submitButton.classList.add(
                "loading"
            );


            submitButton.innerHTML = `
                <span class="login-spinner"></span>
                <span>Creating account...</span>
            `;


            // =================================
            // FULL SCREEN SUCCESS
            // =================================

            setTimeout(
                function () {

                    if (registerRedirect) {

                        registerRedirect.classList.add(
                            "active"
                        );

                    }

                },
                1000
            );


            // =================================
            // GO TO LOGIN
            // =================================

            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                3500
            );

        }
    );

}