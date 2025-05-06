import { Component } from '@angular/core';
import { WordleComponent } from '../wordle/wordle.component';
import { MatButtonModule } from '@angular/material/button';
import { Character, CharacterService } from '../services/character.service';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { sfc32, cyrb128 } from '../utils/seed-random-util';

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
    const date = new Date();
    const today = date.getFullYear().toString() + date.getMonth() + date.getDate();
    const seed = cyrb128(today);
    const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
    const randomChar = chars[Math.round(rand()*range)];
    const savedDate = localStorage.getItem("date") as string;

    if (savedDate != today) {
      localStorage.setItem("date", today);
      localStorage.setItem("dailyGameOver", 'false');
      localStorage.setItem('dailyCharacterChoices', JSON.stringify([]));
      this.gameOver = false;
    } else {
      this.gameOver = localStorage.getItem("dailyGameOver") == 'true' ? true : false;
      const savedChoicesStr = localStorage.getItem('dailyCharacterChoices') as string;
      this.characterChoices = savedChoicesStr ? JSON.parse(savedChoicesStr) : new Set<string>();
      this.currentAttempts = this.characterChoices.length;
      if (this.gameOver) {
        this.onGameCompleted(this.characterChoices[this.characterChoices.length-1]);
      }
    }

    console.log(randomChar);

    return randomChar;
  }

  onGameCompleted(value: string) {
    this.finalCharacter = value;
  }
}
