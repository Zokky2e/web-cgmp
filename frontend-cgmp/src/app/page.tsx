import UserList from "./components/users/UserList";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div>
				<h1>Data from MongoDB:</h1>

				<UserList />
			</div>
		</main>
	);
}
