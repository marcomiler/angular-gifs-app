import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'// asi se eleva de manera global
})
export class GifsService {

  private apiKey: string = 'A6XmZMW1DivoMFDWlOEx9wQrK4ljwGCg';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _history: string[] = [];

  //TODO: Cambiar el Any por su tipo
  public resultados: Gif[] = [];

  get history(){
    //[...this._history] rompemos la referencia para que no podamos modificar el array original
    return [...this._history];
  }

  constructor(private http: HttpClient){
    //como nuestro servicio se ejecutara una sola vez ya que Angular maneja los servicios como Singleton, codeamos aquí el mantener nuestro localStorage
    // if(localStorage.getItem('historial')){
    //   this._history = JSON.parse(localStorage.getItem('historial')!);
    // }
    //o tambien:
    this._history = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  searchGifs(query: string = ''){

    query = query.trim().toLowerCase();

    if(!this._history.includes(query)){      
      this._history.unshift(query);//añadir al primer inicio del arreglo
      this._history = this._history.splice(0,10);//limitar los primeros 10 elementos del arreglo

      localStorage.setItem('historial', JSON.stringify(this._history));//convierte un objeto a un string
    }

    const params = new HttpParams().set('api_key', this.apiKey)
                                   .set('limit', '10')
                                   .set('q', query);

    this.http.get<SearchResponse>(`${this.servicioUrl}/search`, {params})
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
