import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Character {
  name: string;
  rarity: string;
  profession: string;
  subProfessionId: string;
  nationId: string;
  groupId: string;
}
@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  readonly path: string = '/assets/data/character_table.json';
  constructor(private httpClient: HttpClient) {}

  getCharacters() : Observable<any> {
    return this.httpClient.get<any>(this.path);
  }
}
