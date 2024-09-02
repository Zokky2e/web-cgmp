import { IPolygon, IUser } from "@/app/models";
import {
	Box,
	Typography,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
	Container,
} from "@mui/material";
import axios from "axios";
import {
	gridContainerStyles,
	mapBoxStyles,
	requestedPolygonInfo,
} from "./PolygonListStyles";

interface RequestedPolygonInfoProps {
	polygon: IPolygon | null;
	users: IUser[];
	refreshList: () => void;
}

export default function RequestedPolygonInfo(props: RequestedPolygonInfoProps) {
	const { polygon, users } = props;

	const handleAccept = async (userId: string) => {
		try {
			// Accept the request for the selected user and polygon
			await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/polygon/accept/${polygon?.id}`,
				{ userId },
				{ withCredentials: true }
			);

			props.refreshList();
		} catch (error) {
			console.error("Error accepting request:", error);
		}
	};

	const handleDeny = async (userId: string) => {
		try {
			// Deny the request for the selected user
			await axios.delete(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/polygon/requested/${polygon?.id}/${userId}`,
				{ withCredentials: true }
			);
			props.refreshList();
		} catch (error) {
			console.error("Error denying request:", error);
		}
	};
	return (
		<Container sx={requestedPolygonInfo}>
			<Typography variant="h6" component="h2">
				Requested Plot: {polygon?.name}
			</Typography>
			{users.length > 0 ? (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Firstname</TableCell>
								<TableCell>Lastname</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user._id}>
									<TableCell>{`${user.firstName}`}</TableCell>
									<TableCell>{`${user.lastName}`}</TableCell>
									<TableCell>
										<Button
											variant="contained"
											color="primary"
											onClick={() =>
												handleAccept(user._id)
											}
										>
											Accept
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleDeny(user._id)}
											sx={{ ml: 1 }}
										>
											Deny
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<Typography>
					No users have requested this polygon yet.
				</Typography>
			)}
		</Container>
	);
}
