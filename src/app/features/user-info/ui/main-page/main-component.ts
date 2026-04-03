import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnInit,
	signal,
	Signal,
} from '@angular/core';
import { MainNavbarComponent } from '../main-navbar/main-navbar-component';
import { UserInfoFacadeService } from '../../application/user-info-facade-service';
import { UserHomeDTO } from '../../models/user-home.dto';
import { HomeCardComponent } from '../../../home/ui/home-card-component/home-card-component';
import { HomeFacadeService } from '../../../home/application/home-facade-service';
import { HomeCardDTO, SearchResultDTO } from '../../../home/models/response-dtos/home-card.dto';
import as from '@angular/common/locales/as';
import { LocationModel } from '../../../../core/location/location-model';
import { LocationService } from '../../../../core/location/locationService/location-service';
import { LocationHolderService } from '../../../../core/location/locationHolderService/location-holder-service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { T } from '@angular/cdk/keycodes';

@Component({
	selector: 'app-main-component',
	imports: [MainNavbarComponent, HomeCardComponent, MatPaginatorModule],
	templateUrl: './main-component.html',
	styleUrl: './main-component.css',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
	//#region: constructor
	constructor(
		private userInfoFacade: UserInfoFacadeService,
		private homeFacade: HomeFacadeService,
		private locationService: LocationService,
		private locationHolder: LocationHolderService,
		private cdr: ChangeDetectorRef
	) { }
	//#endregion

	currentLocation: LocationModel | null = null;
	ngOnInit(): void {
		this.locationService.getCurrentLocation().then((location) => {
			this.currentLocation = location;
			this.locationHolder.setLocation(location);
			console.log('MainComponent: constructor: Current Location:', this.currentLocation);
		});
		this.getInitialData();
	}

	//#region: pagination method
	length = 100; // the total number of homes (for pagination)
	pageSize = 5; // the number of homes to display per page
	pageIndex = 0; // the current page index
	pageSizeOptions = [5, 10, 25]; // the page size options
	showPageSizeOptions = true; // true => show page size options, false => don't show page size options
	showFirstLastButtons = true; // true => show first and last buttons, false => don't show first and last buttons
	disabled = false; // true => disable pagination, false => enable pagination
	newSearch = signal<boolean>(false); // true => new search, false => old search
	HomeSource!: HomeCardDTO[] | UserHomeDTO[]; // the homes holder  list
	displaySource!: HomeCardDTO[] | UserHomeDTO[]; // the homes to display
	loadedPages = new Set<number>(); // the pages that have been loaded

	handlePageEvent(event: PageEvent) {
		let prevPageSize = this.pageSize;
		// 1- update the page index and page size
		this.pageSize = event.pageSize;
		this.pageIndex = event.pageIndex;
		const listSize = this.pageSize * this.pageIndex;
		const prevListSize = (event.previousPageIndex ?? 0) * this.pageSize;

		if (prevPageSize != this.pageSize) {
			this.loadedPages.clear(); ///// need to be modified
		}

		if (this.isSearching()) {
			if ((this.searchHomes.length < this.pageSize) || (listSize > prevListSize) || (prevListSize > this.searchHomes.length)) {
				if (this.loadedPages.has(this.pageIndex)) {
					this.updateDisplayHomes(this.pageIndex, this.pageSize);
					// debug
					console.log('MainComponent: handlePageEvent: Page already loaded:', this.pageIndex);
					return;
				}
				this.loadedPages.add(this.pageIndex);
				this.searchForHomes(this.searchingWord());
				return;
			}
		}

		this.updateDisplayHomes(this.pageIndex, this.pageSize);
	}

	private updateDisplayHomes(pageIndex: number, pageSize: number) {
		const startIndex = pageIndex * pageSize;
		const endIndex = startIndex + pageSize;

		this.displaySource = this.HomeSource.slice(startIndex, endIndex);
		this.cdr.detectChanges();
	}
	//#endregion

	//#region: main data collection method
	userName!: string; // the user name
	userImage!: string; // the user image
	userEmail!: string; // the user email
	userHomes: UserHomeDTO[] = []; // the user homes

	getInitialData() {
		this.userInfoFacade.getUserData();
		this.userInfoFacade.userData$.subscribe((data) => {
			this.userName = data?.name!;
			this.userImage = data?.userImageUrl!;
			this.userEmail = data?.email!;
			if (this.userImage || this.userImage) {
				console.log('MainComponent: constructor: User Name:', this.userName);
				console.log(
					'MainComponent: constructor: User Image URL:',
					this.userImage
				);
				this.cdr.detectChanges();
			}
		});
		this.userInfoFacade.userHomes$.subscribe((data) => {
			this.userHomes = data ?? [];
			if (this.userHomes) {
				this.length = this.userHomes.length;
				this.HomeSource = this.userHomes;
				this.updateDisplayHomes(this.pageIndex, this.pageSize);
				this.cdr.detectChanges();
				console.log('MainComponent: constructor: User Homes:', this.userHomes);
			}
		});

	}
	//#endregion

	//#region: search method
	searchLocallyOption: boolean = true; // true => local search, false => global search
	isLoadMore = signal<boolean>(true); // true => load more, false => don't load more
	searchingWord = signal<string>(''); // the search term
	isLoading = signal<boolean>(false); // true => loading process is running, false => no loading process is running
	isSearching = signal<boolean>(false); // true => searching Mode is Active, false => searching Mode is Inactive
	searchHomes: HomeCardDTO[] = []; // the search results

	searchLocally(searchOption: boolean) {
		this.searchLocallyOption = searchOption;
	}

	searchForHomes(searchTerm: string) {
		// 1- check if the search term is empty
		if (!searchTerm) {
			this.searchHomes = []; // clear the search results
			this.HomeSource = this.userHomes;
			this.isSearching.set(false);
			this.cdr.detectChanges();
			return;
		}
		// 1- Enable searching mode
		this.isSearching.set(true);

		// 2- check if this is a new searching process
		if (this.searchingWord() !== searchTerm) {
			// 2-1:- Enable searching for new term
			this.newSearch.set(true);
		}

		// 3- check the searching mechanism
		if (this.searchLocallyOption) {
			this.localSearch(searchTerm);
		} else {
			this.globalSearch(searchTerm);
		}

		// 4- save the search term
		this.searchingWord.set(searchTerm);
	}

	localSearch(searchingWord: string) {
		// 1- check if this is a new searching process
		if (this.newSearch()) {
			// 1-1:- reset the page index
			this.pageIndex = 0;
			// 1-2:- filter the user homes
			this.HomeSource = this.userHomes.filter((home) =>
				home.homeName.toLowerCase().includes(searchingWord.toLowerCase())
			);
			// 1-3:- update the length
			this.length = this.HomeSource.length;

			// 1-4:- reset the new search
			this.newSearch.set(false);
		}

		// 2- update the display homes
		this.updateDisplayHomes(this.pageIndex, this.pageSize);

		// debug:- represent the local search result
		console.log('MainComponent: searchForHomes: Search Homes (local):', this.HomeSource);
		// Finaly:- Refresh the DOM
		this.cdr.detectChanges();
	}

	globalSearch(searchingWord: string) {
		// 1- check if the is a searching process is running
		if (this.isLoading())
			return;

		// 2- if the search term is not new and load more is disabled, then return
		if (!this.newSearch() && (this.isLoadMore() || this.searchHomes.length >= this.length)) {
			this.updateDisplayHomes(this.pageIndex, this.pageSize);
			this.cdr.detectChanges();
			return;
		}

		// 3- if the search term is new, then reset the page index
		if (this.newSearch()) {
			this.pageIndex = 0;
			this.isLoadMore.set(true);
		}

		// 4- set the loading state
		this.isLoading.set(true);

		// 5- call the search method
		this.homeFacade.searchForHomes(searchingWord, this.pageIndex + 1, this.pageSize, this.currentLocation?.lng ?? null, this.currentLocation?.lat ?? null)
			.subscribe({
				next: (response: SearchResultDTO | null) => {
					// 5-1:- represent the result
					console.log('MainComponent: globalSearch: Search result:', response);

					// 5-2:- check if the result is valid
					if (response && response.homes?.length > 0) {

						// 5-2-1:- if new search, update the length
						if (this.pageIndex > 0) {
							// 5-2-1-1:- if load more, add the new homes to the search homes
							this.searchHomes = [...this.searchHomes, ...response.homes];
						} else {
							// 5-2-1-2:- if new search, reset the new search state
							this.searchHomes = response.homes;
							this.newSearch.set(false);
						}

						// 5-2-2:- check if the load more process is still available
						this.isLoadMore.set(this.searchHomes.length > response?.searchTotalCount);

					} else {
						this.isLoadMore.set(false);
					}

					// 5-3:- reset the loading state
					this.isLoading.set(false);

					// 5-4:- update the length
					this.length = response?.searchTotalCount ?? 0;

					// 5-5:- update the display homes, page index, and the DOM
					this.HomeSource = this.searchHomes;
					// for debug
					console.log('MainComponent: globalSearch: Home Source:', this.HomeSource);
					console.log('MainComponent: globalSearch: Home Source size:', this.HomeSource.length);
					console.log('MainComponent: globalSearch: Home Search size:', this.searchHomes.length);
					console.log('MainComponent: globalSearch: length is :', this.length);

					this.updateDisplayHomes(this.pageIndex, this.pageSize);
					this.cdr.detectChanges();
				},
				error: (error) => {
					console.error('MainComponent: globalSearch: Error:', error);
					this.isLoadMore.set(false);
					this.isLoading.set(false);
					this.newSearch.set(false);
					this.cdr.detectChanges();
				}
			})
	}

	//#endregion

	//#region checking methods
	isOwner(home: HomeCardDTO | UserHomeDTO): boolean {
		if ("isOwner" in home) {
			return (home as UserHomeDTO).isOwner;
		}
		return (home as HomeCardDTO).ownerEmail === this.userEmail;
	}

	isUserIn(home: HomeCardDTO | UserHomeDTO): boolean {
		if ("isOwner" in home) {
			return true;
		}
		return !!this.userHomes.some((userHome) => userHome.homeId === home.homeId);
	}
	//#endregion
}
