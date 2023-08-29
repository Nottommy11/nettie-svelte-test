import client from '../../../../apollo.js';
import { gql } from '@apollo/client';

import { notifications } from '../../../notifications.js';

async function checkBeforeInsertQuestionsFromUpload(insertQuestions, netLvl) {
	try {
		const myres = client.query({
			Method: 'POST',
			query: gql`
				query check${netLvl}UploadQuestionsInsert($questions: [String!]!) {
					net_${netLvl}_net_questions(where: { question: { _in: $questions } }) {
						question
						questionid
					}
				}
			`,
			variables: {
				questions: insertQuestions.map((question) => question.question)
			}
		});

		const result = await myres;

		if (result.data[`net_${netLvl}_net_questions`].length > 0) {
			notifications.danger('Error inserting questions, check logs!', 5000);
			console.log(
				"Questions already exist, can't insert!",
				result.data[`net_${netLvl}_net_questions`]
			);
			return true;
		} else {
			return false;
		}
	} catch (err) {
		notifications.danger('Error checking insert of questions, check logs!', 5000);
		console.log(err);
	}
}

async function checkBeforeInsertAnswersFromUpload(insertAnswers, netLvl) {
	try {
		const myres = client.query({
			Method: 'POST',
			query: gql`
				query check${netLvl}UploadAnswersInsert($answers: [String!]!, $question: [String!]!) {
					net_${netLvl}_net_answers(where: {_and: [ {answer: { _in: $answers } }, {question: { _in: $question } }]}) {
						question
					}
				}
			`,
			variables: {
				answers: insertAnswers.map((answer) => answer.answer),
				question: insertAnswers.map((answer) => answer.question)
			}
		});

		const result = await myres;

		if (result.data[`net_${netLvl}_net_answers`].length > 0) {
			notifications.danger('Error inserting answers, check logs!', 5000);
			console.log("Answers already exist, can't insert!", result.data[`net_${netLvl}_net_answers`]);
			return true;
		} else {
			return false;
		}
	} catch (err) {
		notifications.danger('Error checking insert of answers, check logs!', 5000);
		console.log(err);
	}
}

async function checkBeforeInsertCorrectAnswersFromUpload(insertCorrectAnswers, netLvl) {
	try {
		const myres = client.query({
			Method: 'POST',
			query: gql`
				query check${netLvl}UploadCorrectAnswersInsert($correctanswers: [String!]!, $question: [String!]!) {
					net_${netLvl}_net_correct_answers(where: {_and: [ {correctanswer: { _in: $correctanswers } }, {question: { _in: $question } }]}) {
						question
					}
				}
			`,
			variables: {
				correctanswers: insertCorrectAnswers.map((correctanswer) => correctanswer.correctanswer),
				question: insertCorrectAnswers.map((correctanswer) => correctanswer.question)
			}
		});

		const result = await myres;

		if (result.data[`net_${netLvl}_net_correct_answers`].length > 0) {
			notifications.danger('Error inserting correct answers, check logs!', 5000);
			console.log(
				"Correct answers already exist, can't insert!",
				result.data[`net_${netLvl}_net_correct_answers`]
			);
			return true;
		} else {
			return false;
		}
	} catch (err) {
		notifications.danger('Error checking insert of correct answers, check logs!', 5000);
		console.log(err);
	}
}

async function checkBeforeInsertIncorrectAnswersFromUpload(insertIncorrectAnswers, netLvl) {
	try {
		const myres = client.query({
			Method: 'POST',
			query: gql`
				query check${netLvl}UploadIncorrectAnswersInsert($incorrectanswers: [String!]!, $question: [String!]!) {
					net_${netLvl}_net_incorrect_answers(where: {_and: [ {incorrectanswer: { _in: $incorrectanswers } }, {question: { _in: $question } }]}) {
						question
					}
				}
			`,
			variables: {
				incorrectanswers: insertIncorrectAnswers.map(
					(incorrectanswer) => incorrectanswer.incorrectanswer
				),
				question: insertIncorrectAnswers.map((incorrectanswer) => incorrectanswer.question)
			}
		});

		const result = await myres;

		if (result.data[`net_${netLvl}_net_incorrect_answers`].length > 0) {
			notifications.danger('Error inserting incorrect answers, check logs!', 5000);
			console.log(
				"Incorrect answers already exist, can't insert!",
				result.data[`net_${netLvl}_net_incorrect_answers`]
			);
			return true;
		} else {
			return false;
		}
	} catch (err) {
		notifications.danger('Error checking insert of incorrect answers, check logs!', 5000);
		console.log(err);
	}
}

export {
	checkBeforeInsertQuestionsFromUpload,
	checkBeforeInsertAnswersFromUpload,
	checkBeforeInsertCorrectAnswersFromUpload,
	checkBeforeInsertIncorrectAnswersFromUpload
};
