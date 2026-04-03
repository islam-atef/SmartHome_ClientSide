export interface SearchResultDTO {
    searchTotalCount: number;
    homes: HomeCardDTO[];
}

export class HomeCardDTO {
    homeId: string = '';

    homeName: string = '';
    homeInfo: string = '';

    ownerName: string = '';
    ownerEmail: string = '';

    longitude: number = 0;
    latitude: number = 0;

    country: string = '';
    state: string = '';
    address: string = '';

    objectType: string = 'HomeCardDTO';
}
