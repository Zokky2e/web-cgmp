"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import axios from "axios";
import { IPolygon } from "@/app/models";
import { Button, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import _ from "underscore";
export default function UserList() {
	const [data, setData] = useState<IPolygon[]>([]);
	const [imageUrl, setImageUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	function openImage(id: String, created_at: Number) {
		return `http://localhost:3000/api/polygon/${id}/${created_at}`;
	}

	useEffect(() => {
		axios
			.get(`http://localhost:3000/api/polygon`)
			.then((response) => {
				console.log(response);
				setData(response.data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	return (
		<>
			{loading && <CircularProgress />}
			{error && <Typography color="error">{error}</Typography>}
			<ul>
				{data.map((item, index) => (
					<li key={index}>
						<Image
							src={openImage(item.id, item.created_at)}
							alt="map"
							width={400}
							height={400}
						/>
						{item.name} - {item.area.toString()}
					</li>
				))}
			</ul>
		</>
	);
}
