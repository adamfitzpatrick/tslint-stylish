export interface Location {
    line: number;
    character: number;
}

export interface Position extends Location {
    position: number;
}

export interface PalantirPosition {
    position: number;
    location: Location;
}