import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  //marcadores: Marcador[] = [];
  marcadores = [];

  lat: number;
  lng: number;
  zoom = 15;
  /* lat = 51.678418;
  lng = 7.809007; */

  constructor() { }

  ngOnInit(): void {
    this.setCurrentLocation();
  }
  // Get Current Location Coordinates
  private setCurrentLocation() {

    // If you read the error message correctly, you need HTTPS to test Geolocation with Safari. You can testet with Chrome.

    // if ('geolocation' in navigator) {  
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('position', position);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
      });
   // }

  }
    // borrarMarcador( i: number ) {
    borrarMarcador( ) {

    /* this.marcadores.splice(i, 1);
    this.guardarStorage();
    this.snackBar.open('Marcador borrado', 'Cerrar', { duration: 3000 }); */
  }

  // editarMarcador( marcador: Marcador ) {
    editarMarcador(  ) {

    /* const dialogRef = this.dialog.open( MapaEditarComponent , {
      width: '250px',
      data: { titulo: marcador.titulo, desc: marcador.desc }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if ( !result ) {
        return;
      }

      marcador.titulo = result.titulo;
      marcador.desc = result.desc;

      this.guardarStorage();
      this.snackBar.open('Marcador actualizado', 'Cerrar', { duration: 3000 });

    }); */

  }

}
