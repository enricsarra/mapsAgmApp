import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
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
  panelOpenState = false;
  visible:boolean = false;
  visibleInfo:boolean = false;

  // nou
  latitude: number;
  longitude: number;
  address: string;
  private geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;
 
  

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

  // menu per search, marcadors i esborrar marcadors
  public isVisible() {
    this.visible = !this.visible
    console.log('visible', this.visible)
  }

 // text ajuda 
 public isVisibleInfo() {
  this.visibleInfo = !this.visibleInfo
}



  // Get Current Location Coordinates
  private setCurrentLocation() {

    // If you read the error message correctly, you need HTTPS to test Geolocation with Safari. You can testet with Chrome.




     if ('geolocation' in navigator) {  
      
      navigator.geolocation.getCurrentPosition((position) => {
      
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 15;


        if ( this.marcadores.length == 0) {
          
          const nuevoMarcador = new Marcador( this.lat, this.lng );
          this.marcadores.push( nuevoMarcador ) 
          this.guardarStorage();}
          else {
          
            this.guardarStorage()
          }

         
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
    this.snackBar.open('Marcador guardat', 'Tancar', { duration: 1000 }); 
    
  }



    // borrarMarcador( i: number ) {
    borrarMarcador(i:number) {
    this.marcadores.splice(i, 1); // eliminem el marcador
    this.guardarStorage();
    // component snackBar de Material
   this.snackBar.open('Marcador esborrat', 'Tancar', { duration: 1000 })
   

  }


    editarMarcador( marcador: Marcador  ) {

    const dialogRef = this.dialog.open( MapaEditarComponent , {
      width: '250px',
      data: { titulo: marcador.titulo, desc: marcador.desc }
    });

    // console.log('marcador actual',marcador );

    dialogRef.afterClosed().subscribe(result => {

     if ( !result ) {
        return;
      }

      
     /* console.log('marcador actual despres retorn',marcador );
    console.log('resultat rebut',result );  
      console.log('marcadores antes modif', this.marcadores); */
      // ojo es extrany

      marcador.titulo = result.titulo;
      marcador.desc = result.desc;
      /*  console.log('marcador modificat', marcador)
      console.log('marcadores despues modif', this.marcadores) */
      this.guardarStorage();
     
      this.snackBar.open('Marcador actualitzat', 'Tancar', { duration: 1000 });

    });

  }

  borrarTodosLosMarcadores () {     
      this.marcadores = [];
      localStorage.removeItem('marcadores');
      this.snackBar.open('Tots els marcadors esborrats', 'Tancar', { duration: 1000 })
   
  }

  irMarcador(marcador:Marcador) {
    // console.log('marcador', marcador)
    this.lat = marcador.lat;
    this.lng = marcador.lng
    
  }



  // nou

  // Get Current Location Coordinates
  private New() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  markerDragEnd($event: MouseEvent) {
    // console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
     // console.log(results);
      //console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

}
