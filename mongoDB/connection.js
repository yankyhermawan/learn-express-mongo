import { MongoClient } from "mongodb";
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
const uri =
	"mongodb+srv://yankyhermawan42:hades123@cluster0.ayxytig.mongodb.net/users?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const jwtSecret = "This is Secret";

async function checkUserLogin(user, pass) {
	await client.connect();
	const collection = client.db("users").collection("user_login");
	const query = { email: user, password: pass };
	const result = JSON.parse(
		JSON.stringify(await collection.find(query).toArray())
	);
	return result;
}

async function getBooksCollection(userID) {
	await client.connect();
	const collection = client.db("users").collection("books_collection");
	const query = { userID: userID };
	const result = JSON.parse(
		JSON.stringify(await collection.find(query).toArray())
	);
	return result || {};
}

async function updateBooksCollection(userID, data) {
	await client.connect();
	const collection = client.db("users").collection("books_collection");
	const query = { userID: userID };
	const addData = {
		$push: {
			bookList: data.bookList,
			rating: data.rating,
			description: data.description,
		},
	};
	await collection.updateOne(query, addData);
}

async function updateBookData(userID, index, data) {
	await client.connect();
	const collection = client.db("users").collection("books_collection");
	const query = { userID: userID };
	const updatedDoc = {
		$set: {
			[`bookList.${index}`]: data.name,
			[`rating.${index}`]: data.rating,
			[`description.${index}`]: data.description,
		},
	};
	await collection.updateOne(query, updatedDoc);
}

async function deleteBookData(userID, indexToDelete) {
	await client.connect();
	const collection = client.db("users").collection("books_collection");
	const filter = { userID: userID };
	const data = await getBooksCollection(userID);
	const bookList = data[0].bookList;
	const ratingList = data[0].rating;
	const descriptionList = data[0].description;
	const newBookList = bookList
		.slice(0, indexToDelete)
		.concat(bookList.slice(indexToDelete + 1));
	const newRatingList = ratingList
		.slice(0, indexToDelete)
		.concat(ratingList.slice(indexToDelete + 1));
	const newDescriptionList = descriptionList
		.slice(0, indexToDelete)
		.concat(descriptionList.slice(indexToDelete + 1));
	console.log(newBookList, newDescriptionList, newRatingList);
	const updated = {
		$set: {
			bookList: newBookList,
			rating: newRatingList,
			description: newDescriptionList,
		},
	};
	collection.updateOne(filter, updated);
}

app.get("/", (req, res) => {
	res.redirect("./public");
});

app.get("/public", (req, res) => {
	const filePath = path.join(__dirname, "/public/login.html");
	res.sendFile(filePath);
});

app.route("/api/login").post(async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await checkUserLogin(email, password);

		if (user.length === 0) {
			return res.status(401).json({ error: "Invalid login credentials" });
		}

		const token = jwt.sign({ email: user.email }, jwtSecret, {
			expiresIn: "1h",
		});
		const id = user[0]._id;
		console.log(id);
		res.json({ token, userID: id });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
});

app.route("/public/main").get(async (req, res) => {
	res.sendFile(path.join(__dirname, "/public/main.html"));
});

app.get("/public/main.css", (req, res) => {
	res.type("text/css");
	res.sendFile(__dirname + "/public/main.css");
});
app.get("/public/main.js", (req, res) => {
	const filePath = path.join(__dirname, "/public/main.js");
	res.sendFile(filePath);
});

app.route("/public/api/signup").post(async (req, res) => {
	try {
		const data = req.body;
		await client.connect();
		const userCollection = client.db("users").collection("user_login");
		await userCollection.insertOne(data);
		const userObject = await userCollection.findOne(data);
		const userID = userObject._id.toString();
		const bookCollection = client.db("users").collection("books_collection");
		const booksData = {
			userID: userID,
			bookList: [],
			rating: [],
			description: [],
		};
		await bookCollection.insertOne(booksData);
	} catch (err) {
		console.error(err);
	}
});

app
	.route("/public/api/:id")
	.get(async (req, res) => {
		const uid = req.params.id;
		const bookData = await getBooksCollection(uid);
		res.json(bookData[0]);
	})
	.post(async (req, res) => {
		const uid = req.params.id;
		const data = req.body;
		res.json(await updateBooksCollection(uid, data));
	});

app
	.route("/public/api/:id/:index")
	.get(async (req, res) => {
		const uid = req.params.id;
		const index = req.params.index;
		const bookData = await getBooksCollection(uid);
		const bookName = bookData[0].bookList[index];
		const bookRating = bookData[0].rating[index];
		const bookDescription = bookData[0].description[index];
		const data = [
			{
				name: bookName,
				rating: bookRating,
				description: bookDescription,
			},
		];
		res.json(data);
	})
	.put((req, res) => {
		const uid = req.params.id;
		const index = req.params.index;
		const data = req.body;
		updateBookData(uid, index, data);
		res.redirect(`/public/main?id=${uid}`);
	})
	.delete(async (req, res) => {
		const uid = req.params.id;
		const index = req.params.index;
		await deleteBookData(uid, index);
		res.redirect(`/public/main?id=${uid}`);
	});

app.route("/public/main/details").get((req, res) => {
	const filePath = path.join(__dirname, "/public/details.html");
	res.sendFile(filePath);
});

app.route("/public/main/details.js").get((req, res) => {
	const filePath = path.join(__dirname, "/public/details.js");
	res.type("application/javascript");
	res.sendFile(filePath);
});

app.get("/public/signup", (req, res) => {
	const filePath = path.join(__dirname, "/public/signup.html");
	res.sendFile(filePath);
});
app.get("/public/signup.css", (req, res) => {
	const filePath = path.join(__dirname, "/public/signup.css");
	res.sendFile(filePath);
});
app.get("/public/signup.js", (req, res) => {
	const filePath = path.join(__dirname, "/public/signup.js");
	res.sendFile(filePath);
});

app.listen(3000, () => {
	console.log("Server listening on port 3000");
});
