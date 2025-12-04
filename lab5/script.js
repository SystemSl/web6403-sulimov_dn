const SERVER_URL = "http://localhost:8000";

// Логика формы
const form = document.getElementById("registrationForm");

if (form) {
    const loginInput = document.getElementById("login");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const agreeInput = document.getElementById("agree");
    const submitBtn = document.getElementById("submitBtn");
    const statusMsg = document.getElementById("formStatus");
    function validateInput(input, type) {
        const value = input.value;
        let error = "";
        const errorSpan = document.getElementById(`error-${input.id}`);
        switch (type) {
            case "login":
                if (value.length === 0) error = "Логин не может быть пустым";
                else if (value.length < 3) error = "Минимум 3 символа";
                break;
            case "email":
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) error = "Введите корректный email";
                break;
            case "password":
                if (value.length < 6) error = "Пароль должен быть не менее 6 символов";
                break;
            case "agree":
                if (!input.checked) error = "Необходимо согласие";
                break;
        }
        if (error) {
            if (type !== "agree") {
                input.classList.add("invalid");
                input.classList.remove("valid");
            } 
            errorSpan.textContent = error;
            return false;
        } else {
            if (type !== "agree") {
                input.classList.remove("invalid");
                input.classList.add("valid");
            }
            errorSpan.textContent = "";
            return true;
        }
    }

    function checkFormValidity() {
        const isLoginValid = validateInput(loginInput, "login");
        const isEmailValid = validateInput(emailInput, "email");
        const isPasswordValid = validateInput(passwordInput, "password");
        const isAgreeValid = agreeInput.checked;
        const valid = 
            loginInput.classList.contains("valid") &&
            emailInput.classList.contains("valid") &&
            passwordInput.classList.contains("valid") &&
            agreeInput.checked;
        submitBtn.disabled = !valid;
    }

    [loginInput, emailInput, passwordInput].forEach(input => {
        input.addEventListener("input", () => {
            validateInput(input, input.id);
            checkFormValidity();
        });
    });

    agreeInput.addEventListener("change", () => {
        const errorSpan = document.getElementById("error-agree");
        if (!agreeInput.checked) errorSpan.textContent = "Необходимо согласие";
        else errorSpan.textContent = "";
        checkFormValidity();
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (submitBtn.disabled) return;
        const userData = {
            login: loginInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            agree: agreeInput.checked
        };
        statusMsg.textContent = "Отправка данных...";
        statusMsg.style.color = "blue";
        try {
            const response = await fetch(`${SERVER_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            const result = await response.json();
            console.log("Успех:", result);
            statusMsg.textContent = "Данные успешно отправлены!";
            statusMsg.style.color = "green";
            form.reset();
            [loginInput, emailInput, passwordInput].forEach(inp => inp.classList.remove("valid"));
            submitBtn.disabled = true;
        } catch (error) {
            console.error("Ошибка:", error);
            statusMsg.textContent = "Ошибка при отправке данных. Проверьте консоль.";
            statusMsg.style.color = "red";
        }
    });
}

// Логика для таблицы
const tableBody = document.getElementById("table-body");
const tableError = document.getElementById("table-error");

if (tableBody) {
    async function fetchTableData() {
        console.log("Запрос данных для таблицы...");
        try {
            const response = await fetch(`${SERVER_URL}/mobs_damage`);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const data = await response.json();
            console.log("Полученные данные:", data);
            renderTable(data.mobs_damage);
            tableError.style.display = "none";
            tableError.textContent = "";
        } catch (error) {
            console.error("Ошибка загрузки таблицы:", error);
            tableBody.innerHTML = "";
            tableError.style.display = "block";
            tableError.textContent = "Ошибка загрузки данных: " + error.message;
        }
    }

    function renderTable(dataArray) {
        tableBody.innerHTML = "";
        if (!dataArray || !Array.isArray(dataArray)) {
            console.error("renderTable получил не массив:", dataArray);
            return;
        }
        dataArray.forEach(mob => {
            const row = document.createElement("tr");
            const name = mob.name || "—";
            const easy = mob.easy || "—";
            const normal = mob.normal || "—";
            const hard = mob.hard || "—";
            row.innerHTML = `
                <td>${name}</td>
                <td>${easy}</td>
                <td>${normal}</td>
                <td>${hard}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    fetchTableData();
    setInterval(fetchTableData, 300000); 
}