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

  /* latitude: number;
  longitude: number; */
  address: string;
  titolMarcador: string;
  descripcioMarcador: string;
  private geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;
 
  

  constructor( readonly snackBar: MatSnackBar,
    public dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone ) { 

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

       

        if ( this.marcadores.length == 0) {
          this.getAddressNew(this.lat, this.lng);
        }
          else {       
            this.guardarStorage()
          }

         
      });
    }
    


  }
  
  agregarMarcador( evento ) {

    console.log('event-agregar-marcador', evento);

    const coords: { lat: number, lng: number } = evento.coords;

    this.addMarcador(coords.lat, coords.lng );

  }

  addMarcador(lat, lng) {
    this.getAddressNew(lat, lng)
    this.snackBar.open('Marcador guardat', 'Tancar', { duration: 500 }); 
  }

  guardarStorage() {
    console.log('passa per guardar storage')
    // en localStorage solament es pot grabar strings
    localStorage.setItem('marcadores', JSON.stringify( this.marcadores ) );
   // this.snackBar.open('Marcador guardat', 'Tancar', { duration: 500 }); 
    
  }

    // borrarMarcador( i: number ) {
    borrarMarcador(i:number) {
    this.marcadores.splice(i, 1); // eliminem el marcador
    this.guardarStorage();
    // component snackBar de Material
   this.snackBar.open('Marcador esborrat', 'Tancar', { duration: 500 })
  }


    editarMarcador( marcador: Marcador  ) {

    const dialogRef = this.dialog.open( MapaEditarComponent , {
      width: '250px',
      data: { titulo: marcador.titulo, desc: marcador.desc, address: marcador.address }
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
      marcador.address = result.address;
      /*  console.log('marcador modificat', marcador)
      console.log('marcadores despues modif', this.marcadores) */
      this.guardarStorage();
     
      this.snackBar.open('Marcador actualitzat', 'Tancar', { duration: 500 });

    });

  }

  borrarTodosLosMarcadores () {     
      this.marcadores = [];
      localStorage.removeItem('marcadores');
      this.snackBar.open('Tots els marcadors esborrats', 'Tancar', { duration: 500 })
   
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
    this.getAddressNew(this.lat, this.lng, marcador);    
    this.snackBar.open('Marcador mogut actualitzat', 'Tancar', { duration: 500 });
  }

  
  getAddressNew(latitude, longitude, marcador?) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      // console.log('results',results);
      //console.log(status);
      

      if (status === 'OK') {
        if (results[0]) {
          //this.zoom = 12;
          this.address = results[0].formatted_address;
          this.titolMarcador = results[0].address_components[2].short_name;  
          this.descripcioMarcador = results[0].address_components[1].short_name;

          if (marcador) {
            marcador.lat = latitude;
            marcador.lng = longitude;
            marcador.titulo = this.titolMarcador;
            marcador.desc = this.descripcioMarcador;
            marcador.address = this.address;       
            this.guardarStorage();
            
          } else {
            
          const nuevoMarcador = new Marcador( latitude, longitude )
          nuevoMarcador.titulo = this.titolMarcador;
          nuevoMarcador.desc = this.descripcioMarcador;
          nuevoMarcador.address = this.address; 
        
          this.marcadores.push( nuevoMarcador ) 
          this.guardarStorage();
          }
          
        } else {
          window.alert('Sense resultats');
        }
      } else {
        window.alert('El geocodificador ha fallat a causa de: ' + status);
      }

    });
  }

}
