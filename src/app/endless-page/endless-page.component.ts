import { Component } from '@angular/core';
import { WordleComponent } from '../wordle/wordle.component';
import { MatButtonModule } from '@angular/material/button';
import { Character, CharacterService } from '../services/character.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-endless-page',
  imports: [WordleComponent, MatButtonModule, TranslateModule],
  templateUrl: './endless-page.component.html',
  styleUrl: './endless-page.component.scss'
})
export class EndlessPageComponent {
  character: Character = this.characterService.getEmptyCharacter();
  characterData: Map<string, Character> = new Map<string, Character>();

  finalCharacter: string = '';
  score: number = 0;

  constructor(private characterService: CharacterService) {}
  
  ngOnInit() {
    this.characterService.getCharacters().subscribe(data => {
      this.characterData = data;
      this.updateCharacter();
    });
  }

  updateCharacter() : void {
    if (this.finalCharacter != this.character.name) {
      this.score = 0;
    }
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

  onGameCompleted(value: string) : void {
    this.finalCharacter = value;
    if (this.finalCharacter == this.character.name) {
      this.score += 1;
    }
  }
}
