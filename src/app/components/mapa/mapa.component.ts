import { Component, OnInit } from '@angular/core';

import { Marcador } from '../../classes/marcador.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MapaEditarComponent} from "./mapa-editar.component"


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  //marcadores: Marcador[] = [];
  marcadores: Marcador[] = [];

  /* lat: number;
  lng: number; */
  title = 'My first AGM project';
  lat = 51.678418;
  lng = 7.809007;


  zoom = 15;
  

  constructor( readonly snackBar: MatSnackBar,
    public dialog: MatDialog ) { 

    /* const nuevoMarcador = new Marcador(51.678418,7.809007)
    this.marcadores.push(nuevoMarcador) */

    if ( localStorage.getItem('marcadores') ) {
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));
    }
  }

  ngOnInit(): void {
    this.setCurrentLocation();
  }
  // Get Current Location Coordinates
  private setCurrentLocation() {

    // If you read the error message correctly, you need HTTPS to test Geolocation with Safari. You can testet with Chrome.

     if ('geolocation' in navigator) {  
      
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log('position', position);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;
      });
    }
    
/*     navigator.geolocation.getCurrentPosition(function(){
      alert('Location accessed')
},function(){
     alert('User not allowed')
},{timeout:10000})
 */

  }
  
  agregarMarcador( evento ) {

    const coords: { lat: number, lng: number } = evento.coords;

    const nuevoMarcador = new Marcador( coords.lat, coords.lng );

    this.marcadores.push( nuevoMarcador );
     

    this.guardarStorage();

  }

  guardarStorage() {
    // en localStorage solament es pot grabar strings
    localStorage.setItem('marcadores', JSON.stringify( this.marcadores ) );
    this.snackBar.open('Marcador afegit', 'Tancar', { duration: 3000 }); 
  }



    // borrarMarcador( i: number ) {
    borrarMarcador(i:number) {
      console.log('index', i)
    this.marcadores.splice(i, 1); // eliminem el marcador
    this.guardarStorage();
    console.log('marcadores', this.marcadores)

    // component snackBar de Material
   this.snackBar.open('Marcador esborrat', 'Tancar', { duration: 3000 })
   

  }


    editarMarcador( marcador: Marcador  ) {

    const dialogRef = this.dialog.open( MapaEditarComponent , {
      width: '250px',
      data: { titulo: marcador.titulo, desc: marcador.desc }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);

      if ( !result ) {
        return;
      }

      marcador.titulo = result.titulo;
      marcador.desc = result.desc;

      this.guardarStorage();
      this.snackBar.open('Marcador actualitzat', 'Tancar', { duration: 3000 });

    });

  }

  borrarTodosLosMarcadores () {     
      this.marcadores = [];
      localStorage.removeItem('marcadores');
      this.snackBar.open('Tots els marcadors esborrats', 'Tancar', { duration: 3000 })
   
  }

}
