<script>
	import { gql } from '@apollo/client/core';
	import client from '../../apollo.js';

	let userInput = '',
		emailInput = '',
		passInput = '';

	const handleClick = () => {
		userInput = document.getElementById('userInput').value;
		emailInput = document.getElementById('emailInput').value;
		passInput = document.getElementById('passInput').value;
		console.log(userInput, emailInput, passInput);
	};

	//main function that calls the other functions in order
	function login() {
		pass;
	}
</script>

<h1>Login Page</h1>
<div>
	<div>
		<label for="userInput">Username:</label>
		<input type="text" id="userInput" onSubmit={handleClick} />
	</div>
	<div>
		<label for="emailInput">Email:</label>
		<input type="email" id="emailInput" onSubmit={handleClick} />
	</div>
	<div>
		<label for="passInput">Password:</label>
		<input type="password" id="passInput" onSubmit={handleClick} />
	</div>
	<button on:click={handleClick}>Submit</button>
</div>
