class UserData {
    constructor(login, email, password, agree) {
        this.login = login;
        this.email = email;
        this.password = password;
        this.agree = agree;
    }

    showUserInfo() {
        console.log(`Логин: ${this.login}\nE-mail: ${this.email}\nПароль: ${this.password}\nСогласие ${this.agree ? "да" : "нет"}`)
    }
}

const form = document.getElementById("registrationForm");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const login = document.getElementById("login").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const agree = document.getElementById("agree").checked;

    const user = new UserData(login, email, password, agree);

    user.showUserInfo();

    alert("Данные успешно отправлены");
});