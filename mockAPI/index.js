async function getData() {
	const url = "https://641ef92bad55ae01ccb3b13c.mockapi.io/user/user/1";
	const response = await fetch(url);
	console.log(await response.json());
}
console.log(getData());
