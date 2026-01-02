import { O } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-user-image-component',
  imports: [],
  templateUrl: './user-image-component.html',
  styleUrl: './user-image-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserImageComponent {
  @Input() currentImageUrl: string | null = null;
  @Output() newImageFile = new EventEmitter<File>();

  constructor(private cdr: ChangeDetectorRef) {}

  file: File | null = null;
  newImageUrl: string = '';

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.file = input.files[0];

    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newImageUrl = e.target?.result as string;
        this.cdr.markForCheck();
        input.value = ''; // allow re-select same file
      };
      reader.readAsDataURL(this.file);
      console.log('Image file selected:', this.file);
    }
  }
  uploadImage() {
    if (!this.file) return;
    console.log('Image uploaded');
    this.newImageFile.emit(this.file!);
  }
}
