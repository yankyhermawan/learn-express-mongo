function displayRate() {
	document.querySelector("#rate").innerHTML =
		document.querySelector("#rating").value;
}

document
	.querySelector("#rating")
	.addEventListener("input", () => displayRate());

document.querySelector("#btn").addEventListener("click", () => addData());

function displayUser() {
	const name = sessionStorage.getItem("Name");
	if (name != null) {
		document.getElementById("intro").innerHTML = `Hello ${name}`;
	} else {
		window.location.href = "../login";
	}
}

async function addData() {
	const title = document.getElementById("title");
	const desc = document.getElementById("description");
	const rate = document.getElementById("rating");
	const id = sessionStorage.getItem("userID");
	const response = await fetch(
		`https://641ef92bad55ae01ccb3b13c.mockapi.io/user/userData/${id}`
	);
	const data = await response.json();
	const titleList = data.title;
	const descList = data.description;
	const rateList = data.rating;
	titleList.push(title.value);
	descList.push(desc.value);
	rateList.push(rate.value);
	const header = {
		method: "PUT",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			title: titleList,
			description: descList,
			rating: rateList,
		}),
	};
	await fetch(
		`https://641ef92bad55ae01ccb3b13c.mockapi.io/user/userData/${id}`,
		header
	);
	window.location.reload();
}

async function displayData() {
	const id = sessionStorage.getItem("userID");
	const url = `https://641ef92bad55ae01ccb3b13c.mockapi.io/user/userData/${id}`;
	const response = await fetch(url);
	const data = await response.json();
	const table = document.getElementById("data-table");
	table.innerHTML = "";
	const header = `<tr>
							<th>Book Title</th>
							<th>Description</th>
							<th>Rating</th>
							</tr>`;
	let text = "";
	for (let i = 0; i < data.title.length; i++) {
		text += `<tr>
						<td>
						${data.title[i]}
						</td>
						<td>
						${data.description[i]}</td>
						<td>
						${data.rating[i]}
						</td>
						<td>
						<input type = "submit" value = "View"onclick = "viewData(${i})">
						</td>
						</tr>`;
	}
	table.innerHTML += header + text;
}

function viewData(index) {
	sessionStorage.setItem("viewDataIndex", index);
	window.location.href = "../details";
}

async function removeAccount() {
	const id = sessionStorage.getItem("userID");
	const url = `https://641ef92bad55ae01ccb3b13c.mockapi.io/user/userData/${id}`;
	const header = {
		method: "DELETE",
	};
	const response = await fetch(url, header);
	await response.json();
	sessionStorage.removeItem("userID");
	sessionStorage.removeItem("Name");
	window.location.href = "../login";
}

displayUser();
displayData();
displayRate();

function logout() {
	sessionStorage.removeItem("userID");
	sessionStorage.removeItem("Name");
	window.location.href = "../login";
}

document.querySelector("#logout").addEventListener("click", () => logout());
document
	.querySelector("#delete-account")
	.addEventListener("click", () => removeAccount());
