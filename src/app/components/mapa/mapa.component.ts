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
  lat = 39.56263457143857
  ;
  lng = 2.647812795214848;
  zoom = 12;
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
    public dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone ) { 

    /* const nuevoMarcador = new Marcador(51.678418,7.809007)
    this.marcadores.push(nuevoMarcador) */

    if ( localStorage.getItem('marcadores') ) {
      
      this.marcadores = JSON.parse(localStorage.getItem('marcadores'));
      
    }
    
  }

  ngOnInit(): void {
    this.loadPlacesAutocomplete()
    // this.setCurrentLocation();
  }

  // menu per search, marcadors i esborrar marcadors
  public isVisible() {
    this.visible = !this.visible
  }

 // text ajuda 
 public isVisibleInfo() {
  this.visibleInfo = !this.visibleInfo
}



  // Get Current Location Coordinates
  private setCurrentLocation() {

    
     if ('geolocation' in navigator) {  
      
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        // this.zoom = 12;

       this.getAddress(this.lat, this.lng);

        if ( this.marcadores.length == 0) {
          
          const nuevoMarcador = new Marcador( this.lat, this.lng );
          this.marcadores.push( nuevoMarcador ) 
          this.guardarStorage();}
          else {
          
            this.guardarStorage()
          }

         
      });
    }
    


  }
  
  agregarMarcador( evento ) {

    const coords: { lat: number, lng: number } = evento.coords;

    this.addMarcador(coords.lat, coords.lng );

    /* const nuevoMarcador = new Marcador( coords.lat, coords.lng );
    this.marcadores.push( nuevoMarcador );  
    this.guardarStorage();
 */
  }

  addMarcador(lat, lng) {
    const nuevoMarcador = new Marcador(lat,lng );
    this.getAddress(nuevoMarcador.lat, nuevoMarcador.lng)
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
    this.lat = marcador.lat;
    this.lng = marcador.lng 
  }

 
loadPlacesAutocomplete() {

  this.mapsAPILoader.load().then(() => {
    this.setCurrentLocation();
    this.geoCoder = new google.maps.Geocoder;

    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
      
        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        //set latitude, longitude and zoom
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        // this.zoom = 12;
        this.addMarcador(this.lat, this.lng)
        
      });
    });
  });

}







  markerDragEnd($event: MouseEvent, marcador:Marcador) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
    marcador.lat = this.lat;
    marcador.lng = this.lng;
    this.guardarStorage();
     
      this.snackBar.open('Marcador mogut actualitzat', 'Tancar', { duration: 1000 });
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log('results',results);
      //console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          //this.zoom = 12;
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
