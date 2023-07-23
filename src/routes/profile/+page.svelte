<script>
	import { gql } from '@apollo/client/core';
	import client from '../../apollo.js';

	let emailInput = '',
		userInput = '',
		passInput = '';

	let emailRes = {},
		usernameRes = {},
		passwordRes = {};

	const handleClick = () => {
		userInput = document.getElementById('userInput').value;
		emailInput = document.getElementById('emailInput').value;
		passInput = document.getElementById('passInput').value;
		checkEmail(emailInput);
		checkUsername(userInput);
		checkPassword(emailInput, userInput, passInput);
		login();
	};

	//main function that calls the other functions in order
	function login() {
		console.log(userInput, emailInput, passInput);
	}

	async function checkEmail(email) {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: email
				},
				query: gql`
					query checkEmail($email: citext!) {
						net_users_logins(where: { email: { _eq: $email } }) {
							email
							password
							username
							passwordrequired
						}
					}
				`
			});

			emailRes = (await myres).data.net_users_logins[0];

			return (await myres).data.net_users_logins[0];
		} catch (err) {
			console.log(err);
		}
	}

	async function checkUsername(username) {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					username: username
				},
				query: gql``
			});

			return (await myres).data;
		} catch (err) {
			console.log(err);
		}
	}

	async function addAccount(email, username) {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: email,
					username: username
				},
				query: gql``
			});

			return (await myres).data;
		} catch (err) {
			console.log(err);
		}
	}

	async function checkPassword(email, username, password) {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: email,
					username: username,
					password: password
				},
				query: gql``
			});

			return (await myres).data;
		} catch (err) {
			console.log(err);
		}
	}
</script>

<h1>Login Page</h1>
<form on:submit={handleClick}>
	<label for="emailInput">Email:</label>
	<input type="email" id="emailInput" required value={emailInput} />
	<label for="userInput">Username:</label>
	<input type="text" id="userInput" required value={userInput} />
	<label for="passInput">Password:</label>
	<input type="password" required id="passInput" value={passInput} />
	
	<button on:submit={handleClick}>Submit</button>
</form>
