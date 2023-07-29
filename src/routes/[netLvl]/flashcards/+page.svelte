<script>
	import { onMount } from 'svelte';
	import { gql } from '@apollo/client/core';
	import client from '../../../apollo.js';
	import { page } from '$app/stores';
	import Flashcard from './Flashcard.svelte';

	const netLvl = $page.params.netLvl;

	let questions = [];

	async function getQuestions() {
		try {
			const numberOfRecordsInTable = 115;
			const numberOfRecordsForFirstArg = 5;
			const skip = getRandomInt(numberOfRecordsInTable, numberOfRecordsForFirstArg);
			const limit = 5;

			if (netLvl == 1) {
				const myres = client.query({
					Method: 'POST',
					variables: {
						skip: skip,
						limit: limit
					},
					query: gql`
						query getNet1Questions($limit: Int!, $skip: Int!) {
							net_1_net_questions(limit: $limit, offset: $skip) {
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
					`
				});

				return (await myres).data.net_1_net_questions;
			} else if (netLvl == 2) {
				const myres = client.query({
					Method: 'POST',
					variables: {
						skip: skip,
						limit: limit
					},
					query: gql`
						query getNet2Questions($limit: Int!, $skip: Int!) {
							net_2_net_questions(limit: $limit, offset: $skip) {
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
					`
				});

				return (await myres).data.net_2_net_questions;
			} else if (netLvl == 3) {
				const myres = client.query({
					Method: 'POST',
					variables: {
						skip: skip,
						limit: limit
					},
					query: gql`
						query getNet3Questions($limit: Int!, $skip: Int!) {
							net_3_net_questions(limit: $limit, offset: $skip) {
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
					`
				});

				return (await myres).data.net_3_net_questions;
			} else if (netLvl == 4) {
				const myres = client.query({
					Method: 'POST',
					variables: {
						skip: skip,
						limit: limit
					},
					query: gql`
						query getNet4Questions($limit: Int!, $skip: Int!) {
							net_4_net_questions(limit: $limit, offset: $skip) {
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
					`
				});

				return (await myres).data.net_4_net_questions;
			}
		} catch (err) {
			console.log(err);
		}
	}

	onMount(async () => {
		const rawData = await getQuestions();

		questions = rawData.map((question) => {
			return {
				question: question.question,
				questionid: question.questionid,
				correctAnswers: question.net_answers,
				incorrectAnswers: question.net_incorrect_answers,
				answers: [...question.net_answers, ...question.net_incorrect_answers]
			};
		});

		shuffleArray(questions);

		questions.forEach((question) => {
			shuffleArray(question.answers);
		});

		console.log(questions);
	});

	function getRandomInt(max, slice) {
		const n = Math.floor(Math.random() * Math.floor(max)) - slice;
		return n < 0 ? 0 : n;
	}

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	let flashcardIndex = 0;

	let showCardBack = false;
	const toggleShowBack = () => (showCardBack = !showCardBack);

	const prevCard = () => {
		showCardBack = false;
		if (flashcardIndex === 0) {
			flashcardIndex = questions.length - 1;
		} else {
			flashcardIndex -= 1;
		}
	};

	const nextCard = () => {
		showCardBack = false;
		if (flashcardIndex === questions.length - 1) {
			flashcardIndex = 0;
		} else {
			flashcardIndex += 1;
		}
	};
</script>

<h1>FLASHCARDS</h1>

<div class="flashcard-container">
	<button on:click={prevCard}>Prev</button>
	<div
		class="flashcard-card"
		class:flip-it={showCardBack}
		on:click={toggleShowBack}
		on:keydown={(key) => key.key() === 'SPACE'}
	>
		{#if questions.length > 0}
			<Flashcard
				question={questions[flashcardIndex].question}
				answers={questions[flashcardIndex].answers}
				{showCardBack}
			/>
		{/if}
	</div>
	<button on:click={nextCard}>Next</button>
</div>

<style>
	.flashcard-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		perspective: 1000px; /* Remove this if you don't want the 3D effect */
	}

	.flashcard-card {
		position: relative;
		width: 50%;
		height: 50%;
		text-align: center;
		transform-style: preserve-3d;
	}

	/* Do an horizontal flip on button click */
	.flip-it {
		transition: transform 0.4s;
		transform: rotateY(180deg);
	}
</style>
