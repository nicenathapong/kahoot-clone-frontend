export function getUserCorrectAnswerCount(session, user) {
    return user.answers.filter((a) => {
        const question = session.category.questions[a.questionIndex];
        if (question.choices.findIndex((c) => c.correct) === a.choiceIndex)
            return true;
        return false;
    }).length;
}