<script>
	import { gql } from '@apollo/client/core';
	import client from '../../apollo.js';

	let emailInput = '',
		userInput = '',
		passInput = '';

	let account = {};

	async function getAccount() {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: emailInput
				},
				query: gql`
					query getAccount($email: citext!) {
						net_users_logins(where: { email: { _eq: $email } }) {
							email
							password
							username
							passwordrequired
						}
					}
				`
			});

			account = (await myres).data.net_users_logins[0];
			// console.log(account);

			if (account == undefined) { //if the account doesn't exist
				console.log('Create new account');
			} else if (account.username == userInput) { //if the userinput matches the account
				if(account.passwordrequired == false){ //if it doesn't require a password
					console.log('signed in!')
				} else { //if it requires a password
					if(account.password == passInput){
						console.log('signed in!')
					} else {
						console.log('incorrect password')
					}
				}
			} else {
				console.log('wrong username')
			}
		} catch (err) {
			console.log(err);
		}
	}

	const handleClick = () => {
		//these get the text box value
		userInput = document.getElementById('userInput').value;
		emailInput = document.getElementById('emailInput').value;
		passInput = document.getElementById('passInput').value;
		getAccount();
		// login();
	};

	//main function that calls the other functions in order
	function login() {
		console.log(userInput, emailInput, passInput);
	}
</script>

<h1>Login Page</h1>
<form on:submit={handleClick}>
	<div>
		<label for="emailInput">Email:</label>
		<input type="email" id="emailInput" required value={emailInput} />
	</div>
	<div>
		<label for="userInput">Username:</label>
		<input type="text" id="userInput" required value={userInput} />
	</div>
	<div>
		<label for="passInput">Password:</label>
		<input type="password" id="passInput" value={passInput} />
	</div>

	<button on:submit={handleClick}>Submit</button>
</form>
