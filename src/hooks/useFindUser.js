export default function useFindUser(currentUserEmail, userArray) {
	return userArray?.find((user) => user?.email === currentUserEmail);
}
