import { Component } from '@angular/core';
import { WordleComponent } from '../wordle/wordle.component';
import { MatButtonModule } from '@angular/material/button';
import { Character, CharacterService } from '../services/character.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-daily-page',
  imports: [WordleComponent, MatButtonModule, TranslateModule],
  templateUrl: './daily-page.component.html',
  styleUrl: './daily-page.component.scss'
})
export class DailyPageComponent {
  pageTitle: string = 'Daily';
  character: Character = this.characterService.getEmptyCharacter();
  characterData: Map<string, Character> = new Map<string, Character>();

  finalCharacter: string = '';

  constructor(private characterService: CharacterService) {}
  
  ngOnInit() {
    this.characterService.getCharacters().subscribe(data => {
      this.characterData = data;
      this.updateCharacter();
    });
  }

  updateCharacter() : void {
    this.finalCharacter = '';
    let randomChar = this.character;

    while (randomChar == this.character) {
      randomChar = this.selectRandomChar(Array.from(this.characterData.values()));
    }
    this.character = randomChar ? randomChar : this.character;
  }

  selectRandomChar(chars: Character[]) : Character {
    const randomChar = chars[this.randomIntByDate(this.characterData.size)];
    console.log(randomChar);

    return randomChar;
  }

  // TODO: Add seeding lib
  randomIntByDate(range: number) : number {
    const date = new Date();
    const randomSeed = parseInt(date.getFullYear() + "" + date.getMonth() +  date.getDay());
    return Math.floor(Math.random()*range);
  }

  onGameCompleted(value: string) {
    this.finalCharacter = value;
  }
}
