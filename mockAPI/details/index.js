document.querySelector("#btn").addEventListener("click", () => editData());
const id = sessionStorage.getItem("userID");
const index = parseInt(sessionStorage.getItem("viewDataIndex"));

function showRateValue() {
	document.querySelector("#rateValue").innerHTML =
		document.querySelector("#rating").value;
}

document
	.querySelector("#rating")
	.addEventListener("input", () => showRateValue());

async function getData() {
	const url = `https://641ef92bad55ae01ccb3b13c.mockapi.io/user/userData/${id}`;
	const response = await fetch(url);
	const data = await response.json();
	const titleInput = document.querySelector("#title");
	const descInput = document.querySelector("#description");
	const ratingInput = document.querySelector("#rating");
	titleInput.value = data.title[index];
	descInput.value = data.description[index];
	ratingInput.value = data.rating[index];
}

async function editData() {
	const url = `https://641ef92bad55ae01ccb3b13c.mockapi.io/user/userData/${id}`;
	const response = await fetch(url);
	const data = await response.json();
	data.title[index] = document.querySelector("#title").value;
	data.description[index] = document.querySelector("#description").value;
	data.rating[index] = document.querySelector("#rating").value;
	const options = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	const putResponse = await fetch(url, options);
	await putResponse.json();
	window.location.href = "../admin";
}

getData();
showRateValue();
