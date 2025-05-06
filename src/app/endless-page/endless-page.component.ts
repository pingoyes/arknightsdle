import { Component } from '@angular/core';
import { WordleComponent } from '../wordle/wordle.component';
import { MatButtonModule } from '@angular/material/button';
import { Character, CharacterService } from '../services/character.service';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-endless-page',
    imports: [WordleComponent, MatButtonModule, TranslateModule, AsyncPipe],
    templateUrl: './endless-page.component.html',
    styleUrl: './endless-page.component.scss'
})
export class EndlessPageComponent {
    character: Character = this.characterService.getEmptyCharacter();
    characterData$!: Observable<Map<string, Character>>;

    finalCharacter: string = '';
    score: number = 0;
    maxScore: number = parseInt(localStorage.getItem("maxScore") as string) | 0;

    constructor(private characterService: CharacterService) {}
    
    ngOnInit() {
        this.characterData$ = this.characterService.getCharacters().pipe(map(data => {
            this.updateCharacter(data);
            return data;
        }), shareReplay(1));    
    }

    updateCharacter(data: Map<string, Character>) : void {
        if (this.finalCharacter != this.character.name) {
            this.score = 0;
        }
        this.finalCharacter = '';
        let randomChar = this.character;

        while (randomChar == this.character) {
            randomChar = this.selectRandomChar(Array.from(data.values()), data.size);
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
