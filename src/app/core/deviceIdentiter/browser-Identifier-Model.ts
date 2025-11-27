import { v4 as uuidv4 } from 'uuid';
export class BrowserIdentifierModel {
  public deviceIdentifier: string = uuidv4();
  public createdAt: Date = new Date();
  public isActive: boolean = true;
  public updatedAt: Date | null = null;
  public isUpdated: boolean = false;
  public deletedAt: Date | null = null;
}
