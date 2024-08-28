export interface IPolygon {
	id?: String;
	name?: String;
	area?: Number;
	center?: number[];
	geo_json?: {
		geometry: GeoJSON.Polygon;
		type?: string;
		properties?: object;
	};
	created_at?: Number;
}

export interface IFeature {
	geometry: GeoJSON.Polygon;
}

export interface ICreatePolygon {
	features: IFeature[];
	name: string;
}

export interface IRequestedPolygon {
	_id: string;
	polygonId: string;
	userId: string;
	timestamp: string;
	__v: number;
}
