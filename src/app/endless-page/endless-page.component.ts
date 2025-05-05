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
  maxScore: number = parseInt(localStorage.getItem("maxScore") as string) | 0;

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
      randomChar = this.selectRandomChar(Array.from(this.characterData.values()), this.characterData.size);
    }
    this.character = randomChar ? randomChar : this.character;
  }

  selectRandomChar(chars: Character[], range: number) : Character {
    const randomChar = chars[Math.floor(Math.random()*range)];
    console.log(randomChar);

    return randomChar;
  }

  onGameCompleted(value: string) : void {
    this.finalCharacter = value;
    if (this.finalCharacter == this.character.name) {
      this.score += 1;
      const savedScore = parseInt(localStorage.getItem("maxScore") as string);
      if (!savedScore || this.score > savedScore) {
        localStorage.setItem("maxScore", this.score.toString());
        this.maxScore = this.score;
      }
    }
  }
}
