import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import {
	Box,
	Button,
	Container,
	Input,
	Modal,
	TextField,
	Typography,
} from "@mui/material";
import { ICreatePolygon, IPolygon } from "@/app/models";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { MapMouseEvent, Map as MapboxMap } from "mapbox-gl";
import { mapBoxStyles } from "./PolygonListStyles";
import { useUser } from "@/app/contexts/UserContext";

const accessToken =
	"pk.eyJ1Ijoiem9ra3kyZSIsImEiOiJjbTAxMThhMTYxbHBmMnJzYjR1eGxmZHBoIn0.wzqyHNfMopK1YzvpNIWUIg";
const Map = ReactMapboxGl({
	accessToken,
});
const mapStyle = {
	width: "100%",
	height: "500px",
	maxWidth: "800px",
	margin: "0 auto",
};

const style = "mapbox://styles/mapbox/satellite-v9";

const popupStyle = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

interface CreatePolygonProps {
	center: number[];
	showAddButton: boolean;
	onAddSuccess: () => void;
	onCenterChanged: (center?: number[]) => void;
}

const defaultCreatePolygonProps: CreatePolygonProps = {
	center: [0, 0],
	showAddButton: false,
	onAddSuccess: () => {},
	onCenterChanged: () => {},
};

export default function NewPolygon(
	props: CreatePolygonProps = defaultCreatePolygonProps
) {
	const [oldPolygons, setOldPolygons] = useState<IPolygon[]>([]);
	const [open, setOpen] = useState(false);
	const [newPolygons, setNewPolygons] = useState<IPolygon[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [currentNewPolygon, setCurrentNewPolygon] = useState<IPolygon>({
		name: "",
	});

	useEffect(() => {
		fetchPolygons();
	}, [newPolygons]);

	const fetchPolygons = async () => {
		try {
			const response: AxiosResponse<IPolygon[]> = await axios.get(
				`http://localhost:3000/api/polygon`
			);

			const processedData = response.data.map((polygon) => {
				if (
					polygon.created_at &&
					Number(polygon.created_at) < 1000000000000
				) {
					return {
						...polygon,
						created_at: Number(polygon.created_at) * 1000,
					};
				}
				return polygon;
			});

			setOldPolygons(processedData);
		} catch (error) {
			const axiosError = error as AxiosError;
			setError(axiosError.message);
		}
	};
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	function onDrawCreate(event: ICreatePolygon) {
		const newPolygon: IPolygon = {
			name: event.name,
			geo_json: {
				type: "Feature",
				properties: {},
				geometry: event.features[0].geometry,
			},
		};
		newPolygon.name = "";
		setCurrentNewPolygon(newPolygon);
		handleOpen();
	}

	const createNewPolygon = () => {
		console.log(currentNewPolygon);
		setNewPolygons((prevPolygons) => [...prevPolygons, currentNewPolygon]);
		handleClose();
	};

	const addNewPolygons = async () => {
		if (newPolygons.length <= 0) {
			return;
		}
		await axios
			.post(`http://localhost:3000/api/polygon`, newPolygons, {
				withCredentials: true,
			})
			.then(() => {
				props.onAddSuccess();
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const handleLayerClick = (center?: number[]) => {
		console.log(center);
		if (center && center.length == 2) {
			props.onCenterChanged(center);
		}
	};

	return (
		<Container sx={mapBoxStyles}>
			{error && <Typography color="error">{error}</Typography>}
			<Map
				style={style}
				containerStyle={mapStyle}
				zoom={[13]}
				center={[props.center[0], props.center[1]]}
			>
				<>
					<DrawControl
						displayControlsDefault={false}
						position="top-left"
						controls={{
							polygon: true,
							trash: true,
						}}
						onDrawCreate={onDrawCreate}
					/>
					{oldPolygons.map((polygon, index) => {
						const isSelected =
							JSON.stringify(polygon.center) ===
							JSON.stringify(props.center);
						return (
							<GeoJSONLayer
								key={index}
								fillPaint={{
									"fill-color": isSelected
										? "rgba(204, 255, 0, 0.3)"
										: "rgba(128, 0, 128, 0.3)",
									"fill-outline-color": "#000",
								}}
								data={{
									type: "FeatureCollection",
									features: [polygon.geo_json],
								}}
								onClick={() => handleLayerClick(polygon.center)}
							/>
						);
					})}
				</>
			</Map>
			{props.showAddButton && (
				<Button
					sx={{
						marginTop: "16px",
						alignSelf: "flex-end",
					}}
					variant="contained"
					onClick={() => {
						addNewPolygons();
					}}
				>
					Add New fields
				</Button>
			)}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={popupStyle}>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Polygon name
					</Typography>
					<Box
						id="modal-modal-description"
						sx={{
							mt: 2,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<TextField
							required
							id="outlined-required"
							label="Required"
							value={currentNewPolygon.name}
							onChange={(
								event: React.ChangeEvent<HTMLInputElement>
							) => {
								setCurrentNewPolygon((prevPolygon) => ({
									...prevPolygon,
									name: event.target.value,
								}));
							}}
						/>
						<Button variant="contained" onClick={createNewPolygon}>
							Add
						</Button>
					</Box>
				</Box>
			</Modal>
		</Container>
	);
}
