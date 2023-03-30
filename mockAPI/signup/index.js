document
	.querySelector("#email")
	.addEventListener("input", () => checkCredential("email"));

document
	.querySelector("#password")
	.addEventListener("input", () => checkCredential("password"));

document
	.querySelector("#password-confirm")
	.addEventListener("input", () => confirmPassword("password-confirm"));

document
	.querySelector("form")
	.addEventListener("submit", (e) => e.preventDefault());

document.querySelector("#btn").addEventListener("click", () => setAction());
function checkCredential(id) {
	if (id === "email") {
		const pattern = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
		const val = document.getElementById("email").value;
		if (pattern.test(val)) {
			const text = `
			<div id ='email-notif-text' class = "true">
				<i id = "email-mark" class="fa-solid fa-check"></i>
				This is a valid email address
			</div>`;
			document.getElementById("email-text").innerHTML = text;
		} else {
			const text = `
			<div id ='email-notif-text' class = "false">
				<i id = "email-mark" class="fa-solid fa-xmark"></i>
				This is not a valid email address
			</div>`;
			document.getElementById("email-text").innerHTML = text;
		}
	}
	if (id === "password") {
		const val = document.getElementById("password").value;
		const uppercasePattern = /[A-Z]/;
		const lowercasePattern = /[a-z]/;
		const numberPattern = /[0-9]/;
		const passUppercase = document.getElementById("pass-uppercase");
		const passLowercase = document.getElementById("pass-lowercase");
		const passNumber = document.getElementById("pass-number");
		if (uppercasePattern.test(val)) {
			const uppercaseText = `<i class="fa-solid fa-check"></i>Uppercase`;
			passUppercase.innerHTML = uppercaseText;
			passUppercase.className = "true";
		} else {
			const uppercaseText = `<i class="fa-solid fa-xmark"></i>Uppercase`;
			passUppercase.innerHTML = uppercaseText;
			passUppercase.className = "false";
		}

		if (lowercasePattern.test(val)) {
			const lowercaseText = `<i class="fa-solid fa-check"></i>Lowercase`;
			passLowercase.innerHTML = lowercaseText;
			passLowercase.className = "true";
		} else {
			const lowercaseText = `<i class="fa-solid fa-xmark"></i>Lowercase`;
			passLowercase.innerHTML = lowercaseText;
			passLowercase.className = "false";
		}

		if (numberPattern.test(val)) {
			const numberText = `<i class="fa-solid fa-check"></i>Number`;
			passNumber.innerHTML = numberText;
			passNumber.className = "true";
		} else {
			const numberText = `<i class="fa-solid fa-xmark"></i>Number`;
			passNumber.innerHTML = numberText;
			passNumber.className = "false";
		}
	}

	if (
		document.querySelectorAll("#password-text .true").length == 3 &&
		document.querySelectorAll("#email-text .true").length == 1 &&
		document.querySelectorAll("#password-confirm-text .true").length == 1
	) {
		document.getElementById("btn").removeAttribute("disabled", "true");
	} else {
		document.getElementById("btn").setAttribute("disabled", "true");
	}
}

async function setAction() {
	const url = "https://641ef92bad55ae01ccb3b13c.mockapi.io/user/userData";
	const email = document.getElementById("email");
	const password = document.getElementById("password");
	const username = document.getElementById("username");
	const data = {
		email: email.value,
		username: username.value,
		password: password.value,
		title: [],
		description: [],
		rating: [],
	};
	console.log(data);
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	fetch(url, options)
		.then((response) => response.json())
		.then((data) => (window.location.href = "../login"))
		.catch((err) => console.error(err));
}

function confirmPassword() {
	const pass = document.getElementById("password");
	const passwordConfirm = document.getElementById("password-confirm");
	const passConfirm = document.getElementById("pass-confirm");
	if (passwordConfirm.value != "") {
		if (pass.value != passwordConfirm.value) {
			passConfirm.innerHTML = `<i class="fa-solid fa-xmark"></i> Password Not Match`;
			passConfirm.className = "false";
		} else {
			passConfirm.innerHTML = `<i class="fa-solid fa-check"></i> Password Match`;
			passConfirm.className = "true";
		}
	}
	checkCredential("password-check");
}
