"use client"; // Mark this component as a Client Component

import { MutableRefObject, useEffect, useRef, useState } from "react";
import axios from "axios";
import { IPolygon } from "@/app/models";
import { Button, CircularProgress, Typography } from "@mui/material";
import _ from "underscore";
import ReactMapboxGl, { Layer, GeoJSONLayer } from "react-mapbox-gl";
import { green } from "@mui/material/colors";
import { FillLayerSpecification } from "mapbox-gl";
import CreatePolygon from "./NewPolygon";
const accessToken =
	"pk.eyJ1Ijoiem9ra3kyZSIsImEiOiJjbTAxMThhMTYxbHBmMnJzYjR1eGxmZHBoIn0.wzqyHNfMopK1YzvpNIWUIg";
const Map = ReactMapboxGl({
	accessToken,
});
const mapStyle = {
	width: "600px",
	height: "600px",
};

const style = "mapbox://styles/mapbox/satellite-v9";
export default function UserList() {
	const [data, setData] = useState<IPolygon[]>([]);
	const [imageUrl, setImageUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [center, setCenter] = useState<number[]>([0, 0]);
	function openImage(id: String, created_at: Number) {
		return `http://localhost:3000/api/polygon/${id}/${created_at}`;
	}
	useEffect(() => {
		fetchPolygons();
	}, []);

	function fetchPolygons() {
		axios
			.get(`http://localhost:3000/api/polygon`)
			.then((response) => {
				const data: IPolygon[] = response.data;
				console.log(data[0]);
				setCenter(data[0].center ? data[0].center : [0, 0]);
				setData(data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}

	return (
		<>
			{loading && <CircularProgress />}
			{error && <Typography color="error">{error}</Typography>}
			<ul>
				<CreatePolygon
					center={center}
					oldPolygons={data}
					onAddSuccess={() => {
						fetchPolygons();
					}}
				/>
				{data.map((item, index) => (
					<li key={index}>
						{item.center &&
						item.geo_json &&
						item.geo_json.geometry.coordinates ? (
							<Map
								center={[item.center[0], item.center[1]]}
								style={style}
								zoom={[13]}
								containerStyle={mapStyle}
							>
								<GeoJSONLayer
									fillPaint={{
										"fill-color": "rgba(128, 0, 128, 0.3)",
										"fill-outline-width": "2px",
										"fill-outline-color": "#000",
									}}
									data={{
										type: "FeatureCollection",
										features: [item.geo_json],
									}}
								/>
							</Map>
						) : (
							<></>
						)}
						{/* <Image
							src={openImage(item.id, item.created_at)}
							alt="map"
							width={400}
							height={400}
						/> */}
						{item.name} - {item.area?.toString()}
					</li>
				))}
			</ul>
		</>
	);
}
