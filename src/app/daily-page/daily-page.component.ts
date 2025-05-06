import { Component } from '@angular/core';
import { WordleComponent } from '../wordle/wordle.component';
import { MatButtonModule } from '@angular/material/button';
import { Character, CharacterService } from '../services/character.service';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-daily-page',
  imports: [WordleComponent, MatButtonModule, TranslateModule, AsyncPipe],
  templateUrl: './daily-page.component.html',
  styleUrl: './daily-page.component.scss'
})
export class DailyPageComponent {
  character: Character = this.characterService.getEmptyCharacter();
  characterData$!: Observable<Map<string, Character>>;

  finalCharacter: string = '';

  currentAttempts: number = 0;
  gameOver: boolean = true;
  characterChoices: string[] = [];
  saveProgress: boolean = true;

  constructor(private characterService: CharacterService) {}
  
  ngOnInit() {
    this.characterData$ = this.characterService.getCharacters().pipe(map(data => {
      this.updateCharacter(data);
      return data;
    }), shareReplay(1));  
  }

  updateCharacter(data: Map<string, Character>) : void {
    this.finalCharacter = '';
    let randomChar = this.character;

    while (randomChar == this.character) {
      randomChar = this.selectRandomDailyChar(Array.from(data.values()), data.size);
    }
    this.character = randomChar ? randomChar : this.character;
  }

  selectRandomDailyChar(chars: Character[], range: number) : Character {
    let randInt: number;

    const date = new Date();
    const today = date.getFullYear().toString() + date.getMonth() + date.getDate();
    const savedDate = localStorage.getItem("date") as string;

    if (!savedDate || savedDate != today || !localStorage.getItem("dailyChar")) {
      localStorage.setItem("date", today);
      randInt = Math.floor(Math.random()*range);
      localStorage.setItem("dailyChar", randInt.toString());
      this.gameOver = false;
    } else {
      randInt = parseInt(localStorage.getItem("dailyChar") as string);
      
      this.gameOver = localStorage.getItem("dailyGameOver") == 'true' ? true : false;
      const savedChoicesStr = localStorage.getItem('dailyCharacterChoices') as string;
      this.characterChoices = savedChoicesStr ? JSON.parse(savedChoicesStr) : new Set<string>();
      this.currentAttempts = this.characterChoices.length;
      if (this.gameOver) {
        this.onGameCompleted(this.characterChoices[this.characterChoices.length-1]);
      }
    }

    const randomChar = chars[randInt];
    console.log(randomChar);

    return randomChar;
  }

  onGameCompleted(value: string) {
    this.finalCharacter = value;
  }
}
