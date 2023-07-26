<script>
	import { gql } from '@apollo/client/core';
	import client from '../../apollo.js';
	import { mutation } from 'svelte-apollo';

	let emailInput = '',
		usernameInput = '',
		passwordInput = '';

	let noAccountForEmail = false,
		emailExists = false,
		usernameExists = false,
		passwordRequired = false;

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
							username
							passwordrequired
						}
					}
				`
			});

			const emailRes = (await myres).data.net_users_logins[0];

			if (emailRes) {
				noAccountForEmail = false;
				emailExists = true;
				emailRes.passwordrequired && (passwordRequired = true);
			} else {
				noAccountForEmail = true;
				emailExists = false;
				passwordRequired = false;
			}
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
				query: gql`
					query checkForUsername($username: name!) {
						net_users_logins(where: { username: { _eq: $username } }) {
							username
						}
					}
				`
			});

			const usernameRes = (await myres).data.net_users_logins[0];

			if (usernameRes) {
				usernameExists = true;
			} else {
				usernameExists = false;
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function checkPassword(email, password) {
		try {
			const myres = client.query({
				Method: 'POST',
				variables: {
					email: email,
					password: password
				},
				query: gql`
					query checkForLogin($email: citext!, $password: String!) {
						net_users_logins(
							where: { _and: [{ email: { _eq: $email } }, { password: { _eq: $password } }] }
						) {
							loginid
							username
						}
					}
				`
			});

			const loginRes = (await myres).data.net_users_logins[0];

			if (loginRes) {
				console.log('login successful');
			} else {
				console.log('login failed');
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function handleLogin(email) {
		try {
			await checkEmail(email);

			if (emailExists && !passwordRequired) {
				console.log('login successful');
			} else {
				console.log('login failed');
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function addAccount(email, username) {
		try {
			if (usernameExists) {
				return;
			}

			const myres = client.mutate({
				Method: 'POST',
				variables: {
					email: email,
					username: username
				},
				mutation: gql`
					mutation addAccount($email: citext!, $username: name!) {
						insert_net_users_logins(objects: { email: $email, username: $username }) {
							returning {
								username
								loginid
							}
						}
					}
				`
			});

			const addAccountRes = (await myres).data.insert_net_users_logins.returning[0];

			if (addAccountRes) {
				console.log('account created');
			} else {
				console.log('account creation failed');
			}
		} catch (err) {
			console.log(err);
		}
	}
</script>

<h1>Login Page</h1>

<form>
	<h1>Enter Your Email</h1>
	<label for="email">Email</label>
	<input
		for="email"
		type="email"
		bind:value={emailInput}
		on:change={() => {
			emailInput.includes('@') && emailInput.includes('.') && checkEmail(emailInput);
		}}
	/>

	{#if passwordRequired}
		<label for="password">Password</label>
		<input for="password" type="password" bind:value={passwordInput} />
		<button on:click={checkPassword(emailInput, passwordInput)}> Login </button>
	{:else if noAccountForEmail}
		<label for="username">Username</label>
		<input
			for="username"
			type="text"
			bind:value={usernameInput}
			on:change={checkUsername(usernameInput)}
		/>
		{#if usernameExists}
			<p>Username already exists</p>
		{/if}
		<button on:click={addAccount(emailInput, usernameInput)}>Create Account</button>
	{:else if emailExists && !passwordRequired}
		<button on:click={handleLogin(emailInput)}>Login</button>
	{/if}
</form>
