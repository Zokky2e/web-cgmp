export interface IPolygon {
	id: String;
	name: String;
	area: Number;
	center: number[];
	geometry: IGeometry;
	created_at: Number;
}

export interface IGeometry {
	coordinates?: number[][];
}
