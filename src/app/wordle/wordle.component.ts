import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Character } from '../services/character.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wordle',
  imports: [MatGridListModule, MatTableModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.scss'
})
export class WordleComponent {
  @Input() data: Map<string, Character> = new Map<string, Character>();
  @Input() character: Character = {name: '', rarity: '', profession: '', subProfessionId: '', nationId: '', groupId: ''};
  @Input() maxAttempts: number = Object.keys(this.character).length+1;

  @Output() gameCompleted = new EventEmitter<string>();

  currentAttempts: number = 0;
  gameOver: boolean = false;

  characterChoicesData: Character[] = [];
  characterChoices: Set<string> = new Set<string>();
  possibleChoices!: Set<string>;
  possibleChoicesArray!: string[];
  filteredOptions!: string[];

  @ViewChild('choiceInput') choiceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('choicesTable') choicesTable!: MatTable<Character>;
  choiceFormControl = new FormControl('');

  displayColumns: string[] = ['name', 'rarity', 'profession', 'subProfessionId', 'groupId'];

  constructor() {}

  ngOnChanges() {
    this.restartGame();
  }

  restartGame() {
    this.currentAttempts = 0;
    this.gameOver = false;
    this.characterChoicesData = [];
    this.characterChoices.clear();
    this.possibleChoices = new Set<string>(this.data.keys());
    this.possibleChoicesArray = Array.from(this.possibleChoices);
  }

  onSubmit() {
    const value = this.choiceFormControl.value;
    if (value && !this.characterChoices.has(value.toLowerCase())) {
      this.currentAttempts += 1;
      if (value == this.character.name || this.currentAttempts == this.maxAttempts) {
        this.gameOver = true;
        this.gameCompleted.emit(value);
      }
      this.characterChoicesData.push(this.data.get(value)!);
      this.characterChoices.add(value.toLowerCase());
      this.possibleChoices.delete(value);
      this.possibleChoicesArray = Array.from(this.possibleChoices);
      this.choicesTable.renderRows();

      
      //console.log(this.data.get(value));
      this.choiceFormControl.reset();
      this.choiceInput.nativeElement.value = '';
      this.filter();
    }
  }

  filter(): void {
    const filterValue = this.choiceInput.nativeElement.value.toLowerCase();

    this.filteredOptions = this.possibleChoicesArray.filter(option => option.toLowerCase().includes(filterValue));
  }
}
