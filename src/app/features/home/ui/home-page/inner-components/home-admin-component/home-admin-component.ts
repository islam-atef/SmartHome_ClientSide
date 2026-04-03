import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { HomeFacadeService } from '../../../../application/home-facade-service';
import { HomeSubscriptionDTO } from '../../../../models/response-dtos/home-subscription.dto';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { HomeSubscriptionRequestDTO } from '../../../../models/request-dtos/home-subscription.dto';
import { HomeInvitationDTO } from '../../../../models/response-dtos/home-invitation.dto';
import { HomeInvitationRequestDTO } from '../../../../models/request-dtos/home-invitation.dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CdkTreeModule } from '@angular/cdk/tree';


interface DataNode {
  name: string;
  action?: Function;
  dataHolder?: any;
  children?: DataNode[];
}

@Component({
  selector: 'app-home-admin-component',
  imports: [MatIconModule, MatButtonModule, MatTreeModule, CdkTreeModule, CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './home-admin-component.html',
  styleUrl: './home-admin-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeAdminComponent implements OnChanges {
  constructor(private homeFacade: HomeFacadeService, private cd: ChangeDetectorRef) { }


  @Input() homeId: string = '';
  @Input() subscriptionNotification: boolean = false;
  @Input() invitationNotification: boolean = false;
  @Output() adminNotification: EventEmitter<boolean> = new EventEmitter<boolean>();


  //#region subscription notification holders
  private pendingSubscriptionNotification: boolean = false;
  private rejectedSubscriptionNotification: boolean = false;
  private acceptedSubscriptionNotification: boolean = false;
  //#endregion

  //#region invitation notification holders
  private pendingInvitationNotification: boolean = false;
  private rejectedInvitationNotification: boolean = false;
  private acceptedInvitationNotification: boolean = false;
  //#endregion

  //#region subscription Holders
  private pendingSubscriptionRequest: HomeSubscriptionDTO[] | null = null;
  private rejectedSubscriptionRequest: HomeSubscriptionDTO[] | null = null;
  private acceptedSubscriptionRequest: HomeSubscriptionDTO[] | null = null;
  //#endregion

  //#region invitation Holders
  private pendingHomeInvitation: HomeInvitationDTO[] | null = null;
  private rejectedHomeInvitation: HomeInvitationDTO[] | null = null;
  private acceptedHomeInvitation: HomeInvitationDTO[] | null = null;
  //#endregion


  //#region tree view holders
  dataSource: DataNode[] = [
    {
      name: 'Subscriptions',
      children: [
        { name: 'Pending', action: () => this.GetHomePendingSubscriptionRequest() },
        { name: 'Rejected', action: () => this.GetHomeRejectedSubscriptionRequest() },
        { name: 'Accepted', action: () => this.GetHomeAcceptedSubscriptionRequest() }
      ],
    },
    {
      name: 'Invitations',
      children: [
        { name: 'Pending', action: () => this.GetHomePendingHomeInvitation() },
        { name: 'Rejected', action: () => this.GetHomeRejectedHomeInvitation() },
        { name: 'Accepted', action: () => this.GetHomeAcceptedHomeInvitation() },
      ],
    },
  ];
  childrenAccessor = (node: DataNode) => node.children ?? [];
  hasChild = (_: number, node: DataNode) => !!node.children && node.children.length > 0;
  dataSourceSelection: any[] | null = [];
  dataSourceSelectionKind: string | null = null;
  selectedNodeName: string | null = null;
  //#endregion


  ngOnChanges(): void {
    this.readNotification();
    this.cd.detectChanges();
  }

  handleNodeAction(node: DataNode) {
    if (node.action) {
      this.dataSourceSelection = [];
      this.dataSourceSelectionKind = null;
      this.selectedNodeName = null;
      node.action();
      this.selectedNodeName = node.name;
      console.log(`HomeAdminComponent: handleNodeAction: action: ${node.name}`);
      console.log(`HomeAdminComponent: handleNodeAction: Kind: ${this.dataSourceSelectionKind}`);
      console.log(`HomeAdminComponent: handleNodeAction: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
      this.cd.detectChanges();
    }
  }

  //#region subscription action methods
  acceptSubscription(subscription: HomeSubscriptionDTO) {
    const request: HomeSubscriptionRequestDTO = {
      homeId: this.homeId,
      requestId: subscription.requestId
    };
    this.homeFacade.acceptSubscription(request).subscribe((res) => {
      if (res) {
        this.emitAdminNotification();
        this.pendingSubscriptionNotification = false; // Force refresh
        this.GetHomePendingSubscriptionRequest();
      }
    });
  }

  rejectSubscription(subscription: HomeSubscriptionDTO) {
    const request: HomeSubscriptionRequestDTO = {
      homeId: this.homeId,
      requestId: subscription.requestId
    };
    this.homeFacade.rejectSubscription(request).subscribe((res) => {
      if (res) {
        this.emitAdminNotification();
        this.pendingSubscriptionNotification = false; // Force refresh
        this.GetHomePendingSubscriptionRequest();
      }
    });
  }
  //#endregion

  //#region invitation action methods
  deleteInvitation(invitation: HomeInvitationDTO) {
    const request: HomeInvitationRequestDTO = {
      homeId: this.homeId,
      invitationId: invitation.invitationId
    };
    this.homeFacade.deleteInvitation(request).subscribe((res) => {
      if (res) {
        this.emitAdminNotification();
        this.pendingInvitationNotification = false; // Force refresh
        this.GetHomePendingHomeInvitation();
      }
    });
  }
  //#endregion

  //#region admin management methods
  renameHome(name: string) {
    this.homeFacade.renameHome(this.homeId, name).subscribe((res) => {
      if (res) {
        this.emitAdminNotification();
      }
    });
  }

  deleteHome() {
    // To be implemented
  }

  //#endregion

  //#region subscription Get methods
  private GetHomePendingSubscriptionRequest() {
    if (!this.pendingSubscriptionNotification) {
      this.homeFacade.getHomePendingSubscriptionRequest(this.homeId).subscribe((res) => {
        this.pendingSubscriptionRequest = res;
        console.log(`HomeAdminComponent: GetHomePendingSubscriptionRequest: res:  ${JSON.stringify(res)}`);
        this.dataSourceSelection = res;
        console.log(`HomeAdminComponent: GetHomePendingSubscriptionRequest: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
        this.dataSourceSelectionKind = 'subscription';
        this.pendingSubscriptionNotification = true;
        this.cd.markForCheck();
      });
    } else {
      this.dataSourceSelection = this.pendingSubscriptionRequest;
      this.dataSourceSelectionKind = 'subscription';
      console.log(`HomeAdminComponent: GetHomePendingSubscriptionRequest: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
      this.cd.markForCheck();
    }
  }

  private GetHomeRejectedSubscriptionRequest() {
    if (!this.rejectedSubscriptionNotification) {
      this.homeFacade.getHomeRejectedSubscriptionRequest(this.homeId).subscribe((res) => {
        this.rejectedSubscriptionRequest = res;
        console.log(`HomeAdminComponent: GetHomeRejectedSubscriptionRequest: res:  ${JSON.stringify(res)}`);
        this.dataSourceSelection = res;
        console.log(`HomeAdminComponent: GetHomeRejectedSubscriptionRequest: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
        this.dataSourceSelectionKind = 'subscription';
        this.rejectedSubscriptionNotification = true;
        this.cd.markForCheck();
      });
    } else {
      this.dataSourceSelection = this.rejectedSubscriptionRequest;
      this.dataSourceSelectionKind = 'subscription';
      console.log(`HomeAdminComponent: GetHomeRejectedSubscriptionRequest: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
      this.cd.markForCheck();
    }
  }

  private GetHomeAcceptedSubscriptionRequest() {
    if (!this.acceptedSubscriptionNotification) {
      this.homeFacade.getHomeAcceptedSubscriptionRequest(this.homeId).subscribe((res) => {
        this.acceptedSubscriptionRequest = res;
        console.log(`HomeAdminComponent: GetHomeAcceptedSubscriptionRequest: res:  ${JSON.stringify(res)}`);
        this.dataSourceSelection = res;
        console.log(`HomeAdminComponent: GetHomeAcceptedSubscriptionRequest: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
        this.dataSourceSelectionKind = 'subscription';
        this.acceptedSubscriptionNotification = true;
        this.cd.markForCheck();
      });
    } else {
      this.dataSourceSelection = this.acceptedSubscriptionRequest;
      this.dataSourceSelectionKind = 'subscription';
      console.log(`HomeAdminComponent: GetHomeAcceptedSubscriptionRequest: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
      this.cd.markForCheck();
    }
  }

  //#endregion

  //#region invitation Get methods
  private GetHomePendingHomeInvitation() {
    if (!this.pendingInvitationNotification) {
      this.homeFacade.getHomePendingInvitations(this.homeId).subscribe((res) => {
        this.pendingHomeInvitation = res;
        console.log(`HomeAdminComponent: GetHomePendingHomeInvitation: res:  ${JSON.stringify(res)}`);
        this.dataSourceSelection = res;
        console.log(`HomeAdminComponent: GetHomePendingHomeInvitation: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
        this.dataSourceSelectionKind = 'invitation';
        this.pendingInvitationNotification = true;
        this.cd.markForCheck();
      });
    } else {
      this.dataSourceSelection = this.pendingHomeInvitation;
      this.dataSourceSelectionKind = 'invitation';
      console.log(`HomeAdminComponent: GetHomePendingHomeInvitation: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
      this.cd.markForCheck();
    }
  }

  private GetHomeRejectedHomeInvitation() {
    if (!this.rejectedInvitationNotification) {
      this.homeFacade.getHomeRejectedInvitations(this.homeId).subscribe((res) => {
        this.rejectedHomeInvitation = res;
        console.log(`HomeAdminComponent: GetHomeRejectedHomeInvitation: res:  ${JSON.stringify(res)}`);
        this.dataSourceSelection = res;
        console.log(`HomeAdminComponent: GetHomeRejectedHomeInvitation: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
        this.dataSourceSelectionKind = 'invitation';
        this.rejectedInvitationNotification = true;
        this.cd.markForCheck();
      });
    } else {
      this.dataSourceSelection = this.rejectedHomeInvitation;
      this.dataSourceSelectionKind = 'invitation';
      console.log(`HomeAdminComponent: GetHomeRejectedHomeInvitation: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
      this.cd.markForCheck();
    }
  }

  private GetHomeAcceptedHomeInvitation() {
    if (!this.acceptedInvitationNotification) {
      this.homeFacade.getHomeAcceptedInvitations(this.homeId).subscribe((res) => {
        this.acceptedHomeInvitation = res;
        console.log(`HomeAdminComponent: GetHomeAcceptedHomeInvitation: res:  ${JSON.stringify(res)}`);
        this.dataSourceSelection = res;
        console.log(`HomeAdminComponent: GetHomeAcceptedHomeInvitation: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
        this.dataSourceSelectionKind = 'invitation';
        this.acceptedInvitationNotification = true;
        this.cd.markForCheck();
      });
    } else {
      this.dataSourceSelection = this.acceptedHomeInvitation;
      this.dataSourceSelectionKind = 'invitation';
      console.log(`HomeAdminComponent: GetHomeAcceptedHomeInvitation: dataSourceSelection:  ${JSON.stringify(this.dataSourceSelection)}`);
      this.cd.markForCheck();
    }
  }

  //#endregion

  //#region admin notifications methods
  private emitAdminNotification() {
    this.adminNotification.emit(true);
    this.cd.markForCheck();
  }

  private readNotification() {
    this.pendingSubscriptionNotification = this.subscriptionNotification;
    this.rejectedSubscriptionNotification = this.subscriptionNotification;
    this.acceptedSubscriptionNotification = this.subscriptionNotification;

    this.pendingInvitationNotification = this.invitationNotification;
    this.rejectedInvitationNotification = this.invitationNotification;
    this.acceptedInvitationNotification = this.invitationNotification;

    this.cd.markForCheck();
  }
  //#endregion
}


