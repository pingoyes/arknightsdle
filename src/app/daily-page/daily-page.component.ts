import { Component } from '@angular/core';
import { WordleComponent } from '../wordle/wordle.component';
import { MatButtonModule } from '@angular/material/button';
import { Character, CharacterService } from '../services/character.service';

@Component({
  selector: 'app-daily-page',
  imports: [WordleComponent, MatButtonModule],
  templateUrl: './daily-page.component.html',
  styleUrl: './daily-page.component.scss'
})
export class DailyPageComponent {
  pageTitle: string = 'Daily';
  character: Character = {name: '', rarity: '', profession: '', subProfessionId: '', nationId: '', groupId: ''};
  characterData: Map<string, Character> = new Map<string, Character>();

  finalCharacter: string = '';

  constructor(private characterService: CharacterService) {}
  
  ngOnInit() {
    this.characterService.getCharacters().subscribe(data => {
      Object.keys(data).forEach(key => {
        if (data[key] && (data[key].nationId || data[key].groupId || data[key].teamId)) {
          this.characterData.set(data[key].name, {
            name: data[key].name,
            rarity: data[key].rarity,
            profession: data[key].profession,
            subProfessionId: data[key].subProfessionId,
            nationId: data[key].nationId,
            groupId: (data[key].teamId && !data[key].groupId && !data[key].nationId) ? data[key].teamId : data[key].groupId,
          });
        } 
      });
      this.updateCharacter();
    })
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
