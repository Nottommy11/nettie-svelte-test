<script>
	import { onMount } from 'svelte';
	import { gql } from '@apollo/client/core';
	import client from '../../../apollo.js';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import RiSystemArrowDropDownLine from 'svelte-icons-pack/ri/RiSystemArrowDropDownLine';

	let activeNetLvl = 1,
		activeFilter = {},
		activeSort = 'question',
		activeSortDir = 'asc',
		sortedQuestions = [];

	// Call the query anytime one of these variables change
	$: activeNetLvl,
		activeFilter,
		activeSort,
		activeSortDir,
		getQuestions(activeNetLvl, activeFilter, activeSort, activeSortDir);

	// Get questions based on selection

	async function getQuestions(netLvl, filter, sort, sortDir) {
		try {
			let wrapperClause = '',
				orderByClause = [],
				whereClause = [];

			if (sort == 'question') {
				if (sortDir == 'asc') {
					orderByClause.push('{ question: asc }');
				} else {
					orderByClause.push('{ question: desc }');
				}
			} else if (sort == 'correct') {
				if (sortDir == 'asc') {
					orderByClause.push('{ net_answers_aggregate: { count: asc }}');
					orderByClause.push('{ net_incorrect_answers_aggregate: { count: asc }}');
				} else {
					orderByClause.push('{ net_answers_aggregate: { count: desc }}');
					orderByClause.push('{ net_incorrect_answers_aggregate: { count: desc }}');
				}
			} else if (sort == 'incorrect') {
				if (sortDir == 'asc') {
					orderByClause.push('{ net_incorrect_answers_aggregate: { count: asc }}');
					orderByClause.push('{ net_answers_aggregate: { count: asc }}');
				} else {
					orderByClause.push('{ net_incorrect_answers_aggregate: { count: desc }}');
					orderByClause.push('{ net_answers_aggregate: { count: desc }}');
				}
			} else if (sort == 'images') {
				if (sortDir == 'asc') {
					orderByClause.push('{ net_images_aggregate: { count: asc }}');
				} else {
					orderByClause.push('{ net_images_aggregate: { count: desc }}');
				}
			}

			!!orderByClause
				? (orderByClause = `order_by: [${orderByClause.join(',')}]`)
				: (orderByClause = null);

			if (filter.question) {
				whereClause.push(`question: {_ilike: "%${filter.question}%"}`);
			}
			if (filter.correct) {
				whereClause.push(`net_answers_aggregate: {count: {predicate: {_eq: ${filter.correct}}}}`);
			}
			if (filter.incorrect) {
				whereClause.push(
					`net_incorrect_answers_aggregate: {count: {predicate: {_eq: ${filter.incorrect}}}}`
				);
			}
			if (filter.images) {
				whereClause.push(`net_images_aggregate: {count: {predicate: {_eq: ${filter.correct}}}}`);
			}

			!!whereClause ? (whereClause = `where: {${whereClause.join(',')}}`) : (whereClause = null);

			!!orderByClause && !!whereClause
				? (wrapperClause = `(${orderByClause}, ${whereClause})`)
				: !!orderByClause
				? (wrapperClause = `(${orderByClause})`)
				: !!whereClause
				? (wrapperClause = `(${whereClause})`)
				: (wrapperClause = '');

			const myres = client.query({
				Method: 'POST',
				query: gql`
						query getNet${netLvl}Questions {
							net_${netLvl}_net_questions${wrapperClause}
							{
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

			sortedQuestions = (await myres).data[`net_${netLvl}_net_questions`];
		} catch (err) {
			console.log(err);
		}
	}

	onMount(async () => {
		await getQuestions(activeNetLvl, activeFilter, activeSort, activeSortDir);
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="lvl-dropdown">
	<div class="lvl-dropdown-btn">
		<div class="lvl-dropdown-btn-text">Select Net Lvl</div>
	</div>
	<div class="lvl-dropdown-content">
		<div
			on:click={() => {
				activeNetLvl = 1;
			}}
			class="lvl-dropdown-item"
		>
			Net 1
		</div>
		<div
			on:click={() => {
				activeNetLvl = 2;
			}}
			class="lvl-dropdown-item"
		>
			Net 2
		</div>
		<div
			on:click={() => {
				activeNetLvl = 3;
			}}
			class="lvl-dropdown-item"
		>
			Net 3
		</div>
		<div
			on:click={() => {
				activeNetLvl = 4;
			}}
			class="lvl-dropdown-item"
		>
			Net 4
		</div>
	</div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="filter-container">
	<div class="filter-selection">Select Filters</div>
	<div class="filter-item">
		Question Is Like
		<input
			type="text"
			class="filter-input"
			on:change={(value) => {
				activeFilter.question = value.target.value;
			}}
		/>
	</div>
	<div class="filter-it">
		Num Correct Is
		<input
			type="text"
			class="filter-input"
			on:change={(value) => {
				activeFilter.correct = value.target.value;
			}}
		/>
	</div>
	<div class="filter-item">
		Num Incorrect Is
		<input
			type="text"
			class="filter-input"
			on:change={(value) => {
				activeFilter.incorrect = value.target.value;
			}}
		/>
		<div class="filter-item">
			Num Images Is
			<input
				type="text"
				class="filter-input"
				on:change={(value) => {
					activeFilter.images = value.target.value;
				}}
			/>
		</div>
	</div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="table-container">
	<div class="table">
		<div class="table-head">
			<div class="table-head-row">
				<div id="expand-header" class="table-head-item">Expand</div>
				<div id="question-header" class="table-head-item">
					Question
					<div
						id="question-sort"
						class={'table-sort' + (activeSort == 'question' ? ' active-sort' : '')}
					>
						<div
							on:click={() => {
								activeSort = 'question';
								activeSortDir = 'asc';
							}}
							class={'sort-asc' +
								(activeSortDir == 'asc' && activeSort == 'question' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'asc' && activeSort == 'question' ? 'red' : 'black'}
							/>
						</div>
						<div
							on:click={() => {
								activeSort = 'question';
								activeSortDir = 'desc';
							}}
							class={'sort-desc' +
								(activeSortDir == 'desc' && activeSort == 'question' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'desc' && activeSort == 'question' ? 'red' : 'black'}
							/>
						</div>
					</div>
				</div>
				<div id="correct-header" class="table-head-item">
					Num Correct
					<div
						id="correct-sort"
						class={'table-sort' + (activeSort == 'correct' ? ' active-sort' : '')}
					>
						<div
							on:click={() => {
								activeSort = 'correct';
								activeSortDir = 'asc';
							}}
							class={'sort-asc' +
								(activeSortDir == 'asc' && activeSort == 'correct' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'asc' && activeSort == 'correct' ? 'red' : 'black'}
							/>
						</div>
						<div
							on:click={() => {
								activeSort = 'correct';
								activeSortDir = 'desc';
							}}
							class={'sort-desc' +
								(activeSortDir == 'desc' && activeSort == 'correct' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'desc' && activeSort == 'correct' ? 'red' : 'black'}
							/>
						</div>
					</div>
				</div>
				<div id="incorrect-header" class="table-head-item">
					Num Incorrect
					<div
						id="incorrect-sort"
						class={'table-sort' + (activeSort == 'incorrect' ? ' active-sort' : '')}
					>
						<div
							on:click={() => {
								activeSort = 'incorrect';
								activeSortDir = 'asc';
							}}
							class={'sort-asc' +
								(activeSortDir == 'asc' && activeSort == 'incorrect' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'asc' && activeSort == 'incorrect' ? 'red' : 'black'}
							/>
						</div>
						<div
							on:click={() => {
								activeSort = 'incorrect';
								activeSortDir = 'desc';
							}}
							class={'sort-desc' +
								(activeSortDir == 'desc' && activeSort == 'incorrect' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'desc' && activeSort == 'incorrect' ? 'red' : 'black'}
							/>
						</div>
					</div>
				</div>
				<div id="images-header" class="table-head-item">
					Num Images
					<div
						id="images-sort"
						class={'table-sort' + (activeSort == 'images' ? ' active-sort' : '')}
					>
						<div
							on:click={() => {
								activeSort = 'images';
								activeSortDir = 'asc';
							}}
							class={'sort-asc' +
								(activeSortDir == 'asc' && activeSort == 'images' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'asc' && activeSort == 'images' ? 'red' : 'black'}
							/>
						</div>
						<div
							on:click={() => {
								activeSort = 'images';
								activeSortDir = 'desc';
							}}
							class={'sort-desc' +
								(activeSortDir == 'desc' && activeSort == 'images' ? ' active-sort-dir' : '')}
						>
							<Icon
								src={RiSystemArrowDropDownLine}
								color={activeSortDir == 'desc' && activeSort == 'images' ? 'red' : 'black'}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="table-body">
			{#each sortedQuestions as question}
				<div class="table-row">
					<div class="table-item expand-column" />
					<div class="table-item question-column">{question.question}</div>
					<div class="table-item correct-column">{question.net_answers.length}</div>
					<div class="table-item incorrect-column">{question.net_incorrect_answers.length}</div>
					<div class="table-item images-column">question.images.length</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.table-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		color: #000;
	}

	.table {
		display: flex;
		flex-direction: column;
		width: 95%;
		background-color: #fff;
		border: 2px solid #000;
	}

	.table-head {
		border: 2px solid #000;
		width: 100%;
		font-size: 1.5rem;
	}

	.table-head-row {
		display: flex;
		align-items: center;
		flex-direction: row;
		width: 100%;
	}

	.table-head-item {
		display: flex;
		align-items: center;
		flex-direction: row;
		font-size: 1.5rem;
		width: 20%;
		height: 100%;
		justify-content: space-evenly;
		border-left: 1px solid #000;
	}

	#expand-header {
		border-left: 0px;
	}

	.table-sort {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 2rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.active-sort {
		background-color: #00000048;
		border-radius: 50%;
	}

	.sort-asc {
		transform: rotateX(180deg);
	}

	.sort-asc:hover {
		cursor: pointer;
	}

	.sort-desc:hover {
		cursor: pointer;
	}

	.table-body {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.table-row {
		display: flex;
		flex-direction: row;
		width: 100%;
		border-top: 1px solid #000;
	}

	.table-item {
		display: flex;
		align-items: center;
		flex-direction: row;
		font-size: 1.5rem;
		width: 20%;
		height: 100%;
		justify-content: space-evenly;
		border-left: 1px solid #000;
		padding: 0.5rem;
	}
</style>
