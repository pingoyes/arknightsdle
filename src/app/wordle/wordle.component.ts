import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Character, CharacterService } from '../services/character.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-wordle',
  imports: [MatGridListModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatAutocompleteModule, ReactiveFormsModule,
    FormsModule, MatButtonModule, MatIconModule, 
    MatTooltipModule, TranslateModule, TitleCasePipe],
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.scss'
})
export class WordleComponent {
  @Input() data: Map<string, Character> | null = new Map<string, Character>();
  @Input() character: Character = this.characterService.getEmptyCharacter();
  @Input() maxAttempts: number = 7;
  @Input() enableHints: boolean = true;

  @Output() gameCompleted = new EventEmitter<string>();

  @Input() currentAttempts: number = 0;
  @Input() gameOver: boolean = false;
  @Input() characterChoices: string[] = [];
  @Input() saveProgress: boolean = false;
  
  characterChoicesData: Character[] = [];
  possibleChoices!: Set<string>;
  possibleChoicesArray!: string[];
  filteredOptions!: string[];

  hintUsed: boolean = false;

  @ViewChild('choiceInput') choiceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('choicesTable') choicesTable!: MatTable<Character>;
  @ViewChild('choiceInput', { read: MatAutocompleteTrigger }) choiceAutocomplete!: MatAutocompleteTrigger;
  choiceFormControl = new FormControl('');

  displayColumns: string[] = ['name', 'rarity', 'profession', 'subProfessionId', 'groupId'];

  constructor(public translate: TranslateService, private characterService: CharacterService) {}

  ngOnChanges() {
    this.restartGame();
  }

  restartGame() {
    if (this.data) {
      this.possibleChoices = new Set<string>(this.data.keys());
      if (this.saveProgress && this.characterChoices.length > 0) {
        this.characterChoices.forEach(value => {
          this.characterChoicesData.push(this.data?.get(value)!);
          this.possibleChoices.delete(value);
          this.possibleChoicesArray = Array.from(this.possibleChoices);
        })
        this.choicesTable?.renderRows();
      } else {
        this.gameOver = false;
        this.currentAttempts = 0;
        this.characterChoicesData = [];
        this.characterChoices = [];
        this.possibleChoicesArray = Array.from(this.possibleChoices);
        this.hintUsed = false;
      }
    }
  }

  onSubmit() {
    const value = this.choiceFormControl.value;
    if (value && !this.characterChoices.includes(value)) {
      this.currentAttempts += 1;
      if (value == this.character.name || this.currentAttempts == this.maxAttempts) {
        this.gameOver = true;
        this.gameCompleted.emit(value);
      }
      this.characterChoicesData.push(this.data?.get(value)!);
      this.characterChoices.push(value);
      this.possibleChoices.delete(value);
      this.possibleChoicesArray = Array.from(this.possibleChoices);
      this.choicesTable.renderRows();

      if (this.saveProgress) {
        localStorage.setItem("dailyGameOver", (this.gameOver == false ? 'false' : 'true'));
        localStorage.setItem('dailyCharacterChoices', JSON.stringify(Array.from(this.characterChoices)));
      }

      //console.log(this.data.get(value));
      this.choiceFormControl.reset();
      this.choiceInput.nativeElement.blur();
      this.choiceInput.nativeElement.value = '';
      this.filter();
      this.choiceAutocomplete.closePanel();
    }
  }

  onHintClick() : void {
    this.hintUsed = true;
  }

  filter(): void {
    const filterValue = this.choiceInput.nativeElement.value.toLowerCase();

    this.filteredOptions = this.possibleChoicesArray.filter(option => option.toLowerCase().includes(filterValue));
  }
}
