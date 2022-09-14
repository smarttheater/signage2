import { factory } from '@cinerino/sdk';
import axios from 'axios';
import * as moment from "moment";
import { Functions } from '..';
import { getProject } from './util.function';

export interface TheaterTypes {
    additionalProperty:
    {
        name: string;
        value: string;
    }[];
    branchCode: string;
    name: {
        en: string;
        ja: string;
    };
}

export interface ScreeningRoomTypes {
    additionalProperty:
    {
        name: string;
        value: string;
    }[];
    address: {
        en: string;
        ja: string;
    };
    containedInPlace: {
        branchCode: string;
    };
    branchCode: string;
    name: {
        en: string;
        ja: string;
    };
}

export interface SeatTypes {
    additionalProperty: 
    {
        name: string;
        value: string;
    }[],
    containedInPlace: {
        branchCode: string;
        containedInPlace: {
            branchCode: string;
            containedInPlace: {
                branchCode: string;
            }
        }
    },
    branchCode: string;
    name: {
      en: string;
      ja: string;
    }
}

export interface MovieTypes {
    additionalProperty:
    {
        name: string;
        value: string;
    }[];
    contentRating: string;
    datePublished: string;
    headline: string;
    identifier: string;
    name: {
        en: string;
        ja: string;
    };
}

export interface ScreeningEventTypes {
    additionalProperty:
    {
        name: string;
        value: string;
    }[];
    doorTime: string;
    endDate: string;
    eventStatus: string;
    id: string;
    location: {
        address: {
            en: string;
            ja: string;
        };
        branchCode: string;
        name: {
            en: string;
            ja: string;
        };
    };
    maximumAttendeeCapacity: number;
    name: {
        en: string;
        ja: string;
    };
    offers: {
        validFrom: string;
        validThrough: string;
    };
    startDate: string;
    superEvent: {
        id: string;
        description: {
            en: string;
            ja: string;
        };
        dubLanguage: {
            name: string;
        };
        subtitleLanguage: {
            name: string;
        };
    };
    remainingAttendeeCapacity: number;
    workPerformed: {
        identifier: string;
        headline: string;
        contentRating: string;
        duration: string;
    };
}

export interface ScreeningEventSeriesTypes {
    additionalProperty:
    {
        name: string;
        value: string;
    }[];
    id: string;
    name: {
        en: string;
        ja: string;
    };
    endDate: string;
    startDate: string;
}

export interface ScreeningEventSeatsTypes {
    branchCode: string;
    containedInPlace: {
        branchCode: string;
    };
    offers: {
        availability: string;
    }[];
}

/**
 * 待機
 */
 async function sleep(time: number = 500) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

/**
 * 認証情報取得
 */
export const authorize = async () => {
    const api = {
        accessToken: localStorage.getItem('API_ACCESS_TOKEN'),
        tokenType: localStorage.getItem('API_TOKEN_TYPE'),
        expiryDate: parseInt(localStorage.getItem('API_EXPIRY_DATE') || 'NaN', 10),
        lastUpdate: parseInt(localStorage.getItem('API_LAST_UPDATE') || 'NaN', 10),
    };
    if (api.accessToken && api.tokenType && api.expiryDate !== NaN && api.lastUpdate !== NaN) {
        const expiryDate = api.expiryDate;
        if (moment().unix() <= api.lastUpdate + expiryDate - 300) {
            // 期限が5分以上あるならアクセストークン更新しない
            return;
        }
    }
    const url = '/api/authorize/getCredentailsApi';
    const limit = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            const result = (await axios.post<{
                clientId: string;
                accessToken: string;
                tokenType: string;
                expiryDate: number,
                apiEndpoint: string
            }>(url)).data;
            localStorage.setItem('API_ACCESS_TOKEN', result.accessToken);
            localStorage.setItem('API_TOKEN_TYPE', result.tokenType);
            localStorage.setItem('API_EXPIRY_DATE', String(result.expiryDate));
            localStorage.setItem('API_LAST_UPDATE', String(moment().unix()));
            localStorage.setItem('API_ENDPOINT', result.apiEndpoint);
            return;
        } catch (error) {
            if (error.status !== undefined && error.status >= 500) {
                loop = count < limit;
                count++;
                await sleep(20000);
                continue;
            }
            throw error;
        }
    }
};

/**
 * 施設情報の取得
 */
 export const searchMovieTheaters = async (): Promise<TheaterTypes[]> => {
    let theaters: TheaterTypes[] = [];
    const apiEndpoint = localStorage.getItem('API_ENDPOINT');
    const accessToken = localStorage.getItem('API_ACCESS_TOKEN');
    const tokenType = localStorage.getItem('API_TOKEN_TYPE');
    const project = getProject();
    const limit = 100;
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${apiEndpoint}/projects/${project.projectId}/places/MovieTheater?page=${i}&limit=${limit}`;
                const result = (await axios.get<TheaterTypes[]>(url, { headers: { Authorization: `${tokenType} ${accessToken}` } })).data;
                theaters = [...theaters, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return theaters;
};

export const convertMovieTheaters = (
    movieTheaters: TheaterTypes[]
): factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom[] => {
    const projectId = Functions.Util.getProject().projectId;
    const result: factory.chevre.place.movieTheater.IPlaceWithoutScreeningRoom[] = [];
    movieTheaters.forEach((data) => {
        result.push({
            id: `id${data.branchCode}`,
            typeOf: factory.chevre.placeType.MovieTheater,
            branchCode: data.branchCode,
            name: data.name,
            screenCount: NaN,
            kanaName: data.name.ja,
            telephone: '',
            project: {
                id: projectId,
                typeOf: factory.chevre.organizationType.Project,
            },
        });
    });
    return result;
}

/**
 * ルーム情報の取得
 */
 export const searchScreeningRooms = async (): Promise<ScreeningRoomTypes[]> => {
    let screeningRooms: ScreeningRoomTypes[] = [];
    const apiEndpoint = localStorage.getItem('API_ENDPOINT');
    const accessToken = localStorage.getItem('API_ACCESS_TOKEN');
    const tokenType = localStorage.getItem('API_TOKEN_TYPE');
    const project = getProject();
    const limit = 100;
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${apiEndpoint}/projects/${project.projectId}/places/ScreeningRoom?page=${i}&limit=${limit}`;
                const result = (await axios.get<ScreeningRoomTypes[]>(
                    url, { headers: { Authorization: `${tokenType} ${accessToken}` } })
                ).data;
                screeningRooms = [...screeningRooms, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return screeningRooms;
};

export const convertScreeningRooms = (
    screeningRooms: Functions.SmartTheaterApi.ScreeningRoomTypes[],
    branchCode?: string,
    containedInPlaceBranchCode?: string,
):factory.chevre.place.screeningRoom.IPlace[] => {
    const projectId = Functions.Util.getProject().projectId;
    const result: factory.chevre.place.screeningRoom.IPlace[] = []
    screeningRooms.forEach((data) => {
        if (
            !data.branchCode ||
            data.branchCode === branchCode &&
            !data.containedInPlace.branchCode ||
            data.containedInPlace.branchCode === containedInPlaceBranchCode
        ) {
            result.push({
                typeOf: factory.chevre.placeType.ScreeningRoom,
                branchCode: data.branchCode,
                name: data.name,
                containsPlace: [{
                    typeOf: factory.chevre.placeType.ScreeningRoomSection,
                    containsPlace: [],
                    branchCode: data.containedInPlace.branchCode,
                    project: {
                        id: projectId,
                        typeOf: factory.chevre.organizationType.Project,
                    },
                }],
                project: {
                    id: projectId,
                    typeOf: factory.chevre.organizationType.Project,
                },
            });
        }
    });
    return result;
}

/**
 * 座席情報の取得
 */
 export const searchSeats = async ({
    screeningRoomBranchCode,
    movieTheaterBranchCode
}: {
    screeningRoomBranchCode: string;
    movieTheaterBranchCode: string;
}): Promise<SeatTypes[]> => {
    let seats: SeatTypes[] = [];
    const apiEndpoint = localStorage.getItem('API_ENDPOINT');
    const accessToken = localStorage.getItem('API_ACCESS_TOKEN');
    const tokenType = localStorage.getItem('API_TOKEN_TYPE');
    const project = getProject();
    const limit = 100;
    let form = screeningRoomBranchCode ? `&screeningRoomBranchCode=${screeningRoomBranchCode}` : '';
    form += movieTheaterBranchCode ? `&movieTheaterBranchCode=${movieTheaterBranchCode}` : '';
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${apiEndpoint}/projects/${project.projectId}/places/Seat?page=${i}&limit=${limit}${form}`;
                const result = (await axios.get<SeatTypes[]>(
                    url, { headers: { Authorization: `${tokenType} ${accessToken}` } })
                ).data;
                seats = [...seats, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return seats;
};

/**
 * スマシから取得した座席情報を画面に合わせて変換
 */
export const convertSeats = (seats: SeatTypes[]) => {
    let maxY = 0
    let maxX = 0;
    seats.forEach((seat) => {
        const data = seat.branchCode.split('-');
        maxY = maxY < data[0].slice(-1).charCodeAt(0) - 65? data[0].slice(-1).charCodeAt(0) - 65: maxY;
        maxX = maxX < parseInt(data[1], 10) - 1? parseInt(data[1], 10) - 1: maxX;
    });
    let map: number[][] = [];
    for(let i = 0; i <= maxY; i+= 1) {
        map[i] = [];
        for(let j = 0; j <= maxX; j+=1) {
            map[i][j] = 0;
        }
    }
    seats.forEach((seat) => {
        const data = seat.branchCode.split('-');
        map[data[0].slice(-1).charCodeAt(0) - 65][parseInt(data[1], 10) - 1] = 1;
    });
    return { map };
}

/**
 * コンテンツ情報の取得
 */
 export const searchMovies = async ({
    datePublishedFrom,
    datePublishedThrough,
    identifierEq,
    offersAvailableFrom,
}: {
    datePublishedFrom?: string;
    datePublishedThrough?: string;
    identifierEq?: string;
    offersAvailableFrom?: string;
}): Promise<MovieTypes[]> => {
    let movies: MovieTypes[] = [];
    const apiEndpoint = localStorage.getItem('API_ENDPOINT');
    const accessToken = localStorage.getItem('API_ACCESS_TOKEN');
    const tokenType = localStorage.getItem('API_TOKEN_TYPE');
    const project = getProject();
    const limit = 100;
    let form = datePublishedFrom ? `&datePublishedFrom=${datePublishedFrom}` : '';
    form += datePublishedThrough ? `&datePublishedThrough=${datePublishedThrough}` : '';
    form += identifierEq ? `&identifierEq=${identifierEq}` : '';
    form += offersAvailableFrom ? `&offersAvailableFrom=${offersAvailableFrom}` : '';
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${apiEndpoint}/projects/${project.projectId}/creativeWorks/movie?page=${i}&limit=${limit}${form}`;
                const result = (await axios.get<MovieTypes[]>(url, { headers: { Authorization: `${tokenType} ${accessToken}` } })).data;
                movies = [...movies, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return movies;
};

export const convertSearchMovies = (
    searchMovies: Functions.SmartTheaterApi.MovieTypes[]
): factory.chevre.creativeWork.movie.ICreativeWork[] => {
    const projectId = Functions.Util.getProject().projectId;
    const result: factory.chevre.creativeWork.movie.ICreativeWork[] = [];
    searchMovies.forEach((data) => {
        result.push({
            identifier: data.identifier,
            datePublished: data.datePublished as unknown as Date,
            name: data.name,
            typeOf: factory.chevre.creativeWorkType.Movie,
            project: {
                id: projectId,
                typeOf: factory.chevre.organizationType.Project,
            },
            offers: {
                project: {
                    id: projectId,
                    typeOf: factory.chevre.organizationType.Project,
                },
                typeOf: factory.chevre.offerType.Offer,
                priceCurrency: factory.chevre.priceCurrency.JPY,
            }
        });
    });
    return result; 
}

/**
 * 施設コンテンツ検索の取得
 */
 export const searchScreeningEventSeries = async ({
    locationBranchCode,
    workPerformedIdentifier,
    startFrom,
    startThrough,
    endFrom,
    endThrough,
}: {
    locationBranchCode?: string;
    workPerformedIdentifier?: string;
    startFrom?: string;
    startThrough?: string;
    endFrom?: string;
    endThrough?: string;
}): Promise<ScreeningEventSeriesTypes[]> => {
    let screeningEvents: ScreeningEventSeriesTypes[] = [];
    const apiEndpoint = localStorage.getItem('API_ENDPOINT');
    const accessToken = localStorage.getItem('API_ACCESS_TOKEN');
    const tokenType = localStorage.getItem('API_TOKEN_TYPE');
    const project = getProject();
    const limit = 100;
    let form = locationBranchCode ? `&locationBranchCode=${locationBranchCode}` : '';
    form += workPerformedIdentifier ? `&workPerformedIdentifier=${workPerformedIdentifier}` : '';
    form += startFrom ? `&startFrom=${startFrom}` : '';
    form += startThrough ? `&startThrough=${startThrough}` : '';
    form += endFrom ? `&endFrom=${endFrom}` : '';
    form += endThrough ? `&endThrough=${endThrough}` : '';
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${apiEndpoint}/projects/${project.projectId}/events/ScreeningEventSeries?page=${i}&limit=${limit}${form}`;
                const result = (await axios.get<ScreeningEventSeriesTypes[]>(
                    url, { headers: { Authorization: `${tokenType} ${accessToken}` } })
                ).data;
                screeningEvents = [...screeningEvents, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return screeningEvents;
};

export const convertScreeningEventSeries = (
    screeningEventSeries: Functions.SmartTheaterApi.ScreeningEventSeriesTypes[]
): factory.chevre.event.screeningEventSeries.IEvent[]  => {
    const projectId = Functions.Util.getProject().projectId;
    const result: factory.chevre.event.screeningEventSeries.IEvent[] = [];
    screeningEventSeries.forEach((data) => {
        result.push({
            videoFormat: [],
            soundFormat: [],
            workPerformed: {
                project: {
                    id: projectId,
                    typeOf: factory.chevre.organizationType.Project,
                },
                identifier: '',
                typeOf: factory.chevre.creativeWorkType.Movie,
            },
            project: {
                id: projectId,
                typeOf: factory.chevre.organizationType.Project,
            },
            location: {
                project: {
                    id: projectId,
                    typeOf: factory.chevre.organizationType.Project,
                },
                typeOf: factory.chevre.placeType.MovieTheater,
                id: '',
                branchCode: '',
            },
            kanaName: data.name.ja,
            name: data.name,
            typeOf: factory.chevre.eventType.ScreeningEventSeries,
            eventStatus: factory.chevre.eventStatusType.EventScheduled,
            id: data.id,
            startDate: data.startDate  as unknown as Date,
            endDate: data.endDate as unknown as Date,
        });
    });
    return result;
}

/**
 * イベント検索の取得
 */
export const searchScreeningEvent = async ({
    startFrom,
    startThrough,
    superEventLocationBranchCode,
    superEventWorkPerformedIdentifier,
}: {
    startFrom?: string;
    startThrough?: string;
    superEventLocationBranchCode?: string;
    superEventWorkPerformedIdentifier?: string;
}): Promise<ScreeningEventTypes[]> => {
    let screeningEvents: ScreeningEventTypes[] = [];
    const apiEndpoint = localStorage.getItem('API_ENDPOINT');
    const accessToken = localStorage.getItem('API_ACCESS_TOKEN');
    const tokenType = localStorage.getItem('API_TOKEN_TYPE');
    const project = getProject();
    const limit = 100;
    let form = startFrom ? `&startFrom=${startFrom}` : '';
    form += startThrough ? `&startThrough=${startThrough}` : '';
    form += superEventLocationBranchCode ? `&superEventLocationBranchCode=${superEventLocationBranchCode}` : '';
    form += superEventWorkPerformedIdentifier ? `&superEventWorkPerformedIdentifier=${superEventWorkPerformedIdentifier}` : '';
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${apiEndpoint}/projects/${project.projectId}/events/ScreeningEvent?page=${i}&limit=${limit}${form}`;
                const result = (await axios.get<ScreeningEventTypes[]>(
                    url, { headers: { Authorization: `${tokenType} ${accessToken}` } })
                ).data;
                screeningEvents = [...screeningEvents, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return screeningEvents;
};

export const convertSearchScreeningEvent = (
    ScreeningEvent: Functions.SmartTheaterApi.ScreeningEventTypes[]
): factory.chevre.event.screeningEvent.IEvent[] => {
    const projectId = Functions.Util.getProject().projectId;
    const result: factory.chevre.event.screeningEvent.IEvent[] = [];
    ScreeningEvent.forEach((data) => {
        result.push({
            name: data.name,
            location: {
                project: {
                    id: projectId,
                    typeOf: factory.chevre.organizationType.Project,
                },
                typeOf: factory.chevre.placeType.ScreeningRoom,
                branchCode: data.location.branchCode,
                name: data.location.name,
            },
            startDate: data.startDate as unknown as Date,
            endDate: data.endDate as unknown as Date,
            project: {
                id: projectId,
                typeOf: factory.chevre.organizationType.Project,
            },
            typeOf: factory.chevre.eventType.ScreeningEvent,
            superEvent: {
                id: data.superEvent.id,
                videoFormat: [],
                soundFormat: [],
                name: data.name,
                kanaName: '',
                project: {
                    id: projectId,
                    typeOf: factory.chevre.organizationType.Project,
                },
                workPerformed: {
                    project: {
                        id: projectId,
                        typeOf: factory.chevre.organizationType.Project,
                    },
                    identifier: data.workPerformed.identifier,
                    typeOf: factory.chevre.creativeWorkType.Movie,
                },
                location: {
                    project: {
                        id: projectId,
                        typeOf: factory.chevre.organizationType.Project,
                    },
                    typeOf: factory.chevre.placeType.MovieTheater,
                    id: '',
                    branchCode: '',
                },
                typeOf: factory.chevre.eventType.ScreeningEventSeries,
                eventStatus: factory.chevre.eventStatusType.EventScheduled,
            },
            eventStatus: factory.chevre.eventStatusType.EventScheduled,
            id: data.id,
            remainingAttendeeCapacity: data.remainingAttendeeCapacity,
            maximumAttendeeCapacity: data.maximumAttendeeCapacity,
            workPerformed: {
                project: {
                    id: projectId,
                    typeOf: factory.chevre.organizationType.Project,
                },
                id: '',
                identifier: data.workPerformed.identifier,
                typeOf: factory.chevre.creativeWorkType.Movie,
                duration: data.workPerformed.duration,
                contentRating: data.workPerformed.contentRating,
            },
            offers: {
                validFrom: data.offers.validFrom as unknown as Date,
                validThrough: data.offers.validThrough as unknown as Date,
                availabilityEnds: new Date(),
                availabilityStarts: new Date(),
                project: {
                    id: projectId,
                    typeOf: factory.chevre.organizationType.Project,
                },
                eligibleQuantity: {
                    typeOf: 'QuantitativeValue',
                },
                itemOffered: {
                    serviceOutput: {
                        reservedTicket: {
                            ticketedSeat: {
                                typeOf: factory.chevre.placeType.Seat,
                            },
                            typeOf: 'Ticket',
                        },
                        typeOf: factory.chevre.reservationType.EventReservation,
                    }
                },
                typeOf: factory.chevre.offerType.Offer,
                priceCurrency: factory.chevre.priceCurrency.JPY,
            }
        });
    });
    return result;
}

/**
 * 空席情報検索の取得
 */
 export const searchScreeningEventSeats = async ({
    eventId,
}: {
    startFrom?: string;
    startThrough?: string;
    eventId?: string;
}): Promise<ScreeningEventSeatsTypes[]> => {
    let screeningEventSeats: ScreeningEventSeatsTypes[] = [];
    const apiEndpoint = localStorage.getItem('API_ENDPOINT');
    const accessToken = localStorage.getItem('API_ACCESS_TOKEN');
    const tokenType = localStorage.getItem('API_TOKEN_TYPE');
    const project = getProject();
    const limit = 100;
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${apiEndpoint}/projects/${project.projectId}/events/ScreeningEvent/${eventId}/seats?page=${i}&limit=${limit}`;
                const result = (await axios.get<ScreeningEventSeatsTypes[]>(
                    url, { headers: { Authorization: `${tokenType} ${accessToken}` } })
                ).data;
                screeningEventSeats = [...screeningEventSeats, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return screeningEventSeats;
};

export const convertScreeningEventSeats = (
    screeningEvents: Functions.SmartTheaterApi.ScreeningEventSeatsTypes[]
): factory.chevre.place.seat.IPlaceWithOffer[] => {
    const projectId = Functions.Util.getProject().projectId;
    const result: factory.chevre.place.seat.IPlaceWithOffer[] = [];
    screeningEvents.forEach((data) => {
        result.push({
            additionalProperty: [],
            typeOf: factory.chevre.placeType.Seat,
            branchCode: data.branchCode,
            project: {
                id: projectId,
                typeOf: factory.chevre.organizationType.Project,
            },
            offers: data.offers.map((offer) => {
                return {
                    availability: offer.availability as factory.chevre.itemAvailability,
                    priceCurrency: factory.chevre.priceCurrency.JPY,
                    project: {
                        id: projectId,
                        typeOf: factory.chevre.organizationType.Project,
                    },
                    typeOf: factory.chevre.offerType.Offer,
                }
            }),
        });
    });
    return result;
}