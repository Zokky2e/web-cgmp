"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "@/app/models";

export default function UserList() {
	const [data, setData] = useState<IUser[]>([]);

	useEffect(() => {
		axios
			.get(`http://localhost:3000/api/users`)
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	return (
		<ul>
			{data.map((item, index) => (
				<li key={index}>
					{item.name} - {item.age.toString()} - {item.job}
				</li>
			))}
		</ul>
	);
}
