export default function getParticipant(userEmail, usersArray) {
	return usersArray.find((user) => user.email !== userEmail);
}
