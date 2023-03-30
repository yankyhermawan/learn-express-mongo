const url = "https://641ef92bad55ae01ccb3b13c.mockapi.io/user/user";

const formdata = {
	username: "abcdef",
	email: "abcdef@bejo.com",
	password: "bejobejo",
};
const options = {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify(formdata),
};

fetch(url, options)
	.then((response) => response.json())
	.then((data) => console.log(data))
	.catch((err) => console.error(err));
