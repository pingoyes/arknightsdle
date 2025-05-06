import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Character {
  name: string;
  rarity: string;
  profession: string;
  subProfessionId: string;
  nationId: string;
  groupId: string;
  itemUsage: string;
  itemDesc: string;
}
@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  readonly path: string = './assets/data/character_table.json';
  constructor(private httpClient: HttpClient) {}

  getCharacters() : Observable<Map<string, Character>> {
    return this.httpClient.get<any>(this.path).pipe(map(data => {
      let characterData = new Map<string, Character>();
      Object.keys(data).forEach(key => {
        if (data[key] && (data[key].nationId || data[key].groupId || data[key].teamId)) {
          characterData.set(data[key].name, {
            name: data[key].name,
            rarity: data[key].rarity,
            profession: data[key].profession,
            subProfessionId: data[key].subProfessionId,
            nationId: data[key].nationId,
            groupId: (data[key].teamId && !data[key].groupId && !data[key].nationId) ? data[key].teamId : data[key].groupId,
            itemUsage: data[key].itemUsage,
            itemDesc: data[key].itemDesc
          });
        }
      });
      return characterData;
    }));
  }

  getEmptyCharacter() : Character {
    return {name: '', rarity: '', profession: '', subProfessionId: '', nationId: '', groupId: '', itemUsage: '', itemDesc: ''};
  }
}
