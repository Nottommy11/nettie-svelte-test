<script>
	import { onMount } from 'svelte';
	import { gql } from '@apollo/client/core';
	import client from '../../../apollo.js';
	import { page } from '$app/stores';

	const netLvl = $page.params.netLvl;

	let questions = [],
		radioQuestions = [],
		answers = [],
		numCorrect = 0,
		percentCorrect = 0,
		checkedAnswers = [];

	async function getQuestions() {
		try {
			let getQuestion;

			if (netLvl == 1) {
				getQuestion = gql`
					query MyQuery {
						net_1_net_questions(limit: 5) {
							question
							questionid
							net_answers {
								answer
								answerid
							}
							net_incorrect_answers {
								incorrectanswer
								incorrectanswerid
							}
						}
					}
				`;

				const myres = client.query({
					query: getQuestion,
					Method: 'POST'
				});

				return (await myres).data.net_1_net_questions;
			} else if (netLvl == 2) {
				getQuestion = gql`
					query MyQuery {
						net_2_net_questions(limit: 10) {
							question
							questionid
							net_answers {
								answer
								answerid
							}
							net_incorrect_answers {
								incorrectanswer
								incorrectanswerid
							}
						}
					}
				`;

				const myres = client.query({
					query: getQuestion,
					Method: 'POST'
				});

				return (await myres).data.net_2_net_questions;
			} else if (netLvl == 3) {
				getQuestion = gql`
					query MyQuery {
						net_3_net_questions(limit: 10) {
							question
							questionid
							net_answers {
								answer
								answerid
							}
							net_incorrect_answers {
								incorrectanswer
								incorrectanswerid
							}
						}
					}
				`;

				const myres = client.query({
					query: getQuestion,
					Method: 'POST'
				});

				return (await myres).data.net_3_net_questions;
			} else if (netLvl == 4) {
				getQuestion = gql`
					query MyQuery {
						net_4_net_questions(limit: 10) {
							question
							questionid
							net_answers {
								answer
								answerid
							}
							net_incorrect_answers {
								incorrectanswer
								incorrectanswerid
							}
						}
					}
				`;

				const myres = client.query({
					query: getQuestion,
					Method: 'POST'
				});

				return (await myres).data.net_4_net_questions;
			}
		} catch (err) {
			console.log(err);
		}
	}

	onMount(async () => {
		const rawData = await getQuestions();
		questions = rawData;
		radioQuestions = questions.map((question) => {
			return {
				question: question.question,
				questionid: question.questionid,
				answers: [...question.net_answers, ...question.net_incorrect_answers]
			};
		});

		shuffleArray(radioQuestions);

		radioQuestions.forEach((question) => {
			shuffleArray(question.answers);
		});
	});

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	function getAnswers() {
		const answerInputs = document.querySelectorAll('input[type="radio"]:checked');
		answerInputs.forEach((input) => {
			answers.push(input.value);
		});
	}

	function submitAnswers(e) {
		e.preventDefault();
		answers = [];
		numCorrect = 0;
		percentCorrect = 0;
		getAnswers();
		checkAnswers();
	}

	function checkAnswers() {
		checkedAnswers = radioQuestions.map((question, iterable) => {
			return question.answers.map((answer) => {
				if (answer.answerid == answers[iterable]) {
					numCorrect++;
					return true;
				} else {
					return false;
				}
			});
		});
		console.log(checkedAnswers, numCorrect);
		percentCorrect = (numCorrect / questions.length) * 100;
		console.log(parseInt(percentCorrect) + '%');
	}
</script>

<div class="questions-container">
	{#await questions}
		<h1>Loading...</h1>
	{:then questions}
		<form on:submit={submitAnswers}>
			{#if percentCorrect > 0}
				<h1>{parseInt(percentCorrect)}%</h1>
			{/if}

			{#each radioQuestions as question}
				<div class="question">
					<h3>{question.question}</h3>

					{#each question.answers as answer}
						<div class="answer">
							<input
								type="radio"
								name={question.questionid}
								id={!!answer.answerid ? answer.answerid : answer.incorrectanswerid}
								value={!!answer.answerid ? answer.answerid : answer.incorrectanswerid}
								required
							/>
							<label for={!!answer.answerid ? answer.answerid : answer.incorrectanswerid}
								>{!!answer.answer ? answer.answer : answer.incorrectanswer}</label
							>
						</div>
					{/each}
				</div>
			{/each}
			<button>Submit</button>
		</form>
	{/await}
</div>
