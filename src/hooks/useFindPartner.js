export default function useFindPartner(currentUserEmail, userArray) {
	return userArray?.find((user) => user.email !== currentUserEmail);
}
