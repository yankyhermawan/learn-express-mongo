document
	.querySelector("#email")
	.addEventListener("input", () => checkCredential("email"));

document
	.querySelector("#password")
	.addEventListener("input", () => checkCredential("password"));

document.querySelector("#btn").addEventListener("click", async () => {
	const email = document.querySelector("#email").value;
	const password = document.querySelector("#password").value;

	const response = await fetch("http://localhost:3000/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email: email, password: password }),
	});

	if (!response.ok) {
		document.querySelector("#wrongInput").innerHTML = "Wrong Email or Password";
		return;
	}
	const data = await response.json();
	localStorage.setItem("token", data.token);
	localStorage.setItem("userID", data.userID);
	location.href = `http://localhost:3000/public/main?id=${data.userID}`;
});

function defaultFunction() {
	const userID = localStorage.getItem("userID");
	if (userID != null) {
		window.location.href = `http://localhost:3000/public/main?id=${userID}`;
	}
}

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
		document.querySelectorAll("#email-text .true").length == 1
	) {
		document.getElementById("btn").removeAttribute("disabled", "true");
	} else {
		document.getElementById("btn").setAttribute("disabled", "true");
	}
}

defaultFunction();
