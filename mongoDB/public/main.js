document.querySelector("#rating").addEventListener("input", () => {
	document.querySelector("#val").innerHTML =
		document.querySelector("#rating").value;
});

document.querySelector("#btn").addEventListener("click", () => addData());

document.querySelector("#logout").addEventListener("click", () => {
	localStorage.removeItem("userID");
	window.location.href = "/public";
});

async function getData(id) {
	const response = await fetch(`http://localhost:3000/public/api/${id}`);
	const data = await response.json();
	return data;
}

async function postData(id, data) {
	const url = `http://localhost:3000/public/api/${id}`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
}

async function addData() {
	const name = document.getElementById("name");
	const description = document.getElementById("description");
	const rating = document.getElementById("rating");
	const queryString = window.location.search;
	const queryParams = new URLSearchParams(queryString.substring(1));
	const id = queryParams.get("id");
	try {
		const data = {
			bookList: name.value,
			rating: rating.value,
			description: description.value,
		};
		postData(id, data);
		displayData();
	} catch (err) {
		console.error(err);
	}
}

async function displayData() {
	const queryString = window.location.search;
	const queryParams = new URLSearchParams(queryString.substring(1));
	const id = queryParams.get("id");
	const data = await getData(id);
	const table = document.getElementById("data-table");
	table.innerHTML = "";
	const header = `<tr>
	<th>Book Title</th>
	<th>Description</th>
	<th>Rating</th>
	</tr>`;
	let text = "";
	for (let i = 0; i < data.bookList.length; i++) {
		text += `<tr>
		<td>
		${data.bookList[i]}
		</td>
		<td>
		${data.description[i]}</td>
		<td>
		${data.rating[i]}
		</td>
		<td>
		<input type = "submit" value = "View" onclick = "viewData(${i})">
		<input type = "submit" value = "Delete" onclick = "deleteData(${i})">
		</td>
		</tr>`;
	}
	table.innerHTML += header + text;
}

async function deleteData(idx) {
	const queryString = window.location.search;
	const queryParams = new URLSearchParams(queryString.substring(1));
	const id = queryParams.get("id");
	const url = `http://localhost:3000/public/api/${id}/${idx}`;

	await fetch(url, {
		method: "DELETE",
	});
	displayData();
}

function viewData(idx) {
	const queryString = window.location.search;
	const queryParams = new URLSearchParams(queryString.substring(1));
	const id = queryParams.get("id");
	window.location.href = `http://localhost:3000/public/main/details?id=${id}&index=${idx}`;
}

function removeData(idx) {
	const data = JSON.parse(localStorage.getItem("Data Admin"));
	const updatedObjects = data.filter((object, index) => index !== idx);
	localStorage.setItem("Data Admin", JSON.stringify(updatedObjects));
	displayData();
}

displayData();
