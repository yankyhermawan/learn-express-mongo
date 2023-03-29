const queryString = window.location.search;
const queryParams = new URLSearchParams(queryString.substring(1));
const id = queryParams.get("id");
const index = queryParams.get("index");

async function getData() {
	const url = `http://localhost:3000/public/api/${id}/${index}`;
	const response = await fetch(url);
	const data = await response.json();
	document.getElementById("bookName").value = data[0].name;
	document.getElementById("bookDescription").value = data[0].description;
	document.getElementById("bookRating").value = data[0].rating;
	return data[0];
}

async function updateData() {
	const url = `http://localhost:3000/public/api/${id}/${index}`;
	const name = document.getElementById("bookName").value;
	const description = document.getElementById("bookDescription").value;
	const rating = document.getElementById("bookRating").value;
	const data = {
		name: name,
		rating: rating,
		description: description,
	};
	const response = await fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	window.location.href = `http://localhost:3000/public/main?id=${id}`;
	return response.json();
}

document.querySelector("#btn").addEventListener("click", () => updateData());

getData();
