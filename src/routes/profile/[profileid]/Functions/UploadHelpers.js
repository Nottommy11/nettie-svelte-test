import {
	checkBeforeInsertQuestionsFromUpload,
	checkBeforeInsertAnswersFromUpload,
	checkBeforeInsertCorrectAnswersFromUpload,
	checkBeforeInsertIncorrectAnswersFromUpload
} from './CheckInsert.js';
import {
	insertQuestionsFromUpload,
	insertAnswersFromUpload,
	insertCorrectAnswersFromUpload,
	insertIncorrectAnswersFromUpload
} from './UploadInsert.js';
import {
	updateQuestionsFromUpload,
	updateAnswersFromUpload,
	updateCorrectAnswersFromUpload,
	updateIncorrectAnswersFromUpload
} from './UploadUpdate.js';

import { notifications } from '../../../notifications.js';

/* eslint-disable no-extra-boolean-cast */

function cleanUpQuestionsForUpload(rawQuestions) {
	try {
		let insertQuestions = [],
			updateQuestions = [],
			insertAnswers = [],
			updateAnswers = [],
			insertCorrectAnswers = [],
			updateCorrectAnswers = [],
			insertIncorrectAnswers = [],
			updateIncorrectAnswers = [];

		rawQuestions.forEach((question) => {
			let insertQuestion = {},
				updateQuestion = {},
				insertAnswer = {},
				updateAnswer = {},
				insertCorrectAnswer = {},
				updateCorrectAnswer = {},
				insertIncorrectAnswer = {},
				updateIncorrectAnswer = {};

			Object.keys(question).forEach((key) => {
				if (key.includes('answer') && question[key.replace('answer ', 'answerid ')] === undefined) {
					insertAnswer.answer = question[key];
					insertAnswer.question = question.question;
					insertAnswers.push(insertAnswer);
				}
				if (key.includes('answerid')) {
					updateAnswer.answerid = question[key];
					updateAnswer.answer = question[key.replace('id', '')];
					updateAnswers.push(updateAnswer);
				}

				if (
					key.includes('correct') &&
					!key.includes('incorrect') &&
					question[key.replace('answer ', 'answerid ')] === undefined
				) {
					insertCorrectAnswer.correctanswer = question[key];
					insertCorrectAnswer.question = question.question;
					insertCorrectAnswers.push(insertCorrectAnswer);
				}
				if (
					key.includes('correct answerid') &&
					!key.includes('incorrect') &&
					question[key] !== undefined
				) {
					updateCorrectAnswer.correctanswerid = question[key];
					updateCorrectAnswer.correctanswer = question[key.replace('id', '')];
					updateCorrectAnswers.push(updateCorrectAnswer);
				}

				if (
					key.includes('incorrect') &&
					question[key.replace('answer ', 'answerid ')] === undefined
				) {
					insertIncorrectAnswer.incorrectanswer = question[key];
					insertIncorrectAnswer.question = question.question;
					insertIncorrectAnswers.push(insertIncorrectAnswer);
				}
				if (key.includes('incorrect answerid')) {
					updateIncorrectAnswer.incorrectanswerid = question[key];
					updateIncorrectAnswer.incorrectanswer = question[key.replace('id', '')];
					updateIncorrectAnswers.push(updateIncorrectAnswer);
				}

				if (key.includes('question') && question.questionid === undefined) {
					insertQuestion.question = question[key];
					insertQuestions.push(insertQuestion);
				}
				if (key.includes('questionid')) {
					updateQuestion.questionid = question[key];
					updateQuestion.question = question[key.replace('id', '')];
					updateQuestions.push(updateQuestion);
				}

				(insertQuestion = {}),
					(updateQuestion = {}),
					(insertAnswer = {}),
					(updateAnswer = {}),
					(insertCorrectAnswer = {}),
					(updateCorrectAnswer = {}),
					(insertIncorrectAnswer = {}),
					(updateIncorrectAnswer = {});
			});
		});

		return {
			insertQuestions,
			updateQuestions,
			insertAnswers,
			updateAnswers,
			insertCorrectAnswers,
			updateCorrectAnswers,
			insertIncorrectAnswers,
			updateIncorrectAnswers
		};
	} catch (err) {
		notifications.danger('Error cleaning up questions for upload, check logs!', 5000);
		console.log(err);
	}
}

async function checkAllCaller(
	insertQuestions,
	insertAnswers,
	insertCorrectAnswers,
	insertIncorrectAnswers,
	netLvl
) {
	const questionsExist = await checkBeforeInsertQuestionsFromUpload(insertQuestions, netLvl);

	const answersExist = await checkBeforeInsertAnswersFromUpload(insertAnswers, netLvl);

	const correctAnswersExist = await checkBeforeInsertCorrectAnswersFromUpload(
		insertCorrectAnswers,
		netLvl
	);

	const incorrectAnswersExist = await checkBeforeInsertIncorrectAnswersFromUpload(
		insertIncorrectAnswers,
		netLvl
	);

	if (answersExist || questionsExist || correctAnswersExist || incorrectAnswersExist) {
		return true;
	}
	return false;
}

async function uploadAndInsertCaller(
	insertQuestions,
	updateQuestions,
	insertAnswers,
	updateAnswers,
	insertCorrectAnswers,
	updateCorrectAnswers,
	insertIncorrectAnswers,
	updateIncorrectAnswers,
	netLvl
) {
	if (!!insertQuestions) {
		if (insertQuestions.length > 0) {
			const newQuestions = await insertQuestionsFromUpload(insertQuestions, netLvl);

			if (newQuestions.length !== insertQuestions.length) {
				notifications.danger('Error inserting questions, check logs!', 5000);
				console.log('newQuestions: ', newQuestions, 'insertQuestions: ', insertQuestions);
				return;
			}
		}
	}

	if (!!updateQuestions) {
		if (updateQuestions.length > 0) {
			const updatedQuestions = await updateQuestionsFromUpload(updateQuestions, netLvl);

			if (updatedQuestions.length !== updateQuestions.length) {
				notifications.danger('Error updating questions, check logs!', 5000);
				console.log('updatedQuestions: ', updatedQuestions, 'updateQuestions: ', updateQuestions);
				return;
			}
		}
	}

	if (!!insertAnswers) {
		if (insertAnswers.length > 0) {
			const newAnswers = await insertAnswersFromUpload(insertAnswers, netLvl);

			if (newAnswers.length !== insertAnswers.length) {
				notifications.danger('Error inserting answers, check logs!', 5000);
				console.log('newAnswers: ', newAnswers, 'insertAnswers: ', insertAnswers);
				return;
			}
		}
	}

	if (!!updateAnswers) {
		if (updateAnswers.length > 0) {
			const updatedAnswers = await updateAnswersFromUpload(updateAnswers, netLvl);

			if (updatedAnswers.length !== updateAnswers.length) {
				notifications.danger('Error updating answers, check logs!', 5000);
				console.log('updatedAnswers: ', updatedAnswers, 'updateAnswers: ', updateAnswers);
				return;
			}
		}
	}

	if (!!insertCorrectAnswers) {
		if (insertCorrectAnswers.length > 0) {
			const newCorrectAnswers = await insertCorrectAnswersFromUpload(insertCorrectAnswers, netLvl);

			if (newCorrectAnswers.length !== insertCorrectAnswers.length) {
				notifications.danger('Error inserting correct answers, check logs!', 5000);
				console.log(
					'newCorrectAnswers: ',
					newCorrectAnswers,
					'insertCorrectAnswers: ',
					insertCorrectAnswers
				);
				return;
			}
		}
	}

	if (!!updateCorrectAnswers) {
		if (updateCorrectAnswers.length > 0) {
			const updatedCorrectAnswers = await updateCorrectAnswersFromUpload(
				updateCorrectAnswers,
				netLvl
			);

			if (updatedCorrectAnswers.length !== updateCorrectAnswers.length) {
				notifications.danger('Error updating correct answers, check logs!', 5000);
				console.log(
					'updatedCorrectAnswers: ',
					updatedCorrectAnswers,
					'updateCorrectAnswers: ',
					updateCorrectAnswers
				);
				return;
			}
		}
	}

	if (!!insertIncorrectAnswers) {
		if (insertIncorrectAnswers.length > 0) {
			const newIncorrectAnswers = await insertIncorrectAnswersFromUpload(
				insertIncorrectAnswers,
				netLvl
			);

			if (newIncorrectAnswers.length !== insertIncorrectAnswers.length) {
				notifications.danger('Error inserting incorrect answers, check logs!', 5000);
				console.log(
					'newIncorrectAnswers: ',
					newIncorrectAnswers,
					'insertIncorrectAnswers: ',
					insertIncorrectAnswers
				);
				return;
			}
		}
	}

	if (!!updateIncorrectAnswers) {
		if (updateIncorrectAnswers.length > 0) {
			const updatedIncorrectAnswers = await updateIncorrectAnswersFromUpload(
				updateIncorrectAnswers,
				netLvl
			);

			if (updatedIncorrectAnswers.length !== updateIncorrectAnswers.length) {
				notifications.danger('Error updating incorrect answers, check logs!', 5000);
				console.log(
					'updatedIncorrectAnswers: ',
					updatedIncorrectAnswers,
					'updateIncorrectAnswers: ',
					updateIncorrectAnswers
				);
				return;
			}
		}
	}
}

export { cleanUpQuestionsForUpload, checkAllCaller, uploadAndInsertCaller };
