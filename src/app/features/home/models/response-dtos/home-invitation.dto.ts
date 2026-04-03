import { Data } from "@angular/router";

export interface HomeInvitationDTO {
    invitationId: string;

    homeId: string;
    homeName: string;

    ownerName: string;
    ownerEmail: string;

    invitationDate: Data;
    invitaionState: number;
}